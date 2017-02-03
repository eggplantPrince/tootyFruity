import { Account } from '../apiClasses/account';
import { APIProvider } from '../providers/APIProvider';
import { NotificationsPage } from '../pages/notifications/notifications';
import { HomePage } from '../pages/home/home';
import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { InAppBrowser } from 'ionic-native';

declare var window: any;

@Component({
  templateUrl: 'app.html',
  providers: [APIProvider]
})
export class MyApp {
  rootPage;

  constructor(platform: Platform, storage: Storage, public mastodon: APIProvider) {
    platform.ready().then(() => {
      window.open = (url, target?, opts?) => new InAppBrowser(url, target, opts);
      this.setRootPage();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
 }




 ionViewDidEnter(){
   if(this.rootPage == LoginPage){
     this.setRootPage();
   }
 }

 setRootPage() {
   if (localStorage.getItem('access_token') == null){
          this.rootPage = LoginPage
     } else {
          this.rootPage = TabsPage;
          this.mastodon.getAuthenticatedUser().map( res => {
            let loggedInUser: Account = JSON.parse(res['_body']);
            return loggedInUser;
          })
          .subscribe(data => {
            let account: Account = data;
            localStorage.setItem('user', JSON.stringify(account));
          })
    } 
 }

}


