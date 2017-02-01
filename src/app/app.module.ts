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

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TootPage,
    NotificationsPage,
    HomePage,
    TabsPage,
    ReplyTootPage,
    MediaAttachmentsComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    EmojifyModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TootPage,
    NotificationsPage,
    HomePage,
    TabsPage,
    ReplyTootPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage, APIProvider]
})
export class AppModule {}
