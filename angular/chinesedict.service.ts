import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChinesedictService {
  private wordsUrl: string = '/assets/words_all.json';
  private dict: Map<string, string> = new Map<string, string>();

  constructor(private http: HttpClient) {}

  getEnglish(chinese) {
    console.log(`getEnglish: ${ chinese } `);
    if (this.dict.has(chinese)) {
      return this.dict.get(chinese);
    }
    return {};
  }

  initDict() {
    console.log('ChinesedictService: initDict enter');
    this.http.get(this.wordsUrl)
      .subscribe(data => this.loadDict(data));
  }

  loadDict(entries) {
    console.log(`ChinesedictService.loadDict: ${ entries.length } entries`);
    for (let entry of entries) {
      this.dict.set(entry['t'], entry);
    }
    console.log('ChinesedictService: loadDict done');
  }
}
