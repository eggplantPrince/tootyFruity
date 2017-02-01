import { Component } from '@angular/core';

/*
  Generated class for the MediaAttachments component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'media-attachments',
  templateUrl: 'media-attachments.html'
})
export class MediaAttachmentsComponent {

  text: string;

  constructor() {
    console.log('Hello MediaAttachments Component');
    this.text = 'Hello World';
  }

}
