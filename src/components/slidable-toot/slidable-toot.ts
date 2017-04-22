import { Utility } from '../../providers/utility';
import { UserProfilePage } from '../../pages/user-profile/user-profile';
import { TootDetailPage } from '../../pages/toot-detail/toot-detail';
import { Account } from '../../apiClasses/account';
import { Toast } from '@ionic-native/toast';
import { ReplyTootPage } from '../../pages/reply-toot/reply-toot';
import { ModalController } from 'ionic-angular';
import { ItemSliding, NavController } from 'ionic-angular';
import { APIProvider } from '../../providers/APIProvider';
import { Toot } from '../../apiClasses/toot';
import { Component, ElementRef, Input, Renderer } from '@angular/core';

@Component({
  selector: 'slidable-toot',
  templateUrl: 'slidable-toot.html'
})
export class SlidableTootComponent {

  @Input()
  toot: Toot;
  relationship: string;


  constructor(private utility: Utility, private mastodon: APIProvider, private elRef: ElementRef,private renderer: Renderer, private navController: NavController, private modalController: ModalController, private toaster: Toast) {
  }


  ngAfterViewInit(){
    if(this.toot.mentions != undefined && this.toot.mentions.length > 0){
      let elements = this.elRef.nativeElement.querySelectorAll('a');
      for(let index = 0; index < elements.length; index++){
        elements[index].addEventListener('click', (event) => {
          let username = event.target.innerHTML;
          console.log(username)
          for(let i = 0; i<this.toot.mentions.length; i++){
            if(username.indexOf("@") == 0){
              username = username.substring(1)
            }
            if(this.toot.mentions[i].acct.indexOf(username) != -1){
              this.navController.push(UserProfilePage, {'mention' : this.toot.mentions[i]});
            }
          }
        }); 

      }
    }
  }

  boostToot(toot: Toot, slidingItem:ItemSliding){
    localStorage.setItem('homeRefreshNeeded', 'true');
    localStorage.setItem('notificationRefreshNeeded', 'true');
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

    let user: Account = this.utility.getCurrentAccount().mastodonAccount;
    if(toot.content.indexOf(user.username) != -1) {
      console.log('special toot has been faved. setting force refresh to true')
      localStorage.setItem('homeRefreshNeeded', 'true');
      localStorage.setItem('notificationRefreshNeeded', 'true');
    }
    if(toot.favourited){
      slidingItem.close();
      this.mastodon.unFavoriteStatus(toot.id)
      .subscribe(() => {
        console.log('Unfaving status...')
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
    let originalClass = document.getElementById(toot.id).className;
    if(toot.spoiler_visible){
      document.getElementById(toot.id).className += ' newlySpoilerClosed'
    }
    if(!toot.spoiler_visible){
      document.getElementById(toot.id).className += ' newlySpoilerOpen'
    }
    toot.spoiler_visible = ! toot.spoiler_visible;
    setTimeout(() => {
      document.getElementById(toot.id).className = originalClass
    }, 2000)
  }
  

  showPrivateInfoToast(slidingItem: ItemSliding){
    let toast = this.toaster.showWithOptions({
            message: "This Toot can't be boosted cuz it's marked as private",
            duration: 5000,
            position: 'top'
          }).subscribe();
    slidingItem.close();          
  }

  goToUserProfile(account: Account){
    this.navController.push(UserProfilePage, {'account' : account})
  }

  showDetailPage(toot: Toot, slidingItem: ItemSliding){
    this.navController.push(TootDetailPage, {'toot' : toot});
    slidingItem.close();
  }


}
