import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChinesedictService } from '../chinesedict.service';

import { DictionaryView } from '../chinesedict.js';

@Component({
  selector: 'app-chinesedict-wrapper',
  templateUrl: './chinesedict-wrapper.component.html',
  styleUrls: ['./chinesedict-wrapper.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChinesedictWrapperComponent implements OnInit {
  private dict: DictionaryView;
  english = '';
  pinyin = '';

  constructor(private chinesedictService: ChinesedictService) {}

  lookup(chinese: string) {
    console.log(`ChinesedictWrapper.lookup: ${ chinese }`);
    const term = this.dict.lookup(chinese);
    const entry = term.getEntries()[0];
    this.english = entry.getEnglish();
    this.pinyin = entry.getPinyin();
  }

  ngOnInit() {
    console.log('ChinesedictWrapper: ngOnInit');
    this.dict = this.chinesedictService.buildDictionary();
  }
}
