import { Response } from '@angular/http';
import { UserProfilePage } from '../user-profile/user-profile';
import { APIProvider } from '../../providers/APIProvider';
import { Account } from '../../apiClasses/account';
import { Component } from '@angular/core';
import { InfiniteScroll, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html'
})
export class UserListPage {
  title:string;
  id: string;
  users: Account[];
  max_id: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private mastodon: APIProvider) {
    this.title = navParams.get('title');
    this.id = navParams.get('id');
    this.title == "Following" ? this.getFollowing() : this.getFollowers();
  }

  ionViewDidLoad() {
    
  }

  getFollowing(){
    this.mastodon.getFollowingOfUser(this.id)
      .map((res) =>{
        this.setMax_id(res);
        let tempUsers: Account[] = JSON.parse(res['_body']);
        return tempUsers
      }).subscribe((data) => {
        this.users = data;
      })
  }

  getFollowers(){
    this.mastodon.getFollowersOfUser(this.id)
      .map((res) =>{
        this.setMax_id(res);
        let tempUsers: Account[] = JSON.parse(res['_body']);
        return tempUsers
      }).subscribe((data) => {
        this.users = data;
      })
  }

  setMax_id(response:Response){
    let link = response.headers.get("Link");
    let start = link.indexOf('=') +1;
    let end = link.indexOf('>');
    let id = link.substring(start,end);
    if(link.indexOf('next') == -1){
      this.max_id="0"
    } else {
      this.max_id = id;
    }
  }

  goToProfile(account: Account){
    this.navCtrl.push(UserProfilePage, {'account' : account})
  }

  loadMoreAccounts(infiniteScroll:InfiniteScroll) {
    if(this.max_id == "0"){
      infiniteScroll.complete();
      infiniteScroll.enable(false);
    } else {
      let observable;
      if(this.title == "Following"){
        observable = this.mastodon.getFollowingOfUser(this.id,this.max_id);
      } else {
        observable = this.mastodon.getFollowersOfUser(this.id,this.max_id);
      }
      observable.map( res =>{
          this.setMax_id(res)
          return JSON.parse(res['_body']);
      }).subscribe((data) =>{
        let moreUsers: Account[] = data;
        if(data){
          for(var i= 0; i<moreUsers.length; i++){
            this.users.push(moreUsers[i]);
          }
          infiniteScroll.complete(); 
        }
      }),
      error => {
          console.log(JSON.stringify(error))
          infiniteScroll.complete();
      } 
    }
  }
}
