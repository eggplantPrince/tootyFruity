import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'sanitizeHtml'
})
export class SanitizeHtml implements PipeTransform  {

   constructor(private _sanitizer: DomSanitizer){}  

   transform(html: string) : SafeHtml {
      return this._sanitizer.bypassSecurityTrustHtml(html); 
   } 
} 