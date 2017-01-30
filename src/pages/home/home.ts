import { APIProvider } from '../../providers/APIProvider';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Toot } from '../../apiClasses/toot';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [APIProvider]
})
export class HomePage {
  public toots : Toot[];

  constructor(public navCtrl: NavController, public mastodon: APIProvider) {
    this.loadTimeline();
  }

   loadTimeline() {
    console.log('loading tl..')
    this.mastodon.getTimeline('home')
    .map( res => {
      let tempToots: Toot[] = JSON.parse(res['_body']);
      return this.extractHTML(tempToots);
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
      return this.extractHTML(tempToots)
    })
    .subscribe(
      data=>  {
        let newToots: Toot[] = data;
        if(data){
          this.toots = newToots.concat(this.toots);
        }
        refresher.complete();
      },
      error => console.log(JSON.stringify(error))
    );
  }


  extractHTML(toots: Toot[]){
    for( let index = 0; index < toots.length; index ++){
          toots[index].content = toots[index].content.replace(/(<([^>]+)>)/ig, '');
          if(toots[index].reblog){
             toots[index].reblog.content = toots[index].reblog.content.replace(/(<([^>]+)>)/ig, '');         
          }
      }
    return toots;  
  }

 

}
