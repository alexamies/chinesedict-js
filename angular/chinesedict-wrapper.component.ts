import { Component, OnInit } from '@angular/core';
import { ChinesedictService } from '../chinesedict.service';

import { ChineseDict } from '../chinesedict.js';

@Component({
  selector: 'app-chinesedict-wrapper',
  templateUrl: './chinesedict-wrapper.component.html',
  styleUrls: ['./chinesedict-wrapper.component.css']
})
export class ChinesedictWrapperComponent implements OnInit {
  private dict: ChineseDict;
  english = '';
  pinyin = '';

  constructor(private chinesedictService: ChinesedictService) {}

  lookup(chinese: string) {
    console.log(`ChinesedictWrapper.lookup: ${ chinese }`);
    const entry = this.dict.lookup(chinese);
    if ('e' in entry) {
      this.english = entry['e'];
    } else {
      console.log(`ChinesedictWrapper.lookup: no English found ${ chinese }`);      
    }
    if ('p' in entry) {
      this.pinyin = entry['p'];
    }
  }

  ngOnInit() {
    console.log('ChinesedictWrapper: ngOnInit');
    this.dict = this.chinesedictService.buildDictionary();
  }
}
