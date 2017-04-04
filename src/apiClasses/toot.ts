import { Account } from './account';
import { MediaAttachment } from './media-attachment';
import { Mention } from './mention';

export class Toot {
  id: string;
  uri: string;
  url: string;
  account: Account;
  in_reply_to_id: string;
  reblog: Toot;
  spoiler_visible: boolean = false;
  spoiler_text: string;
  content: string;
  sensitive: boolean;
  created_at: string;
  reblogs_count: string;
  favourites_count: string;
  reblogged: boolean;
  favourited: boolean;
  media_attachments: MediaAttachment[];
  visibility: string;
  mentions: Mention[];
  application: {
    name: string;
    website: string;  
  }

  constructor() {
  }

}
