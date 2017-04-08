import { AuthedAccount } from '../apiClasses/authedAccount';
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
    
    if(toot.mentions && toot.mentions.length > 0 || toot.media_attachments[0]){
      let domParser = new DOMParser();
      let parsedString = domParser.parseFromString(toot.content,"text/html");
      let links = parsedString.getElementsByTagName('a');
      for(let index = 0; index < links.length; index ++){
        if(links[index].innerHTML.indexOf("@") !=  -1){
          links[index].setAttribute('href', '#');
        }
        if(toot.media_attachments[0]){
          if(links[index].getAttribute('href').indexOf('/media/') != -1){
            links[index].innerHTML = '';
          }
        }
      }
      toot.content = parsedString.documentElement.innerHTML;
    }

    return toot;
  }

  public saveCurrentAccount(currentAccount : AuthedAccount){
    localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
    let accountList = localStorage.getItem('accountList')
    if(accountList){
      let userList: AuthedAccount[] = JSON.parse(accountList);
      for(let i = 0; i < userList.length; i++){
        if(userList[i].accessToken == currentAccount.accessToken){
          userList[i] = currentAccount;
          localStorage.setItem('accountList', JSON.stringify(userList));
        }
      }
    }
  }

  public getCurrentAccount() : AuthedAccount {
    let string = localStorage.getItem('currentAccount');
    if(string){
      return JSON.parse(string);
    } else {
      return null;
    }
  }

}
