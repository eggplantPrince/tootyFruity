import { MediaAttachment } from '../../apiClasses/media-attachment';
import { Component, Input } from '@angular/core';

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


  @Input()
  mediaAttachments: MediaAttachment[];

  @Input()
  mediaIsSensitive: boolean;

  hideWarning = false;

  constructor() {
  }

  toggleWarning(){
    console.log('toggling warning')
    this.hideWarning = !this.hideWarning;
  }



}
