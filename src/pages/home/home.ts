import { ToastController } from 'ionic-angular/components/toast/toast';
import { ReplyTootPage } from '../reply-toot/reply-toot';
import { APIProvider } from '../../providers/APIProvider';
import { Component } from '@angular/core';
import { InfiniteScroll, ItemSliding, ModalController, NavController } from 'ionic-angular';
import { Toot } from '../../apiClasses/toot';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [APIProvider]
})
export class HomePage {
  public toots : Toot[];

  constructor(public navCtrl: NavController, public toaster: ToastController, public mastodon: APIProvider, public modalController: ModalController) {
    this.loadTimeline();
  }

   loadTimeline() {
    console.log('loading tl..')
    this.mastodon.getTimeline('home')
    .map( res => {
      let tempToots: Toot[] = JSON.parse(res['_body']);
      return this.beautifyToots(tempToots);
    })
    .subscribe(
      data=>  {
        let tempToots: Toot[] = data;
        this.toots = tempToots;
      },
      error => console.log(JSON.stringify(error))
    );
  }


  doRefresh(refresher) {
    let id = this.toots[0].id;
    this.mastodon.getTimeline('home',undefined,id)
    .map( res => {
      let tempToots: Toot[] = JSON.parse(res['_body']);
      return this.beautifyToots(tempToots)
    })
    .subscribe(
      data=>  {
        let newToots: Toot[] = data;
        if(data){
          this.toots = newToots.concat(this.toots);
        }
        setTimeout(() => {
          console.log('refresh completed');
          refresher.complete();
        }, 1500);
      },
      error => console.log(JSON.stringify(error))
    );
  }

  beautifyToots(toots: Toot[]){
    for( let index = 0; index < toots.length; index ++){
          if(toots[index].reblog){
            // switch booster and boosted for easier display logic
            let boosterToot = toots[index];
            toots[index] = toots[index].reblog
            toots[index].reblog = boosterToot;
            toots[index].reblog.reblog = null;
          }
          if(toots[index].content.indexOf('<p>') == -1){
            toots[index].content = '<p>' + toots[index].content + '</p>'
          }
          //toots[index].content = toots[index].content.replace(/(<([^>]+)>)/ig, '');
      }
    return toots;  
  }
  

  loadOlderToots(infiniteScroll: InfiniteScroll) {
    let id = this.toots[this.toots.length -1].id;
    this.mastodon.getTimeline('home', id)
    .map( res => {
      let tempToots: Toot[] = JSON.parse(res['_body'])
      console.log(JSON.stringify(tempToots));
      return this.beautifyToots(tempToots);
    })
    .subscribe(
      data => {
        let olderToots: Toot[] = data;
        if(data){
          for(var i = 0; i < olderToots.length; i++) {
            this.toots.push(olderToots[i]);
          }
          infiniteScroll.complete();
        }
      },
      error => {
        console.log(JSON.stringify(error))
        infiniteScroll.complete();
      } 
    );
  }
}
