import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { AppStore } from '@fe/stores';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  imports: [
    RouterModule,
    TranslateModule
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

  protected title = 'app-jcm';

  // appStore = inject(AppStore);
  ngxtranslateService = inject(TranslateService);
  constructor() {
    const translateService = this.ngxtranslateService;
    translateService.addLangs(['en','fr']);
    translateService.use(translateService.getBrowserLang() || 'en'); // use browser language by default
  }
  currentLang = signal(this.ngxtranslateService.getCurrentLang() )// get current language

// logCurrentUser = effect(() => {
//     console.log("User computed: ", this.appStore.user());
//   });

}
