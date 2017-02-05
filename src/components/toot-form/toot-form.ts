import { Camera, CameraOptions, FileUploadResult } from 'ionic-native/dist/esm';
import { UploadedMedia } from '../../apiClasses/uploaded-media';
import { Component, Input } from '@angular/core';
import { NavController, NavParams, Platform, ToastController, ViewController } from 'ionic-angular';
import { TootForm } from '../../apiClasses/tootForm'
import { Keyboard, ActionSheet, ImagePicker, Diagnostic } from 'ionic-native';
import { APIProvider } from '../../providers/APIProvider';
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
  spoilerToggle: Boolean;
  remainingCharacters: number = 500;
  picturePickerOptions: CameraOptions;

  isUploading:boolean = false;

  attachedMedia: UploadedMedia[] = [];


  constructor(platform: Platform, public toaster: ToastController, public navCtrl: NavController, public navParams: NavParams, public mastodon: APIProvider, public viewCtrl: ViewController) {
    let options : any = {}
    options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
    options.mediaType=Camera.MediaType.ALLMEDIA;
    options.quality = 100;
    if(platform.is('ios')){
      console.log('platform is ios, setting image destination type to native...')
      options.destinationType=Camera.DestinationType.NATIVE_URI;
    } else {
      options.destinationType=Camera.DestinationType.FILE_URI;
    }
    this.picturePickerOptions = options;

    Keyboard.disableScroll(true);
    this.newToot = new TootForm();
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
      if(!this.spoilerToggle){
        this.newToot.spoiler_text = null;
      }
      if(this.navCtrl.parent) {
        this.navCtrl.parent.select(0);
      } else {
        this.viewCtrl.dismiss();
      }
      this.mastodon.postToot(this.newToot)
      .subscribe(
        data=> {
          let toast = this.toaster.create({
            message: '🍇🍌🍍TOOT SENT 🍊🍋🍒',
            duration: 2000,
            position: 'top',
            cssClass: 'success_toast'
          });
        toast.present();  
        },
        error => console.log(JSON.stringify(error))
      );
      this.newToot = new TootForm();
      this.countTootLength();
      localStorage.setItem('lastVisibility', this.newToot.visibility);

    }
  }

  toggleSpoilerText() {
    if(this.spoilerFieldState == 'hidden'){
      this.spoilerFieldState = 'visible'
    } else {
      this.spoilerFieldState = 'hidden'
    }
    Keyboard.disableScroll(true);
  }

  countTootLength(){
    let spoilerTextLength = 0;
    if(this.newToot.spoiler_text) {
      spoilerTextLength = this.newToot.spoiler_text.length;
    }  
    this.remainingCharacters = 500 - this.newToot.status.length - spoilerTextLength;
    console.log(this.remainingCharacters);
  }

  handleImagePicking(){
    this.checkPermissions();
    let buttonLabels = ['Images', 'GIF'];
    ActionSheet.show({
      'title': 'What do you want to upload?',
      'buttonLabels': buttonLabels,
      'addCancelButtonWithLabel': 'Cancel',
      'androidTheme' : 5
    }).then((buttonIndex: number) => {
      switch(buttonIndex){
        case(1):
          this.multiImagePicker();
          break;
        case(2):
          this.singleImagePicker();
          break;
      }
    });
  }

  checkPermissions(){
    if(!Diagnostic.isCameraAuthorized()){
      Diagnostic.requestCameraAuthorization();
    }
  }

  multiImagePicker(){
    let numberOfAttachedMedia = 0
    if(this.attachedMedia) {
      numberOfAttachedMedia = this.attachedMedia.length;
    }
    let maxNewImgs: number = 4-numberOfAttachedMedia ;
    let options = {
      maximumImagesCount: maxNewImgs,
      width: 800,
      height: 800,
      quality: 100
    }

    ImagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length && i != maxNewImgs; i++) {
          this.uploadMedia(results[i]);
      }
      if(results.length > maxNewImgs){
        let toast = this.toaster.create({
            message: 'You picked too many images. I added all that fit, sorry about that :( ',
            duration: 3000,
            position: 'top'
          });
          toast.present();
      }
    }, (err) => { });
  }

  singleImagePicker(){
    Camera.getPicture(this.picturePickerOptions).then((imgURL) => {
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
    
    // TODO this doesn't really work yet when deleting first image after multipick


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

  
}
