import { ActiveUser, ActiveUserData } from '@be/common';
import { PrismaClientService } from '@db/prisma-client';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { toFileStream } from 'qrcode';
import { AccountValidationService } from './account-validation/account-validation.service';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import {
  AuthResponse,
  RequestAccountValidationDto,
  UserProfile,
  UserProfileResponse
} from './dto/account-validation.dto/account-validation.dto';
import { ExtendedSignUpDto } from './dto/extended-sign-up.dto/extended-sign-up.dto';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto
} from './dto/password-management.dto/password-management.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { UpdatePhotoDto } from './dto/update-profile.dto/update-profile.dto';
import { AuthType } from './enums/auth-type.enum';
import { OtpAuthenticationService } from './otp-authentication/otp-authentication.service';
import { PasswordResetService } from './password-reset/password-reset.service';
import { UserProfileService } from './user-profile/user-profile.service';
@Auth(AuthType.None) // This allows public routes
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly accountValidationService: AccountValidationService,
    private readonly passwordResetService: PasswordResetService,
    private readonly otpAuthenticationService: OtpAuthenticationService,
    private readonly userProfileService: UserProfileService,
    private readonly i18n: I18nService,
    private readonly prisma: PrismaClientService
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authenticationService.signUp(signUpDto);
  }


  @HttpCode(HttpStatus.OK) // by default @Post does 201, we wanted 200 - hence using @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authenticationService.signIn(signInDto);
  }

  // Cookies approach
  @HttpCode(HttpStatus.OK) // by default @Post does 201, we wanted 200 - hence using @HttpCode(HttpStatus.OK)
  @Post('sign-in-cookies')
  async signInCookie(
    @Res({ passthrough: true}) response: Response,
    @Body() signInDto: SignInDto) {
    const accessToken = await this.authenticationService.signIn(signInDto);
    response.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
  }

  // Token refresh ask
  @HttpCode(HttpStatus.OK) // changed since the default is 201
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authenticationService.refreshTokens(refreshTokenDto);
  }

  // 2fa QR code generate
  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('2fa/generate')
  async generateQrCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Res() response: Response,
  ) {
    const { secret, uri } = await this.otpAuthenticationService.generateSecret(
      activeUser.email
    );
    await this.otpAuthenticationService.enableTfaForUser(activeUser.email, secret);
    response.type('png');
    return toFileStream(response, uri);
  }

  // ==================== AUTHS COMPATIBILITY ROUTES ====================

  /**
   * Extended registration with profile information (AUTHS compatible)
   */
  @Post('register-extended')
  async registerExtended(@Body() registerDto: ExtendedSignUpDto, @I18nLang() lang: string): Promise<AuthResponse> {
    try {
      console.log('🔍 Register attempt:', { email: registerDto.email, hasPassword: !!registerDto.password });
      const result = await this.authenticationService.signUpExtended(registerDto);
      console.log('✅ Registration successful:', { userId: result.user });
      return {
        success: true,
        message: await this.i18n.translate("auths.REGISTRATION_DONE", { lang })
      };
    } catch (error) {
      console.error('❌ Registration failed:', error instanceof Error ? error.message : error);
      return {
        success: false,
        message: await this.i18n.translate("auths.REGISTRATION_FAIL", { lang })
      };
    }
  }

  /**
   * Get user profile by email (AUTHS compatible)
   */
  @Auth(AuthType.Bearer)
  @Get('user/:email')
  async getUserProfile(@Param('email') email: string, @I18nLang() lang: string): Promise<UserProfileResponse | AuthResponse> {
    return await this.userProfileService.getUserByEmail(email, lang);
  }

  /**
   * Check user credentials (AUTHS compatible)
   */
  @Auth(AuthType.Bearer)
  @Get('check-credentials/:email')
  async checkCredentials(@Param('email') email: string, @I18nLang() lang: string): Promise<UserProfileResponse | AuthResponse> {
    return await this.userProfileService.checkUserCredentials(email, lang);
  }

  /**
   * Request account validation email (AUTHS compatible)
   */
  @Post('request-account-validation')
  async requestAccountValidation(@Body() dto: RequestAccountValidationDto, @I18nLang() lang: string): Promise<AuthResponse> {
    return await this.accountValidationService.sendAccountValidationEmail(dto.email, lang);
  }

  /**
   * Validate account with token (AUTHS compatible)
   */
  @Get('validate-account/:token')
  async validateAccount(@Param('token') token: string, @I18nLang() lang: string): Promise<AuthResponse> {
    return await this.accountValidationService.validateAccount(token, lang);
  }

  /**
   * Send forgot password email (AUTHS compatible)
   */
  @Post('forgot-password')
  async sendForgotPasswordEmail(@Body() dto: ForgotPasswordDto, @I18nLang() lang: string): Promise<AuthResponse> {
    return await this.passwordResetService.sendForgotPasswordEmail(dto.email, lang);
  }

  /**
   * Verify reset password token (AUTHS compatible)
   */
  @Get('reset-password/:token')
  async verifyResetToken(@Param('token') token: string, @I18nLang() lang: string): Promise<{ valid: boolean; message: string }> {
    const result = await this.passwordResetService.verifyResetToken(token, lang);
    return {
      valid: result.valid,
      message: result.message
    };
  }

  /**
   * Reset password with token (AUTHS compatible)
   */
  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() dto: ResetPasswordDto,
    @I18nLang() lang: string
  ): Promise<AuthResponse> {
    return await this.passwordResetService.resetPassword(token, dto.newPassword, dto.verifyPassword, lang);
  }

  /**
   * Get current user profile (authenticated user)
   */
  @Auth(AuthType.Bearer)
  @Get('profile')
  async getCurrentUserProfile(
    @ActiveUser() activeUser: ActiveUserData,
    @I18nLang() lang: string
  ): Promise<UserProfileResponse | AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: activeUser.sub },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        nickName: true,
        title: true,
        Gender: true,
        Language: true,
        photoUrl: true,
        Roles: true
      }
    });

    if (!user) {
      return {
        success: false,
        message: await this.i18n.translate('auths.USER_NOT_FOUND', { lang })
      };
    }

    const userProfile: UserProfile = {
      email: user.email,
      lastName: user.lastName || undefined,
      firstName: user.firstName || undefined,
      nickName: user.nickName || undefined,
      title: user.title || undefined,
      Gender: user.Gender || undefined,
      Role: user.Roles ? user.Roles.map(role => role.toString()) : undefined,
      Language: user.Language || undefined,
      photoUrl: user.photoUrl || undefined
    };

    const fullName = this.userProfileService.generateFullName(user.firstName, user.lastName);

    return {
      user: userProfile,
      fullName
    };
  }

  /**
   * Update user profile photo (AUTHS compatible)
   */
  @Auth(AuthType.Bearer)
  @Put('update-photo')
  async updatePhoto(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() dto: UpdatePhotoDto,
    @I18nLang() lang: string
  ): Promise<AuthResponse & { photoUrl?: string }> {
    return await this.userProfileService.updateUserPhoto(activeUser.sub, dto.photoUrl, lang);
  }

  /**
   * Change password for authenticated user (AUTHS compatible)
   */
  @Auth(AuthType.Bearer)
  @Post('change-password')
  async changePassword(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() dto: ChangePasswordDto,
    @I18nLang() lang: string
  ): Promise<AuthResponse> {
    return await this.passwordResetService.changePassword(
      activeUser.sub,
      dto.oldPassword,
      dto.newPassword,
      dto.verifyPassword,
      lang
    );
  }
}

