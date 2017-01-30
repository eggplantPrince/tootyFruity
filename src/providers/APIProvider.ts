import { TootForm } from '../apiClasses/tootForm';
import { Toot } from '../apiClasses/toot';
import { RequestOptionsArgs } from '@angular/http/src/interfaces';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class APIProvider {
  access_token;
  base_url;

  constructor(public http: Http, public storage: Storage) {
    this.access_token = localStorage.getItem('access_token')
    this.base_url = localStorage.getItem('base_url');
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
    let requestOptions: RequestOptions = new RequestOptions();
    let params: URLSearchParams = new URLSearchParams();
    let body = {'status': newToot.status,
                'visibility': newToot.visibility};
    
    if(newToot.in_reply_to_id != null){
      body['in_reply_to_id'] = newToot.in_reply_to_id;
    }
    if(newToot.spoiler_text != null){
      body['spoiler_text'] = newToot.spoiler_text;
    }

    if(newToot.media_ids != null){
      body['sensitive'] = newToot.sensitive;
      for(let i = 0; i <= newToot.media_ids.length - 1; i++){
        body['media_ids'][i] = newToot.media_ids[i];
      }
    }

    console.log(JSON.stringify(body));
    return this.postRequest('/api/v1/statuses',body);    
  }

  getRequest(url: string, requestOptions?: RequestOptionsArgs): Observable<Response> {
    requestOptions = this.finalizeRequestOptions(requestOptions);
    return this.http.get(this.base_url + url, requestOptions);
  }

  postRequest(apiUrl:string, body:any): Observable<Response>{
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

  finalizeRequestOptions(requestOptions?: RequestOptionsArgs){
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
