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
import { DictionaryLoader, DictionarySource, TextParser } from '@alexamies/chinesedict-js';
/**
 * A demo client app that uses the Chinese-English dictionary module with
 * Material Design Web.
 */
// class encapsulating the demo application
class DemoApp {
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
            elem.addEventListener("click", function (evt) {
                evt.preventDefault();
                thisApp.showVocabDialog(elem);
                return false;
            });
        });
    }
    // Load the dictionary
    load() {
        const thisApp = this;
        const source = new DictionarySource('/ntireader.json', 'NTI Reader Dictionary', 'Full NTI Reader dictionary');
        const loader = new DictionaryLoader([source]);
        const observable = loader.loadDictionaries();
        observable.subscribe({
            next(x) { console.log('load next ' + x); },
            error(err) { console.error(`load error:  + ${err}`); },
            complete() {
                console.log('loading dictionary done');
                thisApp.headwords = loader.getHeadwords();
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
        titleElem.innerHTML = chinese;
        pinyinSpan.innerHTML = pinyin;
        if (english) {
            englishSpan.innerHTML = english;
        }
        else {
            englishSpan.innerHTML = "";
        }
        // Show more details
        const term = this.headwords.get(chinese);
        if (term) {
            const entry = term.getEntries()[0];
            const notesSpan = document.querySelector("#VocabNotesSpan");
            englishSpan.innerHTML = entry.getSource().title;
        }
        // Show parts of the term
        const parser = new TextParser(this.headwords);
        const terms = parser.segmentText(chinese);
        terms.forEach((t) => {
            const c = t.getChinese();
            console.log(`showVocabDialog ${c} `);
        });
        this.wordDialog.open();
    }
}
const app = new DemoApp();
app.init();
app.load();
