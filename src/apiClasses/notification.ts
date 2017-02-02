import { Toot } from './toot';
import { Account } from './account';
export class Notification {
    id: string;
    type: string;
    account: Account;
    status: Toot;
}