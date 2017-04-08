import { Utility } from '../../providers/utility';
import { Account } from '../../apiClasses/account';
import { AuthedAccount } from '../../apiClasses/authedAccount';
import { MyApp } from '../../app/app.component';
import { APIProvider } from '../../providers/APIProvider';
import { MastodonCredentials } from '../../assets/auth.ts';
import { OAuthCredentials}  from '../../apiClasses/OAuthCredentials';
import { Component } from '@angular/core';
import { App, NavController, ViewController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  instanceRootURL: string = "mastodon.social";
  currentAccount: AuthedAccount = new AuthedAccount();

  isFirstTime: boolean = true;

  constructor(
      public utility: Utility,
      public viewCtrl: ViewController,
      public appCtrl: App,
      public navCtrl: NavController,
      private mastodon: APIProvider) {
        
      }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.isFirstTime = localStorage.getItem('currentAccount') == null;
  }

  dismiss(){
    if(this.navCtrl.parent) {
        this.navCtrl.parent.select(0);
      } else {
        this.viewCtrl.dismiss();
      }
  }

  startAuthentication() {
    console.log(this.instanceRootURL);
    //add https://
    if(this.instanceRootURL.search('https://') == -1){
      this.instanceRootURL = 'https://'+this.instanceRootURL;
    }
    console.log('instance root url: ' + this.instanceRootURL);
    this.currentAccount.instanceUrl = this.instanceRootURL;
    //no need for new client_id nor secret when mastodon
    if(this.instanceRootURL.search('mastodon.social') > -1){
      this.authorizeApp(new MastodonCredentials());
    } 
    //create new app
    else {
      let credentials: OAuthCredentials;
      let data = {
        client_name: 'TootyFruity',
        redirect_uris: 'http://tootyfruity.kevinegli.ch/redirect',
        scopes: 'read write follow'
      }
      let final_url = this.instanceRootURL + '/api/v1/apps'
      this.mastodon.preAuthPost(final_url,data).subscribe((result) =>{
        credentials = result;
        credentials.redirect_uri = data.redirect_uris;
        this.authorizeApp(credentials);
      })  
    }
  }


  private authorizeApp(credentials: any){
      let data = {
              'response_type' : 'code',      
              'client_id' : credentials.client_id,          
              'client_secret': credentials.client_secret,     
              'redirect_uri' : 'http://tootyfruity.kevinegli.ch/redirect',       
              'scope' : 'read write follow'
      }
      let querystring = this.encodeQueryData(data);
      let fullURL = this.instanceRootURL + '/oauth/authorize?' + querystring;
      let browser = new InAppBrowser(fullURL, '_blank', 'clearcache=yes');
      browser.on('loadstart')
        .subscribe(
          ((event) => {
            let url = event.url;
            console.log(url)
            if ( url.indexOf('tootyfruity') < 12 && url.indexOf('tootyfruity') != -1){
              let codeIndex = url.search("=");
              let auth_code = url.substr(codeIndex+1);
              browser.close();
              this.getAccessToken(credentials, auth_code);
            }
        }));
  }

  private getAccessToken(credentials: any, auth_code: string){
    let data = {
      'client_id': credentials.client_id,
      'client_secret': credentials.client_secret,
      'code': auth_code,
      'redirect_uri': credentials.redirect_uri,
      'grant_type': 'authorization_code'
    } 
    let body = data;
    // TODO change back when productive
    let final_url =  this.instanceRootURL + '/oauth/token '
    this.mastodon.preAuthPost(final_url,body).subscribe(
      (result) =>{
        console.log('access token: ' + result.access_token);
        console.log('scope: ' + result.scope)
        this.currentAccount.accessToken = result.access_token;
        this.mastodon.setCurrentAccount(this.currentAccount);
        
        this.mastodon.getAuthenticatedUser().map( res => {
          let currentUser: Account = JSON.parse(res['_body']);
          return currentUser;
        })
        .subscribe(data => {
          let mastoAccount: Account = data;
          this.currentAccount.mastodonAccount = mastoAccount;
          this.utility.saveCurrentAccount(this.currentAccount);
          this.mastodon.setCurrentAccount(this.currentAccount);
          let accountsString = localStorage.getItem('accountList');
          let accounts: AuthedAccount[];
          if(accountsString){
            accounts = JSON.parse(accountsString);
            accounts.push(this.currentAccount);
          } else {
            accounts = [this.currentAccount];
          }
          localStorage.setItem('accountList', JSON.stringify(accounts));
          this.navCtrl.setRoot(MyApp);
        })

      })  

  }

  encodeQueryData(data) {
    let ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
  }


}
