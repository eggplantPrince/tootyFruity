import { Utility } from '../../providers/utility';
import { UserListPage } from '../user-list/user-list';
import { UserOptionsPage } from '../user-options/user-options';
import { TootPage } from '../toot/toot';
import { ModalController } from 'ionic-angular/components/modal/modal';
import { Relationships } from '../../apiClasses/relationships';
import { Mention } from '../../apiClasses/mention';
import { APIProvider } from '../../providers/APIProvider';
import { Toot } from '../../apiClasses/toot';
import { Account } from '../../apiClasses/account';
import { Component } from '@angular/core';
import { PersonalOptionsPage } from '../personal-options/personal-options'
import { InfiniteScroll, NavController, NavParams, PopoverController } from 'ionic-angular';

/*
  Generated class for the UserProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfilePage {

  user: Account;
  userToots: Toot[]
  loggedInUser: Account = null;
  relationships: Relationships;


  constructor(private utility:Utility, private modalController: ModalController, public navCtrl: NavController, public navParams: NavParams, public mastodon: APIProvider, public popOverController: PopoverController) {
    
    let paramUser = navParams.get('account');
    let paramMention: Mention = navParams.get('mention');

    let loggedInUser:Account = JSON.parse(localStorage.getItem('user'));
     if(paramUser && paramUser.id != loggedInUser.id){
      this.user = paramUser;
      console.log(this.user.header)
      console.log(this.user.avatar)
      this.getToots();
      this.loadRelationships();
    } else if(paramMention && paramMention.id != loggedInUser.id){
      this.user = new Account();
      this.user.acct = paramMention.acct;
      this.mastodon.getAccount(paramMention.id)
      .map( 
        res => {
          return JSON.parse(res['_body'])
      })
      .subscribe(
        data => {
          this.user = data;
          this.getToots();
          this.loadRelationships();
        }
      )
    } 
    else {
      this.loggedInUser = loggedInUser;
      this.user = this.loggedInUser;
      this.getToots();
    }

    if(this.user.header == '/headers/original/missing.png'){
      this.user.header = '../assets/img/pineapple_header.png';
    }
  }

  createNewMention(){
    let modal = this.modalController.create(TootPage, {"tootStatus": "@"+this.user.acct});
    modal.present();
  }

  loadRelationships(){
    this.mastodon.getRelationshipOfAccount(this.user.id).map((res) =>{
      let tempRelationships: Relationships[] = JSON.parse(res['_body']);
      return tempRelationships;
    }) .subscribe((data) => {
      console.log(JSON.stringify(data))
      this.relationships = data[0];
      console.log(this.relationships.following)
    })
  }

  followAction(){
    this.mastodon.followUser(this.user.id).map((res) =>{
      let tempRelationships: Relationships = JSON.parse(res['_body']);
      return tempRelationships;
    }) .subscribe((data) => {
        console.log(JSON.stringify(data))
        this.relationships = data;
        console.log(this.relationships.following)
    });
  }

  unfollowAction(){
    this.mastodon.unfollowUser(this.user.id).map((res) =>{
      let tempRelationships: Relationships = JSON.parse(res['_body']);
      return tempRelationships;
    }) .subscribe((data) => {
        console.log(JSON.stringify(data))
        this.relationships = data;
        console.log(this.relationships.following)
    });
  }


  getToots(){
    this.mastodon.getTootsOfUser(this.user.id).map(
    (res) =>{
      return this.utility.beautifyToots(JSON.parse(res['_body']))
    })
    .subscribe(
      data => {
        this.userToots = data;
      }
    )
  }

  doRefresh(refresher) {
    if(this.loggedInUser){
      this.mastodon.getAuthenticatedUser().map( res => {
        let loggedInUser: Account = JSON.parse(res['_body']);
        return loggedInUser;
      })
      .subscribe(data => {
        let account: Account = data;
        localStorage.setItem('user', JSON.stringify(account));
        this.loggedInUser = account;
        this.user = account;
        this.getToots();
        setTimeout(() => {
              console.log('refresh completed');
              refresher.complete();
          }, 600);
      })
    } else {
      this.getToots();
      setTimeout(() => {
              console.log('refresh completed');
              refresher.complete();
          }, 600);
    }



  }

  loadOlderToots(infiniteScroll: InfiniteScroll) {
    console.log('first id: ' + this.userToots[0].id)
    let lastToot = this.userToots[this.userToots.length -1];
    console.log('last id: ' + lastToot.content)
    let id;
    lastToot.reblog ? id=lastToot.reblog : id=lastToot.id;
    this.mastodon.getTootsOfUser(this.user.id, id, undefined)
    .map( res => {
      let tempToots: Toot[] = JSON.parse(res['_body'])
      return this.utility.beautifyToots(tempToots);
    })
    .subscribe(
      data => {
        let olderToots: Toot[] = data;
        if(data){
          for(var i = 0; i < olderToots.length; i++) {
            this.userToots.push(olderToots[i]);
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

  showOptions(ev: UIEvent){
    if(this.loggedInUser){
      let popover = this.popOverController.create(PersonalOptionsPage);
      popover.present({
        ev: ev
      });
    }
    else{
      let popover = this.popOverController.create(UserOptionsPage, {isBlocked: this.relationships.blocking,user_id: this.user.id});
      popover.present({
        ev: ev
      });
      popover.onDidDismiss(data => {
        console.log('dismissed')
        if(data){
          this.relationships = data;
        }
    });
    }
  }

  unblockAction(){
    this.mastodon.unblockUser(this.user.id).map((res) =>{
      let tempRelationships: Relationships = JSON.parse(res['_body']);
      return tempRelationships;
    }) .subscribe((data) => {
      this.relationships = data;
    })
  }

  showFollowers(){
    this.navCtrl.push(UserListPage, {title: "Followers", id: this.user.id});
    
  }

  showFollowing(){
    this.navCtrl.push(UserListPage, {title: "Following", id: this.user.id});
  }

}
