import { FileUploadOptions, FileUploadResult } from 'ionic-native/dist/esm';
import { TootForm } from '../apiClasses/tootForm';
import { RequestOptionsArgs } from '@angular/http/src/interfaces';
import { Transfer } from 'ionic-native';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class APIProvider {
  access_token: string;
  base_url:string;
  fileTransfer: Transfer;

  mediaUploadsProgress:any = {};

  constructor(public http: Http, public storage: Storage) {
    this.access_token = localStorage.getItem('access_token')
    this.base_url = localStorage.getItem('base_url');
  }

  getNotifications(max_id?: string, since_id?: string): Observable<Response>{
    if(max_id == undefined && since_id == undefined){
      return this.getRequest('/api/v1/notifications')
    } else {
      let requestOptions: RequestOptions = new RequestOptions();
      let params: URLSearchParams = new URLSearchParams();
      if(max_id){
        params.set('max_id', max_id)
      }
      if(since_id){
        params.set('since_id', since_id)
      }
      requestOptions.search = params;
      return this.getRequest("/api/v1/notifications", requestOptions);
    }
  }

  uploadMedia(fileURL: string): Promise<FileUploadResult>{
    this.fileTransfer = new Transfer();
    let options: any = {};
    let mediaType = fileURL.substring(fileURL.lastIndexOf('.'));
    //.GIF?BSDFH
    mediaType = mediaType.toLowerCase();
    let cutSymbolPosition = mediaType.indexOf('?');
    if(cutSymbolPosition != -1){
      mediaType = mediaType.substring(0,cutSymbolPosition);
    }
    console.log(mediaType);

    switch(mediaType){
      case('.jpg' || '.jpeg'):
        options.mimeType = "image/jpeg"
        options.fileName = "tootyFruity_image.jpg"
        break;
      case('.png'):
        options.mimeType = "image/png"  
        options.fileName = "tootyFruity_image.png"
        break;
      case('.gif'):
        options.mimeType = "image/gif"    
        options.fileName = "tootyFruity_image.gif"
        options.chunkedMode = false;
        break;
      default:
        return null;  
    }
    options.headers = {'Authorization' : 'Bearer '+ this.access_token}
    console.log(fileURL);
    console.log(JSON.stringify(options))
    let uploadOptions: FileUploadOptions;
    uploadOptions = options;
    console.log(uploadOptions)
    // this.fileTransfer.onProgress((progressEvent: ProgressEvent) : void => {
    //   if(progressEvent.lengthComputable){
    //     this.mediaUploadsProgress.maxValue = progressEvent.total;
    //     this.mediaUploadsProgress.loadedValue = progressEvent.loaded;
    //     console.log(JSON.stringify(this.mediaUploadsProgress))
    //   }
    // })
    return this.fileTransfer.upload(fileURL, this.base_url + "/api/v1/media", uploadOptions);
  }

  getTimeline(type: string,  max_id?: string, since_id?: string): Observable<Response> {
    if(max_id == undefined && since_id == undefined){
      return this.getRequest('/api/v1/timelines/' + type)
    } else {
      let requestOptions: RequestOptions = new RequestOptions();
      let params: URLSearchParams = new URLSearchParams();
      if(max_id){
        params.set('max_id', max_id)
      }
      if(since_id){
        params.set('since_id', since_id)
      }
      requestOptions.search = params;
      return this.getRequest('/api/v1/timelines/' + type, requestOptions);
    }
  }

  postToot(newToot:TootForm): Observable<Response>{
    let body = {'status': newToot.status,
                'visibility': newToot.visibility};
    
    if(newToot.in_reply_to_id != null){
      body['in_reply_to_id'] = newToot.in_reply_to_id;
    }
    if(newToot.spoiler_text != null){
      body['spoiler_text'] = newToot.spoiler_text;
    }

    if(newToot.media_ids != null){
      if(newToot.sensitive) {
        body['sensitive'] = newToot.sensitive;
      }
      body['media_ids'] = newToot.media_ids;
    }
    return this.postRequest('/api/v1/statuses',body);    
  }


  newLinesToHTML(val: string) : string{
    return '<p>' + val.replace(/[\r\n]+/g, '</p><p>') + '</p>';
  }

  unFavoriteStatus(tootID: string): Observable<Response>{
    let data = {};
    return this.postRequest('/api/v1/statuses/'+tootID+'/unfavourite', data);
  }

  favoriteStatus(tootID: string): Observable<Response>{
    let data = {};
    return this.postRequest('/api/v1/statuses/'+tootID+'/favourite', data);
  }

  boostStatus(tootID: string): Observable<Response>{
    let data = {};
    return this.postRequest('/api/v1/statuses/'+tootID+'/reblog', data);
  }

  getAuthenticatedUser(): Observable<Response> {
    return this.getRequest('/api/v1/accounts/verify_credentials');
  }

  unBoostStatus(tootID: string): Observable<Response>{
    let data = {};
    return this.postRequest('/api/v1/statuses/'+tootID+'/unreblog', data);
  }

  private getRequest(url: string, requestOptions?: RequestOptionsArgs): Observable<Response> {
    requestOptions = this.finalizeRequestOptions(requestOptions);
    return this.http.get(this.base_url + url, requestOptions);
  }

  private postRequest(apiUrl:string, body:any): Observable<Response>{
    let requestOptions = this.finalizeRequestOptions();
    return this.http.post(this.base_url + apiUrl, body, requestOptions);
  } 

  preAuthPost(api_url: string, body: any): Observable<any>{
    let contentTypeHeaders = new Headers(['Content-type', 'application/json'])
    let request = new RequestOptions({ headers: contentTypeHeaders});
    console.log(api_url)
    return this.http.post(api_url, body, request)
      .map(this.extractData)
      .catch(err => { 
        console.log(JSON.stringify(err));
        return Observable.throw(err); // observable needs to be returned or exception raised
      })  
  }

  private finalizeRequestOptions(requestOptions?: RequestOptionsArgs){
    console.log('finalizing RequestOptions....')
    let myHeader = new Headers({ 'Accept': 'application/json' });
    myHeader.append('Authorization', 'Bearer '+ this.access_token);
    if(requestOptions){
      requestOptions.headers = myHeader;
    } else {
      requestOptions = new RequestOptions({ headers: myHeader });
    }
    return requestOptions;
  }

  private extractData(res: Response) {
    let body = res.json();
    if (body.data == undefined) return body
    else return body.data;
  }
  
}
