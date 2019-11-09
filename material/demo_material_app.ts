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
import {MDCList} from '@material/list';
import { DictionaryLoader, DictionarySource, Term, TextParser } from '@alexamies/chinesedict-js';


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
  private dialogDiv: HTMLElement;
  private wordDialog: MDCDialog;

  constructor() {
    this.button = document.querySelector('#lookup_button');
    this.tf = document.querySelector('#lookup_input');
    this.cSpan = document.querySelector('#chinese_span');
    this.pSpan = document.querySelector('#pinyin_span');
    this.eSpan = document.querySelector('#english_span');
    this.document_text = document.querySelector('#document_text');
    this.dialogDiv = document.querySelector("#CnotesVocabDialog");
    this.wordDialog = new MDCDialog(this.dialogDiv);
  }


  // Add a term object to a list of terms
  // Parameters:
  //   term is a word object
  //   tList - the term list
  // Returns a HTML element that the object is added to
  addTermToList(term: Term, tList: HTMLElement) {
    const li = document.createElement("li");
    li.className = "mdc-list-item";
    const span = document.createElement("span");
    span.className = "mdc-list-item__text";
    li.appendChild(span);
    const spanL1 = document.createElement("span");

    // Primary text is the query term (Chinese)
    spanL1.className = "mdc-list-item__primary-text";
    const tNode1 = document.createTextNode(term.getChinese());
    spanL1.appendChild(tNode1);
    span.appendChild(spanL1);

    // Secondary text is the Pinyin and English equivalent
    const entries = term.getEntries();
    const pinyin = (entries && entries.length > 0) ? entries[0].getPinyin() : "";
    const spanL2 = document.createElement("span");
    spanL2.className = "mdc-list-item__secondary-text";
    const spanPinyin = document.createElement("span");
    spanPinyin.className = "dict-entry-pinyin";
    const textNode2 = document.createTextNode(" " + pinyin + " ");
    spanPinyin.appendChild(textNode2);
    spanL2.appendChild(spanPinyin);
    spanL2.appendChild(this.combineEnglish(term));
    span.appendChild(spanL2);
    tList.appendChild(li);
    return tList;
  }s


  // Combine and crop the list of English equivalents and notes to a limited
  // number of characters.
  // Parameters:
  //   term: includes an array of DictionaryEntry objects with word senses
  // Returns a HTML element that can be added to the list element
  combineEnglish(term: Term) {
    const maxLen = 120;
    const englishSpan = document.createElement("span");
    const entries = term.getEntries();
    if (entries && entries.length == 1) {
      // if only a single sense don't enumerate a list of one
      let textLen = 0;
      const equivSpan = document.createElement("span");
      equivSpan.setAttribute("class", "dict-entry-definition");
      const equivalent = entries[0].getEnglish();
      textLen += equivalent.length;
      const equivTN = document.createTextNode(equivalent);
      equivSpan.appendChild(equivTN);
      englishSpan.appendChild(equivSpan);
    } else if (entries && entries.length > 1) {
      // For longer lists, give the enumeration with equivalents only
      let equiv = "";
      for (let j = 0; j < entries.length; j++) {
        equiv += (j + 1) + ". " + entries[j].getEnglish() + "; ";
        if (equiv.length > maxLen) {
          equiv + " ...";
          break;
        }
      }
      const equivSpan = document.createElement("span");
      equivSpan.setAttribute("class", "dict-entry-definition");
      const equivTN1 = document.createTextNode(equiv);
      equivSpan.appendChild(equivTN1);
      englishSpan.appendChild(equivSpan);
    }
    return englishSpan;
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

    const thisApp = this;
    let vocabElements = document.querySelectorAll(".vocabulary");
    vocabElements.forEach((elem) => {
      elem.addEventListener("click", function(evt) {
        evt.preventDefault();
        thisApp.showVocabDialog(elem);
        return false;
      });
    });
  }

  // Load the dictionary
  load() {
    const thisApp = this;
    const source = new DictionarySource('/ntireader.json',
                                        'NTI Reader Dictionary',
                                        'Full NTI Reader dictionary');
    const loader = new DictionaryLoader([source]);
    const observable = loader.loadDictionaries();
    observable.subscribe({
      next(x) { console.log('load next ' + x); },
      error(err) { console.error(`load error:  + ${ err }`); },
      complete() { 
        console.log('loading dictionary done');
        thisApp.headwords = loader.getHeadwords();
        const loadingStatus = document.querySelector("#loadingStatus")
        loadingStatus.innerHTML = "Dictionary loading status: loaded";
      }
    });
  }

  // Shows the vocabular dialog with details of the given word
  showVocabDialog(elem) {
    // Show Chinese, pinyin, and English
    const titleElem = document.querySelector("#VocabDialogTitle");
    const s = elem.title;
    const n = s.indexOf("|");
    const pinyin = s.substring(0, n);
    let english = "";
    if (n < s.length) {
      english = s.substring(n + 1, s.length);
    }
    const chinese = elem.textContent;
    console.log(`Value: ${chinese}`);
    const pinyinSpan = document.querySelector("#PinyinSpan");
    const englishSpan = document.querySelector("#EnglishSpan");
    titleElem.innerHTML = chinese
    pinyinSpan.innerHTML = pinyin;
    if (english) {
      englishSpan.innerHTML = english;
    } else {
      englishSpan.innerHTML = "";
    }

    // Show parts of the term for multi-character terms
    const partsDiv = document.querySelector("#parts");
    while (partsDiv.firstChild) {
      partsDiv.removeChild(partsDiv.firstChild);
    }
    const partsTitle = <HTMLElement>document.querySelector("#partsTitle");
    if (chinese.length > 1) {
      partsTitle.style.display = "block";
      const parser = new TextParser(this.headwords);
      const terms = parser.segmentExludeWhole(chinese);
      console.log(`showVocabDialog got ${ terms.length } terms`);
      const tList = document.createElement("ul");
      tList.className = "mdc-list mdc-list--two-line";
      terms.forEach((t) => {
        this.addTermToList(t, tList);
      });
      partsDiv.appendChild(tList);
    } else {
      partsTitle.style.display = "none";
    }

    // Show more details
    const term = this.headwords.get(chinese);
    if (term) {
      const entry = term.getEntries()[0];
      const notesSpan = document.querySelector("#VocabNotesSpan");
      if (entry.getSenses().length == 1) {
        const ws = entry.getSenses()[0];
        notesSpan.innerHTML = ws.getNotes();
      } else {
        notesSpan.innerHTML = "";
      }
      const sourceSpan = document.querySelector("#SourceSpan");
      const sourceTitle = entry.getSource().title;
      sourceSpan.innerHTML = 'Source: ' + entry.getSource().title;
    }

    this.wordDialog.open();
  }

}

const app = new DemoApp();
app.init();
app.load();