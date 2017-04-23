import { APIProvider } from '../../providers/APIProvider';
import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';
import { Toot } from '../../apiClasses/toot';
import { Account } from '../../apiClasses/account';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  accounts: Account[];
  statuses: Toot[];
  hashtags: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams, 
  public keyboard: Keyboard, private mastodon: APIProvider) {
  }

  performSearch(ev: any) {
    this.accounts = null;
    this.statuses = null;
    this.hashtags = null;
    
    this.mastodon.search(ev.target.value)
      .subscribe((data) => {
        let parsedJson = JSON.parse(data['_body']);
        if (parsedJson['accounts'].length > 0) {
          this.accounts = parsedJson['accounts'];
        }
        if (parsedJson['statuses'].length > 0) {
          this.statuses = parsedJson['statuses'];
        }
        if (parsedJson['hashtags'].length > 0) {
          this.hashtags = parsedJson['hashtags'];
        }
      });
    this.keyboard.close();
  }

  goToProfile(account: Account) {
    this.navCtrl.push(UserProfilePage, { 'account': account })
  }

  goToHashtag(hashtag: string) {

  }

}