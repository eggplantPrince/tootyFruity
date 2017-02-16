import { UserListPage } from '../pages/user-list/user-list';
import { PersonalOptionsPage } from '../pages/personal-options/personal-options';
import { UserOptionsPage } from '../pages/user-options/user-options';
import { TootFormComponent } from '../components/toot-form/toot-form';
import { NotificationItemComponent } from '../components/notification-item/notification-item';
import { SlidableTootComponent } from '../components/slidable-toot/slidable-toot';
import { ImageSliderPage } from '../pages/image-slider/image-slider';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { MediaAttachmentsComponent } from '../components/media-attachments/media-attachments';
import { ReplyTootPage } from '../pages/reply-toot/reply-toot';
import { APIProvider } from '../providers/APIProvider';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { TootPage } from '../pages/toot/toot';
import { NotificationsPage } from '../pages/notifications/notifications';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { EmojifyModule } from 'angular2-emojify';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TootPage,
    NotificationsPage,
    HomePage,
    TabsPage,
    ReplyTootPage,
    MediaAttachmentsComponent,
    ImageSliderPage,
    SlidableTootComponent,
    NotificationItemComponent,
    UserProfilePage,
    TootFormComponent,
    UserOptionsPage,
    PersonalOptionsPage,
    UserListPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    EmojifyModule,
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    HomePage,
    TootPage,
    NotificationsPage,
    UserProfilePage,
    ImageSliderPage,
    ReplyTootPage,
    UserOptionsPage,
    PersonalOptionsPage,
    UserListPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage, APIProvider]
})
export class AppModule {}
