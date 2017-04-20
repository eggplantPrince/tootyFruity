import { Toot } from './toot';
import { Notification } from './notification';
import { Account } from './account';
export class AuthedAccount {
    accessToken:string;
    mastodonAccount:Account;
    tootCache: Toot[];
    notificationsCache: Notification[];
    instanceUrl: string;
    fullUsername: string;
}
