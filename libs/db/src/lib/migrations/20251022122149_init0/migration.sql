-- CreateEnum
CREATE TYPE "TaskState" AS ENUM ('CREATION', 'STANDBY', 'RUNNING', 'DONE');

-- CreateEnum
CREATE TYPE "TodoState" AS ENUM ('CREATION', 'STANDBY', 'RUNNING', 'DONE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMELE', 'UNKNOWN', 'NONE');

-- CreateEnum
CREATE TYPE "Title" AS ENUM ('Mr', 'Mme', 'Dct');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('Manager', 'Member', 'Individual', 'Secretary');

-- CreateEnum
CREATE TYPE "PhoneType" AS ENUM ('Mobile', 'Home', 'Work', 'Organisation', 'Other');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('Home', 'Work', 'Organisation', 'Other');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en', 'fr');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GUEST', 'USER', 'ADMIN', 'SUPERADMIN', 'REGULAR');

-- CreateEnum
CREATE TYPE "PermissionClaim" AS ENUM ('CreateCoffee', 'UpdateCoffee', 'DeleteCoffee');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL', 'API', 'FORGOT', 'ACCOUNT', 'REFREZH');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "numSeq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN DEFAULT false,
    "isPublic" BOOLEAN DEFAULT true,
    "isDeleted" INTEGER DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" JSON,
    "emailITAdmin" TEXT NOT NULL,
    "webSite" TEXT,
    "mainOrgId" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgEmail" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "description" TEXT,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "OrgEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgDomain" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "domainName" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "OrgDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgEmailUseTo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "useTo" TEXT NOT NULL,
    "isActiv" BOOLEAN NOT NULL,
    "emailOrgId" INTEGER NOT NULL,

    CONSTRAINT "OrgEmailUseTo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "numSeq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN DEFAULT false,
    "isPublic" BOOLEAN DEFAULT true,
    "isDeleted" INTEGER DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "lastName" TEXT,
    "firstName" TEXT,
    "title" "Title",
    "nickName" TEXT,
    "Gender" "Gender" DEFAULT 'UNKNOWN',
    "social" JSON,
    "Language" "Language" DEFAULT 'en',
    "photoUrl" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "hasEmergencyContact" BOOLEAN NOT NULL DEFAULT false,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "jobTitle" TEXT,
    "position" "Position" DEFAULT 'Individual',
    "isValidated" TIMESTAMP(3),
    "isSuspended" TIMESTAMP(3),
    "managerId" TEXT,
    "Roles" "Role"[],
    "Permissions" "PermissionClaim"[],
    "isTfaEnable" BOOLEAN NOT NULL DEFAULT false,
    "tfaSecret" TEXT,
    "passWordFaker" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phone" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "extension" TEXT,
    "phoneType" "PhoneType" DEFAULT 'Mobile',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "addressType" "AddressType" DEFAULT 'Home',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSecret" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "pwdHash" TEXT,
    "salt" TEXT,
    "isAdmin" BOOLEAN DEFAULT false,

    CONSTRAINT "UserSecret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "orderProfile" INTEGER NOT NULL,
    "bio" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "orderGroup" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActiv" TIMESTAMP(3),
    "orgId" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "numSeq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "orderTodo" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "todoState" "TodoState" NOT NULL DEFAULT 'CREATION',
    "mainTodo" TEXT,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTodoLink" (
    "userId" TEXT NOT NULL,
    "todoId" TEXT NOT NULL,
    "isAuthor" BOOLEAN NOT NULL DEFAULT true,
    "isAssigned" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "UserTodoLink_pkey" PRIMARY KEY ("userId","todoId")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "numSeq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "orderTask" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "taskState" "TaskState" NOT NULL DEFAULT 'CREATION',
    "mainTask" TEXT,
    "todoId" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTaskLink" (
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "isAuthor" BOOLEAN NOT NULL DEFAULT true,
    "isAssigned" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "UserTaskLink_pkey" PRIMARY KEY ("userId","taskId")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "numSeq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "orderPost" INTEGER,
    "title" TEXT NOT NULL,
    "content" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "numSeq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN DEFAULT false,
    "isPublic" BOOLEAN DEFAULT true,
    "isDeleted" INTEGER DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "orderCategory" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "numSeq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN DEFAULT false,
    "isPublic" BOOLEAN DEFAULT true,
    "isDeleted" INTEGER DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "orderComment" INTEGER NOT NULL,
    "content" TEXT,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "numSeq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "extension" TEXT,
    "encoding" TEXT,
    "storageType" TEXT NOT NULL DEFAULT 'local',
    "storagePath" TEXT,
    "storageUrl" TEXT,
    "bucketName" TEXT,
    "storageName" TEXT,
    "binaryData" BYTEA,
    "category" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "version" TEXT DEFAULT '1.0',
    "checksum" TEXT,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "processingStatus" TEXT DEFAULT 'pending',
    "virusScanStatus" TEXT DEFAULT 'pending',
    "ocrText" TEXT,
    "isPublicDownload" BOOLEAN NOT NULL DEFAULT false,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "lastAccessedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isArchived" TIMESTAMP(3),
    "name" TEXT,
    "type" TEXT,
    "data" TEXT,
    "size" INTEGER,
    "ownerId" TEXT NOT NULL,
    "uploadedById" TEXT,
    "associatedId" TEXT,
    "associationType" TEXT,
    "orgId" TEXT NOT NULL,
    "postId" TEXT,
    "storyId" TEXT,
    "profileUserId" TEXT,
    "commentId" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFollower" (
    "user_id" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollower_pkey" PRIMARY KEY ("user_id","follower_id")
);

