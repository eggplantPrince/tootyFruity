import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { InAppBrowser } from 'ionic-native';

declare var window: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;
  

  constructor(platform: Platform, storage: Storage) {
   platform.ready().then(() => {

      window.open = (url, target?, opts?) => new InAppBrowser(url, target, opts);
     if(localStorage.getItem('access_token') == null){
          this.rootPage = LoginPage
     } else {
          this.rootPage = TabsPage;
    }   
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    StatusBar.styleDefault();
    Splashscreen.hide();
  });
 }
}
