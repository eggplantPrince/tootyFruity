import { Subscription } from 'rxjs/Rx';
import { SwitcherService } from '../../providers/switcherService';
import { PopoverController } from 'ionic-angular';
import { AccountSwitcherPage } from '../account-switcher/account-switcher';
import { AuthedAccount } from '../../apiClasses/authedAccount';
import { Utility } from '../../providers/utility';
import { APIProvider } from '../../providers/APIProvider';
import { Component, OnDestroy, Renderer, ViewChild } from '@angular/core';
import { Content, InfiniteScroll, ModalController, NavController } from 'ionic-angular';
import { Toot } from '../../apiClasses/toot';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnDestroy{
  public toots : Toot[];

  public currentAccount: AuthedAccount;

  private subscription: Subscription;

  timelineType: string = "home";
  timelineSwitching: boolean = false;
  @ViewChild(Content) content: Content;

  constructor(public utility: Utility, public navCtrl: NavController, private renderer: Renderer, 
              private mastodon: APIProvider, public modalController: ModalController, public popOverController: PopoverController, private switcherService : SwitcherService) {
    this.currentAccount = utility.getCurrentAccount();
    let tootCache = this.currentAccount.tootCache;
    if(tootCache){
      if(tootCache.length == 0) {
        console.log('cachedToots are weird.. reloading them')
        this.loadTimeline();
      } else {
        this.toots = tootCache;
      }
    } else {
      this.loadTimeline();
    }

    this.subscription = this.switcherService.getAccount().subscribe(account => {
      this.currentAccount = account;
      if(this.currentAccount.tootCache){
        this.toots = this.currentAccount.tootCache;
      } else {
        this.loadTimeline();
      }
    })
    
  }

  public cacheContent(){
    if(this.utility.getCurrentAccount().mastodonAccount.id == this.currentAccount.mastodonAccount.id){
      this.currentAccount.tootCache = this.toots;
      this.utility.saveCurrentAccount(this.currentAccount);
    }
  }

   loadTimeline() {
    console.log('loading tl..')
    this.mastodon.getTimeline(this.timelineType)
    .map( res => {
      let tempToots: Toot[] = JSON.parse(res['_body']);
      return this.utility.beautifyToots(tempToots);
    })
    .subscribe(
      data=>  {
        let tempToots: Toot[] = data;
        this.toots = tempToots;
        if(this.timelineType == "home"){
          this.cacheContent();
        }
        this.timelineSwitching = false;
      },
      error => console.log(JSON.stringify(error))
    );
  }

  actualTootID(toot: Toot): string {
    if(toot.reblog)
      return toot.reblog.id;
    else 
      return toot.id;  
  }

  doRefresh(refresher) {
    let forceRefresh = localStorage.getItem('homeRefreshNeeded');
    if(this.toots.length > 20){
      this.toots = this.toots.slice(0,19);
    }
    if(forceRefresh == 'true'){
      console.log('force reload needed in home because favs / boosts have changed');
      this.loadTimeline();
      localStorage.setItem('homeRefreshNeeded', 'false')
      setTimeout(() => {
        console.log('force refresh completed in home');
        refresher.complete();
        ;
      }, 500);
      return ;
    } else {
      let id = this.actualTootID(this.toots[0]);
      this.mastodon.getTimeline(this.timelineType,undefined,id)
      .map( res => {
        let tempToots: Toot[] = JSON.parse(res['_body']);
        return this.utility.beautifyToots(tempToots)
      })
      .subscribe(
        data=>  {
          let newToots: Toot[] = data;
          if(data){
            if(newToots.length < 20) {
              this.toots = newToots.concat(this.toots);
            } else {
              this.toots = newToots;  
            }
          }    
          setTimeout(() => {
            console.log('refresh completed');
            refresher.complete();
            this.cacheContent();
          }, 600);
        },
        error => console.log(JSON.stringify(error))
      );
    }
  }

  loadOlderToots(infiniteScroll: InfiniteScroll) {
    let lastToot = this.toots[this.toots.length -1];
    let id = this.actualTootID(lastToot);
    this.mastodon.getTimeline(this.timelineType, id)
    .map( res => {
      let tempToots: Toot[] = JSON.parse(res['_body'])
      return this.utility.beautifyToots(tempToots);
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

  toggleTimelineType(){
    this.timelineSwitching = true;
    this.content.scrollToTop(0);
    switch(this.timelineType){
      case('home'):
        this.timelineType = 'public'
        this.loadTimeline();
        break;
      case('public'):
        this.timelineType = 'home';
        this.loadTimeline();
        break;
    }
  }

  showAccountSwitcher(ev: UIEvent){
    let popover = this.popOverController.create(AccountSwitcherPage);
    popover.present({
      ev: ev
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
