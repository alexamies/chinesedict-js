import { Component, Input, OnInit } from '@angular/core';
import { ChinesedictService } from '../chinesedict.service';

@Component({
  selector: 'app-chinesedict-wrapper',
  templateUrl: './chinesedict-wrapper.component.html',
  styleUrls: ['./chinesedict-wrapper.component.css']
})
export class ChinesedictWrapperComponent implements OnInit {
  english = '';
  pinyin = '';

  constructor(private chinesedictService: ChinesedictService) {}

  lookup(chinese: string) {
    console.log(`ChinesedictWrapper.getEnglish: ${ chinese }`);
    const entry = this.chinesedictService.getEnglish(chinese);
    this.english = entry['e'];
    this.pinyin = entry['p'];
  }

  ngOnInit() {
    console.log('ChinesedictWrapper: ngOnInit');
    this.chinesedictService.initDict();
  }

}
