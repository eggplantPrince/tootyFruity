import { ImageSliderPage } from '../../pages/image-slider/image-slider';
import { FileUploadResult } from '@ionic-native/transfer';
import { UploadedMedia } from '../../apiClasses/uploaded-media';
import { Component, Input } from '@angular/core';
import {
    ActionSheetController,
    ActionSheetOptions,
    ModalController,
    NavController,
    NavParams,
    Platform,
    ToastController,
    ViewController
} from 'ionic-angular';
import { TootForm } from '../../apiClasses/tootForm';
import { APIProvider } from '../../providers/APIProvider';
import { Keyboard } from '@ionic-native/keyboard';
import { Camera, CameraOptions } from '@ionic-native/camera';


/*


  Generated class for the TootForm component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'toot-form',
  templateUrl: 'toot-form.html'
})
export class TootFormComponent {

  @Input()
  newToot: TootForm;
  
  spoilerFieldState: string = 'hidden';
  @Input()
  spoilerToggle: Boolean;
  remainingCharacters: number = 500;
  picturePickerOptions: CameraOptions;

  isUploading:boolean = false;

  attachedMedia: UploadedMedia[] = [];


  constructor(platform: Platform, public modalController: ModalController, public toaster: ToastController, 
              public navCtrl: NavController, public navParams: NavParams, private mastodon: APIProvider, 
              public viewCtrl: ViewController, public camera: Camera,
              public actionSheetCtrl: ActionSheetController, public keyboard: Keyboard) {
    let options : any = {}
    options.sourceType = camera.PictureSourceType.PHOTOLIBRARY;
    options.mediaType=camera.MediaType.ALLMEDIA;
    options.quality = 100;
    if(platform.is('ios')){
      console.log('platform is ios, setting image destination type to native...')
      options.destinationType=camera.DestinationType.NATIVE_URI;
    } else {
      options.destinationType=camera.DestinationType.FILE_URI;
    }
    this.picturePickerOptions = options;

    keyboard.disableScroll(true);
    this.newToot = new TootForm();
  }

  ngAfterViewInit(){
    if(this.newToot.status){
      this.countTootLength();
    }
    let lastVisibility = localStorage.getItem('lastVisibility');
    if(this.newToot.visibility == 'public' && lastVisibility) {
      this.newToot.visibility = lastVisibility;
    }
  }

  sendToot() {
    if(this.newToot.status == null ){
      let toast = this.toaster.create({
        message: 'Your toot needs some fruit (aka content)!',
        duration: 3000,
        position: 'top'
      });
      toast.present();  
    } else if(this.remainingCharacters < 0) {
      let toast = this.toaster.create({
        message: 'Wow! You used too many characters, try shortening it down',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } 
    else {
      console.log('posting new toot...')
      console.log(this.newToot.spoiler_text)
      this.mastodon.postToot(this.newToot)
      .subscribe(
        data=> {
          let toast = this.toaster.create({
            message: '🍇🍌🍍TOOT SENT 🍊🍋🍒',
            duration: 2000,
            position: 'top',
            cssClass: 'success_toast'
          });
        if(this.newToot.in_reply_to_id == null) {
          localStorage.setItem('lastVisibility', this.newToot.visibility);
        }
        toast.present();  
        this.newToot = new TootForm();
        },
        error => console.log(JSON.stringify(error))
      );
      if(!this.spoilerToggle){
        this.newToot.spoiler_text = null;
      }
      if(this.navCtrl.parent) {
        this.navCtrl.parent.select(0);
      } else {
        this.viewCtrl.dismiss();
      }
    }
  }

  toggleSpoilerText() {
    if(this.spoilerFieldState == 'hidden'){
      this.spoilerFieldState = 'visible'
      this.newToot.spoiler_text = "";
    } else {
      this.newToot.spoiler_text = null;
      this.spoilerFieldState = 'hidden'
    }
    this.keyboard.disableScroll(true);
  }

  countTootLength(){
    let spoilerTextLength = 0;
    let tootContentLength = 0;
    if(this.newToot.spoiler_text) {
      spoilerTextLength = this.newToot.spoiler_text.length;
    }  
    if(this.newToot.status){
      tootContentLength = this.newToot.status.length
    }
    this.remainingCharacters = 500 - tootContentLength - spoilerTextLength;
    console.log(this.newToot.status)
    console.log(this.newToot.spoiler_text)
    console.log(this.remainingCharacters);
  }

  handleImagePicking(){
    if(this.attachedMedia.length == 4){
      let toast = this.toaster.create({
          message: 'You picked too many images. I cannot add more, sorry about that :( ',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        return;
    }
    let buttonLabels = ['Fast Upload', 'Full Size (and GIFs!)'];
    let actionSheet = this.actionSheetCtrl.create({
      'title': 'How do you want to upload?',
      'buttonLabels': buttonLabels,
      'addCancelButtonWithLabel': 'Cancel',
      'androidTheme' : 5
    }as ActionSheetOptions);
    
    actionSheet.present().then((buttonIndex: number) => {
      switch(buttonIndex){
        case(1):
          this.picturePickerOptions.quality = 60;
          this.picturePickerOptions.targetWidth = 800;
          this.picturePickerOptions.targetHeight = 800;
          this.singleImagePicker();
          break;
        case(2):
          this.picturePickerOptions.quality = 100;
          this.picturePickerOptions.targetWidth = 0;
          this.picturePickerOptions.targetHeight = 0;
          this.singleImagePicker();
          break;
      }
    });
  }

  singleImagePicker(){
    this.camera.getPicture(this.picturePickerOptions).then((imgURL) => {
      this.uploadMedia(imgURL);
    }, (err) => { console.log(JSON.stringify(err))});
  }

  uploadMedia(imgURL:string){
    console.log('path to img: ' + JSON.stringify(imgURL));
      if(imgURL){
        this.isUploading = true
        let promise: Promise<FileUploadResult> = this.mastodon.uploadMedia(imgURL)
        if(promise == null){
          let toast = this.toaster.create({
            message: 'I can only handle .jpg, .png, and .gif files. Sorry :(',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          return null;
        } 
        promise.then((data) => {
          if(data){
            if(!this.newToot.media_ids){
              this.newToot.media_ids = []
            }
            let attachment: UploadedMedia = JSON.parse(data.response);
            this.newToot.media_ids.push(attachment.id);
            if(this.newToot.status)
              this.newToot.status = this.newToot.status + " " + attachment.text_url;
            else
              this.newToot.status = " " + attachment.text_url;
            console.log(JSON.stringify(this.newToot.media_ids)); 
            this.attachedMedia.push(attachment);
            this.countTootLength();    
            this.isUploading = false;
          }
        }, (error) => {
          console.log('error');
          console.log(JSON.stringify(error))
      })
      }
  }

  removeAttachment(media:UploadedMedia){
    
    //remove attachment from view
    let index = this.attachedMedia.indexOf(media);
    this.attachedMedia.splice(index,1);
    
    //remove attachment from newToot object
    index = this.newToot.media_ids.indexOf(media.id)
    this.newToot.media_ids.splice(index,1);
    

    let startOfMediaURL = this.newToot.status.indexOf(media.text_url);
    let status_part_one = this.newToot.status.substring(0,startOfMediaURL -1)
    
    
    let status_part_two = this.newToot.status.substring(startOfMediaURL + media.text_url.length)

    
    console.log("old status: " + this.newToot.status);
    this.newToot.status = status_part_one + status_part_two;
    console.log("p1 '" + status_part_one+"'");
    console.log("p2 '" + status_part_two+"'");

    if(this.attachedMedia.length == 0){
      this.newToot.media_ids = null;
    }
    console.log('attachment removed')
    this.countTootLength();
  }


  showSlideShowFrom(index: number){
    console.log('show slides is called')
    console.log('warning already gone')
    let myModal = this.modalController.create(ImageSliderPage, { 'mediaAttachments' : this.attachedMedia, 'slideFromNumber': index});
    myModal.present();
  }
  
}
