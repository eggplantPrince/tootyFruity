import { NavController, Tabs, Tab } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { HomePage } from '../home/home';
import { NotificationsPage } from '../notifications/notifications';
import { TootPage } from '../toot/toot'
import {Storage} from '@ionic/storage';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = NotificationsPage;
  tab3Root: any = TootPage;

  constructor(public storage: Storage, public navCtrl: NavController) {     
  }


  scrollToTop(clickedIndex : number){
  }

}
