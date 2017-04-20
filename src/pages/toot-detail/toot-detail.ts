import { APIProvider } from '../../providers/APIProvider';
import { Toot } from '../../apiClasses/toot';
import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-toot-detail',
  templateUrl: 'toot-detail.html'
})
export class TootDetailPage {

  mainToot: Toot;
  ancestors: Toot[];
  descendants: Toot[];
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, private mastodon: APIProvider) {
    this.mainToot = this.navParams.get('toot')
    this.getThread();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TootDetailPage');
    if(this.mainToot.media_attachments[0]){
      console.log(this.mainToot.media_attachments[0].type);
    }
  }

  getThread(){
    this.mastodon.getTootThread(this.mainToot.id)
    .map(res => {
      return JSON.parse(res['_body']);
    }) .subscribe(data =>{
      let ancestors: Toot[]= data.ancestors
      let descendants: Toot[] = data.descendants;
      this.ancestors = ancestors;
      this.descendants = descendants;
      if(ancestors.length > descendants.length){
        this.content.scrollToBottom();
      }
    })
  }

}
