import { NavController, ModalController, Modal } from 'ionic-angular';
import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { NotificationsPage } from '../notifications/notifications';
import { TootPage } from '../toot/toot';
import { UserProfilePage } from '../user-profile/user-profile';
import { SearchPage } from '../search/search';
import { Toot } from '../../apiClasses/toot';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  homeRoot: any = HomePage;
  notificationsRoot: any = NotificationsPage;
  searchRoot: any = SearchPage;
  profileRoot: any = UserProfilePage;

  constructor(public navCtrl: NavController, public modalController: ModalController) {     

  }


  scrollToTop(clickedIndex : number){
  }

  composeToot() {
    let modal = this.modalController.create(TootPage)
    modal.present();
  }
}
