export class TootForm{
    status: string;
    in_reply_to_id: string;
    media_ids: string[]
    sensitive: boolean;
    visibility: string;
    spoiler_text: string;

    constructor() {
      let lastVisibility = localStorage.getItem('lastVisibility');
      if(lastVisibility !== null){
        this.visibility = lastVisibility
      } else {
        this.visibility = 'public';
      }
  }
}