import { ToastController } from 'ionic-angular/components/toast/toast';
import { ReplyTootPage } from '../reply-toot/reply-toot';
import { APIProvider } from '../../providers/APIProvider';
import { Component } from '@angular/core';
import { ItemSliding, NavController, ModalController } from 'ionic-angular';
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

  boostToot(toot: Toot, slidingItem:ItemSliding){
    if(toot.reblogged){
      console.log('unboosting')
      slidingItem.close()
      this.mastodon.unBoostStatus(toot.id)
      .subscribe(() => {
        let originalClass = document.getElementById(toot.id).className;
        document.getElementById(toot.id).className += ' newly_unboosted';
        setTimeout(() => {
            document.getElementById(toot.id).className = originalClass;
            toot.reblogged = false;    
          }, 1500);
      })
    } else {
      console.log('boosting')
      slidingItem.close()
      this.mastodon.boostStatus(toot.id)
      .subscribe(() => {
        let originalClass = document.getElementById(toot.id).className;
        document.getElementById(toot.id).className += ' newly_boosted'
        toot.reblogged = true;    
        setTimeout(() => {
            document.getElementById(toot.id).className = originalClass;
          }, 2000);
       })
    }
  }

  favStatus(toot: Toot, slidingItem: ItemSliding){

    if(toot.favourited){
      slidingItem.close();
      this.mastodon.unFavoriteStatus(toot.id)
      .subscribe(() => {
        console.log('Faving status...')
        let originalClass = document.getElementById(toot.id).className;
        document.getElementById(toot.id).className += ' newlyUnfaved'
        setTimeout(() => {
            document.getElementById(toot.id).className = originalClass;
            toot.favourited = false;
          }, 2000);
       },
      error => console.log(JSON.stringify(error))
      );
    } else {
      slidingItem.close();
      this.mastodon.favoriteStatus(toot.id)
      .subscribe(() => {
        console.log('Faving status...')
        let originalClass = document.getElementById(toot.id).className;
        document.getElementById(toot.id).className += ' newlyFaved'
        toot.favourited = true;
        setTimeout(() => {
            document.getElementById(toot.id).className = originalClass;
        
          }, 2000);
       },
      error => console.log(JSON.stringify(error))
      );
      
    }
  }

  composeReplyTo(toot: Toot,slidingItem: ItemSliding) {
    let myModal = this.modalController.create(ReplyTootPage, { 'replyingToot' : toot});
    myModal.present();
    slidingItem.close();
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
          console.log(toots[index].content);
          if(toots[index].content.indexOf('<p>') == -1){
            toots[index].content = '<p>' + toots[index].content + '</p>'
          }
          //toots[index].content = toots[index].content.replace(/(<([^>]+)>)/ig, '');
          console.log(toots[index].content);
      }
    return toots;  
  }

  toggleSpoiler(toot: Toot){
    toot.spoiler_visible = ! toot.spoiler_visible;
  }
  

  showPrivateInfoToast(slidingItem: ItemSliding){
    let toast = this.toaster.create({
            message: "This Toot can't be boosted cuz it's marked as private",
            duration: 5000,
            position: 'top'
          });
    toast.present();
    slidingItem.close();          
  }
}
