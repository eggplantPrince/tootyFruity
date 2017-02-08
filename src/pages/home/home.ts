import { ToastController } from 'ionic-angular/components/toast/toast';
import { APIProvider } from '../../providers/APIProvider';
import { Component, ViewChild } from '@angular/core';
import { Content, InfiniteScroll, ModalController, NavController } from 'ionic-angular';
import { Toot } from '../../apiClasses/toot';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [APIProvider]
})
export class HomePage {
  public toots : Toot[];
  timelineType: string = "home";
  timelineSwitching: boolean = false;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public toaster: ToastController, public mastodon: APIProvider, public modalController: ModalController) {
    let tootCacheString = localStorage.getItem('tootCache')
    if(tootCacheString){
      console.log('toots loading from cache....')
      let cachedToots: Toot[] = JSON.parse(tootCacheString);
      if(cachedToots.length == 0) {
        console.log('cachedToots are weird.. reloading them')
        this.loadTimeline();
      } else {
        this.toots = JSON.parse(tootCacheString);
      }
    } else {
      this.loadTimeline();
    }
  }

  public cacheContent(){
    console.log('home is cached!')
    localStorage.setItem('tootCache', JSON.stringify(this.toots));
  }

   loadTimeline() {
    console.log('loading tl..')
    this.mastodon.getTimeline(this.timelineType)
    .map( res => {
      let tempToots: Toot[] = JSON.parse(res['_body']);
      return this.beautifyToots(tempToots);
    })
    .subscribe(
      data=>  {
        let tempToots: Toot[] = data;
        this.toots = tempToots;
        this.cacheContent();
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
        return this.beautifyToots(tempToots)
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
    let lastToot = this.toots[this.toots.length -1];
    let id;
    lastToot.reblog ? id=lastToot.reblog : id=lastToot.id;
    this.mastodon.getTimeline(this.timelineType, id)
    .map( res => {
      let tempToots: Toot[] = JSON.parse(res['_body'])
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
}
