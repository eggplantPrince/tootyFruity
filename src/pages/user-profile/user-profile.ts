import { APIProvider } from '../../providers/APIProvider';
import { Toot } from '../../apiClasses/toot';
import { Account } from '../../apiClasses/account';
import { Component } from '@angular/core';
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
  loggedInUser: Account;


  constructor(public navCtrl: NavController, public navParams: NavParams, public mastodon: APIProvider, public popOverController: PopoverController) {
    
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    let paramUser = navParams.get('account');
    if(paramUser){
      this.user = paramUser;
    } else {
      this.user = this.loggedInUser;
    }
    console.log(this.user.header)
    this.getToots();
  }

  followAction(){
    // TODO
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
    if(this.user.id == this.loggedInUser.id){
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
      }
    return toots;  
  }
  

}
