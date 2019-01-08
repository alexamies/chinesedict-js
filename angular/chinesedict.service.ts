import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DictionarySource, DictionaryView, DictionaryBuilder } from './chinesedict.js';

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
  buildDictionary(): DictionaryView {
    const dict = new DictionaryView('p.sourcetext', 'dict-dialog', 'proper');
    this.http.get(this.filename)
      .subscribe(data => this.loadDict(dict, data));
    return dict;
  }

  loadDict(dict, entries) {
    console.log(`ChinesedictService.loadDict: ${ entries.length } entries`);
    const source = new DictionarySource('dist/words.json',
      'NTI Reader Dictionary',
      `Nan Tien Temple Reader Dictionary,
      <a href='https://github.com/alexamies/buddhist-dictionary'
      >https://github.com/alexamies/buddhist-dictionary</a>`)
    dict.loadDictionary([source], entries);
    dict.highlightWords(dict.selector, dict.dialog_id, dict.highlight);
    dict.setupDialog(dict.dialog_id);
    console.log(`ChinesedictService.loadDict: loaded`);
  }

}
