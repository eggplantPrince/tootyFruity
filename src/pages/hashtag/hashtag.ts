import { Toot } from '../../apiClasses/toot';
import { Utility } from '../../providers/utility';
import { APIProvider } from '../../providers/APIProvider';
import { ViewChild } from '@angular/core/core';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Hashtag page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-hashtag',
  templateUrl: 'hashtag.html',
})
export class HashtagPage {

  hashtag: string;

  toots: Toot[]

  constructor(public navCtrl: NavController, public navParams: NavParams, public mastodon: APIProvider,
              public utility: Utility) {
    this.hashtag = navParams.get('hashtag')
    this.mastodon.getHashtag(this.hashtag).map(res =>{
      let tempToots = JSON.parse(res['_body']);
      return this.utility.beautifyToots(tempToots)
    }).subscribe( data => {
        let tempToots: Toot[] = data;
        this.toots = tempToots;
    })
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad Hashtag');
  }

}
