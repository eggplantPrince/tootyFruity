import { Toot } from '../apiClasses/toot';
import { Injectable } from '@angular/core'

Injectable()
export class Utility {

  public beautifyToots(toots: Toot[]){
    for( let index = 0; index < toots.length; index ++){
          toots[index] = this.beautifyToot(toots[index]);
      }
    return toots;  
  }

  public beautifyToot(toot: Toot){
    if(toot.reblog){
      // switch booster and boosted for easier display logic
      let boosterToot = toot;
      toot = toot.reblog
      toot.reblog = boosterToot;
      toot.reblog.reblog = null;
    }
    if(toot.content.indexOf('<p>') == -1){
      toot.content = '<p>' + toot.content + '</p>'
    }
    
    if(toot.mentions && toot.mentions.length > 0){
      let domParser = new DOMParser();
      let parsedString = domParser.parseFromString(toot.content,"text/html");
      let mentions = parsedString.getElementsByTagName('a');
      for(let index = 0; index < mentions.length; index ++){
        if(mentions[index].innerHTML.indexOf("@") !=  -1){
          mentions[index].setAttribute('href', '#');
        }
      }
      toot.content = parsedString.documentElement.innerHTML;
    }
    return toot;
  }

}
