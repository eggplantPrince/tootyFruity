import { SwitcherService } from '../../providers/switcherService';
import { Subscription } from 'rxjs/Rx';
import { AuthedAccount } from '../../apiClasses/authedAccount';
import { Utility } from '../../providers/utility';
import { Notification } from '../../apiClasses/notification';
import { APIProvider } from '../../providers/APIProvider';
import { Component, OnDestroy } from '@angular/core';
import { InfiniteScroll, NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Notifications page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsPage implements OnDestroy{

  notifications: Notification[];
  currentAccount: AuthedAccount;

  private subscription: Subscription;

  constructor(public utility: Utility,public navCtrl: NavController, public navParams: NavParams, private mastodon: APIProvider,
              private switcherService: SwitcherService) {
    this.currentAccount = this.utility.getCurrentAccount();
    if(this.currentAccount.notificationsCache){
      if(this.currentAccount.notificationsCache.length == 0) {
        console.log('cached notifications are weird.. reloading them')
        this.getNotifications();
      } else {
        this.notifications = this.beautifyNotifications(this.currentAccount.notificationsCache);
      }
    } else {
      this.getNotifications();
    }

    this.subscription = this.switcherService.getAccount().subscribe(account => {
      this.currentAccount = account;
      if(this.currentAccount.notificationsCache){
        this.notifications = this.currentAccount.notificationsCache;
      } else {
        this.getNotifications();
      }
    })
  }

  getNotifications(){
    this.mastodon.getNotifications().map( res => {
      let tempNotifications: Notification[] = JSON.parse(res['_body']);
      return tempNotifications;
    })
    .subscribe(
      data=>  {
        this.notifications = this.beautifyNotifications(data);
        this.cacheContent();
      },
      error => console.log(JSON.stringify(error))
    );

  }

  doRefresh(refresher) {
    let forceRefresh = localStorage.getItem('notificationRefreshNeeded');
    if(forceRefresh == 'true' || !this.notifications[0]){
      this.getNotifications();
      localStorage.setItem('notificationRefreshNeeded', 'false');
      setTimeout(() => {
            console.log('force refresh completed in notifications');
            refresher.complete();
            return;
          }, 500);
    } else {
      let id = this.notifications[0].id;
      this.mastodon.getNotifications(undefined,id)
      .map( res => {
        let tempNotifications: Notification[] = JSON.parse(res['_body']);
        return this.beautifyNotifications(tempNotifications);
      })
      .subscribe(
        data=>  {
          if(data){
            let newNotifications: Notification[] = data;
            if(newNotifications.length < 20){
              this.notifications = newNotifications.concat(this.notifications)
            } else {
              this.notifications = newNotifications;
            }
            this.cacheContent();
            setTimeout(() => {
              console.log('refresh completed');
              refresher.complete();
            }, 600);
          }
        },
        error => console.log(JSON.stringify(error))
      );
    }
  }

  loadOlderNotifications(infiniteScroll: InfiniteScroll){
    let id = this.notifications[this.notifications.length-1].id;
    this.mastodon.getNotifications(id)
    .map( res => {
      let tempNotifications: Notification[] = JSON.parse(res['_body']);
      return this.beautifyNotifications(tempNotifications);
    })
    .subscribe(
      data=>  {
        if(data){
          let newNotifications: Notification[] = data;
          for(var i = 0; i < newNotifications.length; i++){
            this.notifications.push(newNotifications[i]);
          }
          infiniteScroll.complete();
          if(data.length == 0){
            infiniteScroll.enable(false);
          }
        }
      }),
      error => {
        console.log(JSON.stringify(error))
        infiniteScroll.complete();
    }
  };

  public cacheContent(){
    if(this.utility.getCurrentAccount().mastodonAccount.id == this.currentAccount.mastodonAccount.id){
      this.currentAccount.notificationsCache = this.notifications;
      this.utility.saveCurrentAccount(this.currentAccount);
      console.log('notifications are cached!')
    }
  }

  beautifyNotifications(notifications: Notification[]){
    for( let index = 0; index < notifications.length; index ++){
      if(notifications[index].status){
        notifications[index].status = this.utility.beautifyToot(notifications[index].status);
      }
    }
    return notifications;  
  }
  
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
