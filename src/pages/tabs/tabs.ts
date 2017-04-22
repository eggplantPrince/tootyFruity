import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { NotificationsPage } from '../notifications/notifications';
import { TootPage } from '../toot/toot'
import { UserProfilePage } from '../user-profile/user-profile'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = NotificationsPage;
  tab3Root: any = TootPage;
  tab4Root: any = UserProfilePage;

  constructor(public navCtrl: NavController) {     
  }


  scrollToTop(clickedIndex : number){
  }

}
