import { Notification } from '../../apiClasses/notification';
import { Component, Input } from '@angular/core';

/*
  Generated class for the NotificationItem component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'notification-item',
  templateUrl: 'notification-item.html'
})
export class NotificationItemComponent {

  @Input()
  notification: Notification;

  constructor() {
    
  }

}
