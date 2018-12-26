import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ChineseDict, DictionaryBuilder } from './chinesedict.js';

/** 
 * An implementation of the DictionaryBuilder interface for building and
 * initializing ChineseDict objects for Angular apps.
 */
@Injectable({
  providedIn: 'root'
})
export class ChinesedictService implements DictionaryBuilder {
  private filename: string = '/assets/words_all.json';

  /**
   * Creates the service
   *
   * @param {HttpClient} http - The HTTP client
   */
  constructor(private http: HttpClient) {}

  /**
   * Creates and initializes a ChineseDict
   */
  buildDictionary(): ChineseDict {
    const dict = new ChineseDict('p.sourcetext', 'dict-dialog', 'proper');
    this.http.get(this.filename)
      .subscribe(data => this.loadDict(dict, data));
    return dict;
  }

  loadDict(dict, entries) {
    console.log(`ChinesedictService.loadDict: ${ entries.length } entries`);
    dict.loadDictionary(entries, dict.headwords);
    dict.highlightWords(dict.selector, dict.dialog_id, dict.highlight);
    dict.setupDialog(dict.dialog_id);
    console.log(`ChinesedictService.loadDict: loaded`);
  }

}