-- CreateTable
CREATE TABLE "PostLike" (
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "numSeq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN DEFAULT false,
    "isPublic" BOOLEAN DEFAULT true,
    "isDeleted" INTEGER DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "caption" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "numSeq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "storageType" TEXT NOT NULL DEFAULT 'local',
    "storagePath" TEXT,
    "storageUrl" TEXT,
    "bucketName" TEXT,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "thumbnailUrl" TEXT,
    "variants" JSON,
    "tags" TEXT[],
    "altText" TEXT,
    "description" TEXT,
    "uploadedById" TEXT NOT NULL,
    "associatedId" TEXT,
    "associationType" TEXT,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "orgId" TEXT,
    "postId" TEXT,
    "profileUserId" TEXT,
    "storyId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigParam" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "utility" TEXT NOT NULL,

    CONSTRAINT "ConfigParam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppEmailDomain" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "domain" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL,

    CONSTRAINT "AppEmailDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "key" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scope" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "scope" TEXT NOT NULL,

    CONSTRAINT "Scope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "tokenId" TEXT,
    "type" "TokenType" NOT NULL,
    "emailToken" TEXT,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "expiration" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountValidation" (
    "id" TEXT NOT NULL,
    "numSeq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN DEFAULT false,
    "isPublic" BOOLEAN DEFAULT true,
    "isDeleted" INTEGER DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "isValidated" BOOLEAN NOT NULL DEFAULT false,
    "emailToken" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountValidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangesTracking" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" INTEGER NOT NULL DEFAULT 0,
    "isDeletedDT" TIMESTAMP(3),
    "doneAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedById" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "newData" JSONB NOT NULL,
    "oldData" JSONB NOT NULL,

    CONSTRAINT "ChangesTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrganizationToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrganizationToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UsersProfiles" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UsersProfiles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GroupToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GroupToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GroupToTask" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GroupToTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GroupToTodo" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GroupToTodo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GroupToPost" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GroupToPost_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PostsCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostsCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FileToGroup" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FileToGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_apikeysscopes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_apikeysscopes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSecret_userId_key" ON "UserSecret"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "File_storageName_key" ON "File"("storageName");

-- CreateIndex
CREATE INDEX "File_ownerId_idx" ON "File"("ownerId");

-- CreateIndex
CREATE INDEX "File_uploadedById_idx" ON "File"("uploadedById");

-- CreateIndex
CREATE INDEX "File_associatedId_associationType_idx" ON "File"("associatedId", "associationType");

-- CreateIndex
CREATE INDEX "File_orgId_idx" ON "File"("orgId");

-- CreateIndex
CREATE INDEX "File_createdAt_idx" ON "File"("createdAt");

-- CreateIndex
CREATE INDEX "File_mimeType_idx" ON "File"("mimeType");

-- CreateIndex
CREATE INDEX "File_category_idx" ON "File"("category");

-- CreateIndex
CREATE INDEX "File_isDeleted_idx" ON "File"("isDeleted");

-- CreateIndex
CREATE INDEX "File_checksum_idx" ON "File"("checksum");

-- CreateIndex
CREATE INDEX "File_processingStatus_idx" ON "File"("processingStatus");

-- CreateIndex
CREATE INDEX "File_virusScanStatus_idx" ON "File"("virusScanStatus");

-- CreateIndex
CREATE INDEX "File_tags_idx" ON "File"("tags");

-- CreateIndex
CREATE INDEX "Image_uploadedById_idx" ON "Image"("uploadedById");

-- CreateIndex
CREATE INDEX "Image_associatedId_associationType_idx" ON "Image"("associatedId", "associationType");

-- CreateIndex
CREATE INDEX "Image_orgId_idx" ON "Image"("orgId");

-- CreateIndex
CREATE INDEX "Image_createdAt_idx" ON "Image"("createdAt");

-- CreateIndex
CREATE INDEX "Image_mimeType_idx" ON "Image"("mimeType");

-- CreateIndex
CREATE INDEX "Image_isDeleted_idx" ON "Image"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "ConfigParam_name_key" ON "ConfigParam"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AppEmailDomain_domain_key" ON "AppEmailDomain"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenId_key" ON "RefreshToken"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_tokenId_key" ON "Token"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_emailToken_key" ON "Token"("emailToken");

-- CreateIndex
CREATE UNIQUE INDEX "AccountValidation_emailToken_key" ON "AccountValidation"("emailToken");

-- CreateIndex
CREATE INDEX "_OrganizationToUser_B_index" ON "_OrganizationToUser"("B");

-- CreateIndex
CREATE INDEX "_UsersProfiles_B_index" ON "_UsersProfiles"("B");

-- CreateIndex
CREATE INDEX "_GroupToUser_B_index" ON "_GroupToUser"("B");

-- CreateIndex
CREATE INDEX "_GroupToTask_B_index" ON "_GroupToTask"("B");

-- CreateIndex
CREATE INDEX "_GroupToTodo_B_index" ON "_GroupToTodo"("B");

-- CreateIndex
CREATE INDEX "_GroupToPost_B_index" ON "_GroupToPost"("B");

-- CreateIndex
CREATE INDEX "_PostsCategory_B_index" ON "_PostsCategory"("B");

-- CreateIndex
CREATE INDEX "_FileToGroup_B_index" ON "_FileToGroup"("B");

-- CreateIndex
CREATE INDEX "_apikeysscopes_B_index" ON "_apikeysscopes"("B");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_mainOrgId_fkey" FOREIGN KEY ("mainOrgId") REFERENCES "Organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrgEmail" ADD CONSTRAINT "OrgEmail_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrgDomain" ADD CONSTRAINT "OrgDomain_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrgEmailUseTo" ADD CONSTRAINT "OrgEmailUseTo_emailOrgId_fkey" FOREIGN KEY ("emailOrgId") REFERENCES "OrgEmail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSecret" ADD CONSTRAINT "UserSecret_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_mainTodo_fkey" FOREIGN KEY ("mainTodo") REFERENCES "Todo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTodoLink" ADD CONSTRAINT "UserTodoLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTodoLink" ADD CONSTRAINT "UserTodoLink_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_mainTask_fkey" FOREIGN KEY ("mainTask") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTaskLink" ADD CONSTRAINT "UserTaskLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTaskLink" ADD CONSTRAINT "UserTaskLink_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_profileUserId_fkey" FOREIGN KEY ("profileUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollower" ADD CONSTRAINT "UserFollower_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollower" ADD CONSTRAINT "UserFollower_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_profileUserId_fkey" FOREIGN KEY ("profileUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangesTracking" ADD CONSTRAINT "ChangesTracking_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersProfiles" ADD CONSTRAINT "_UsersProfiles_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersProfiles" ADD CONSTRAINT "_UsersProfiles_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToTask" ADD CONSTRAINT "_GroupToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToTask" ADD CONSTRAINT "_GroupToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToTodo" ADD CONSTRAINT "_GroupToTodo_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToTodo" ADD CONSTRAINT "_GroupToTodo_B_fkey" FOREIGN KEY ("B") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToPost" ADD CONSTRAINT "_GroupToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToPost" ADD CONSTRAINT "_GroupToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostsCategory" ADD CONSTRAINT "_PostsCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostsCategory" ADD CONSTRAINT "_PostsCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToGroup" ADD CONSTRAINT "_FileToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToGroup" ADD CONSTRAINT "_FileToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_apikeysscopes" ADD CONSTRAINT "_apikeysscopes_A_fkey" FOREIGN KEY ("A") REFERENCES "ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_apikeysscopes" ADD CONSTRAINT "_apikeysscopes_B_fkey" FOREIGN KEY ("B") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;
