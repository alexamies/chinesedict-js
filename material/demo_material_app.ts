/**
 * Licensed  under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { fromEvent } from 'rxjs';
import { MDCDialog } from "@material/dialog";
import { DictionaryLoader, DictionarySource, Term } from '@alexamies/chinesedict-js';


/**
 * A demo client app that uses the Chinese-English dictionary module with
 * Material Design Web.
 */

// class encapsulating the demo application
class DemoApp {
  private headwords: Map<string, Term>;
  private button: HTMLElement;
  private tf: HTMLInputElement;
  private cSpan: HTMLElement;
  private pSpan: HTMLElement;
  private eSpan: HTMLElement;
  private document_text: HTMLElement;
  private target_text: HTMLElement;
  private dialogDiv: HTMLElement;
  private wordDialog: MDCDialog;

  constructor() {
    this.button = document.querySelector('#lookup_button');
    this.tf = document.querySelector('#lookup_input');
    this.cSpan = document.querySelector('#chinese_span');
    this.pSpan = document.querySelector('#pinyin_span');
    this.eSpan = document.querySelector('#english_span');
    this.document_text = document.querySelector('#document_text');
    this.target_text = document.querySelector('#target_text');
    this.dialogDiv = document.querySelector("#CnotesVocabDialog")
    this.wordDialog = new MDCDialog(this.dialogDiv);
  }

  init() {
    // Respond to a button click
    fromEvent(this.button, 'click')
      .subscribe(() => {
      this.document_text.style.display = "none";
      const term = this.headwords.get(this.tf.value);
      console.log(`Value: ${this.tf.value}`);
      const entry = term.getEntries()[0];
      this.cSpan.innerHTML = this.tf.value;
      this.pSpan.innerHTML = entry.getPinyin();
      this.eSpan.innerHTML = entry.getEnglish();
    });
  
    // Respond to a text click
    fromEvent(this.target_text, 'click')
      .subscribe(() => {
      this.showVocabDialog();
    });

  }

  // Load the dictionary
  load() {
    const thisApp = this;
    const source = new DictionarySource('/words.json',
                                        'Demo Dictionary',
                                        'Just for a demo');
    const loader = new DictionaryLoader([source]);
    const observable = loader.loadDictionaries();
    observable.subscribe({
      next(x) { console.log('load next ' + x); },
      error(err) { console.error(`load error:  + ${ err }`); },
      complete() { 
        console.log('loading dictionary done');
        thisApp.headwords = loader.getHeadwords();
      }
    });
  }

  // Shows the vocabular dialog with details of the given word
  showVocabDialog() {
    const titleElem = document.querySelector("#VocabDialogTitle");
    const chinese = this.target_text.textContent;
    const term = this.headwords.get(chinese);
    console.log(`Value: ${chinese}`);
    const entry = term.getEntries()[0];
    const pinyin = entry.getPinyin();
    const english = entry.getEnglish();
    const pinyinSpan = document.querySelector("#PinyinSpan");
    const englishSpan = document.querySelector("#EnglishSpan");
    titleElem.innerHTML = chinese;
    pinyinSpan.innerHTML = pinyin;
    if (english) {
      englishSpan.innerHTML = english;
    } else {
      englishSpan.innerHTML = "";
    }
    this.wordDialog.open();
  }

}

const app = new DemoApp();
app.init();
app.load();