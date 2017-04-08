import { Utility } from './utility';
import { AuthedAccount } from '../apiClasses/authedAccount';
import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable()
export class SwitcherService {
    private subject = new Subject<AuthedAccount>();

    constructor(private utility: Utility){

    }

    changeAccount(account: AuthedAccount){
        this.utility.saveCurrentAccount(account);
        this.subject.next(account);
    }

    getAccount(): Observable<any>{
        return this.subject.asObservable();
    }
}