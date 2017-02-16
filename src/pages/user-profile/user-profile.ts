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


  constructor(private modalController: ModalController, public navCtrl: NavController, public navParams: NavParams, public mastodon: APIProvider, public popOverController: PopoverController) {
    
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
      return this.beautifyToots(JSON.parse(res['_body']))
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
      return this.beautifyToots(tempToots);
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
          if(toots[index].mentions && toots[index].mentions.length > 0){
            let domParser = new DOMParser();
            let parsedString = domParser.parseFromString(toots[index].content,"text/html");
            let mentions = parsedString.getElementsByTagName('a');
            for(let index = 0; index < mentions.length; index ++){
              if(mentions[index].innerHTML.indexOf("@") !=  -1){
                mentions[index].setAttribute('href', '#');
              }
            }
            if(parsedString.documentElement){
              toots[index].content = parsedString.documentElement.innerHTML;
            }
          }

          // if(toots[index].account.avatar == "/avatars/original/missing.png"){
          //   toots[index].account.avatar = 'assets/img/pineapple_avatar.png' 
          // }
      }
    return toots;  
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
