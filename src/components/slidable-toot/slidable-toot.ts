import { ToastController } from 'ionic-angular/components/toast/toast';
import { ReplyTootPage } from '../../pages/reply-toot/reply-toot';
import { ModalController } from 'ionic-angular/components/modal/modal';
import { ItemSliding } from 'ionic-angular';
import { APIProvider } from '../../providers/APIProvider';
import { Toot } from '../../apiClasses/toot';
import { Component, Input } from '@angular/core';

/*
  Generated class for the SlideableToot component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'slidable-toot',
  templateUrl: 'slidable-toot.html',
  providers: [APIProvider]
})
export class SlidableTootComponent {

  @Input()
  toot: Toot;

  constructor(private mastodon: APIProvider, private modalController: ModalController, private toaster: ToastController) {
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
