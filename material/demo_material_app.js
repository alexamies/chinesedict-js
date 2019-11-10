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
import { DictionaryCollection } from '@alexamies/chinesedict-js';
import { DictionaryLoader } from '@alexamies/chinesedict-js';
import { DictionarySource } from '@alexamies/chinesedict-js';
import { TextParser } from '@alexamies/chinesedict-js';
/**
 * A demo client app that uses the Chinese-English dictionary module with
 * Material Design Web.
 */
// class encapsulating the demo application
class DemoApp {
    constructor() {
        this.dictionaries = new DictionaryCollection();
        this.button = this.querySelectorNonNull('#lookup_button');
        this.tf = this.querySelectorNonNull('#lookup_input');
        this.cSpan = this.querySelectorNonNull('#chinese_span');
        this.pSpan = this.querySelectorNonNull('#pinyin_span');
        this.eSpan = this.querySelectorNonNull('#english_span');
        this.document_text = this.querySelectorNonNull('#document_text');
        this.dialogDiv = this.querySelectorNonNull("#CnotesVocabDialog");
        this.wordDialog = new MDCDialog(this.dialogDiv);
    }
    // Add a term object to a list of terms
    // Parameters:
    //   term is a word object
    //   tList - the term list
    // Returns a HTML element that the object is added to
    addTermToList(term, tList) {
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
    }
    // Combine and crop the list of English equivalents and notes to a limited
    // number of characters.
    // Parameters:
    //   term: includes an array of DictionaryEntry objects with word senses
    // Returns a HTML element that can be added to the list element
    combineEnglish(term) {
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
        }
        else if (entries && entries.length > 1) {
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
    // Gets DOM element text content checking for null
    getTextNonNull(elem) {
        const chinese = elem.textContent;
        if (chinese === null) {
            return "";
        }
        return chinese;
    }
    init() {
        // Respond to a button click
        fromEvent(this.button, 'click')
            .subscribe(() => {
            this.document_text.style.display = "none";
            const term = this.dictionaries.lookup(this.tf.value);
            if (term) {
                console.log(`Value: ${this.tf.value}`);
                const entry = term.getEntries()[0];
                this.cSpan.innerHTML = this.tf.value;
                this.pSpan.innerHTML = entry.getPinyin();
                this.eSpan.innerHTML = entry.getEnglish();
            }
            else {
                console.log(`Value not found ${this.tf.value}`);
            }
        });
        const thisApp = this;
        const vocabElements = document.querySelectorAll(".vocabulary");
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
        const source = new DictionarySource('ntireader.json', 'NTI Reader Dictionary', 'Nan Tien Institute Reader dictionary');
        const loader = new DictionaryLoader([source]);
        const observable = loader.loadDictionaries();
        observable.subscribe({
            error(err) { console.error(`load error:  + ${err}`); },
            complete() {
                console.log('loading dictionary done');
                thisApp.dictionaries = loader.getDictionaryCollection();
                const loadingStatus = thisApp.querySelectorNonNull("#loadingStatus");
                loadingStatus.innerHTML = "Dictionary loading status: loaded";
            }
        });
    }
    // Looks up an element checking for null
    querySelectorNonNull(selector) {
        const elem = document.querySelector(selector);
        if (elem === null) {
            console.log(`Unexpected missing HTML element ${selector}`);
        }
        return elem;
    }
    // Shows the vocabular dialog with details of the given word
    showVocabDialog(elem) {
        // Show Chinese, pinyin, and English
        const titleElem = this.querySelectorNonNull("#VocabDialogTitle");
        const s = elem.title;
        const n = s.indexOf("|");
        const pinyin = s.substring(0, n);
        let english = "";
        if (n < s.length) {
            english = s.substring(n + 1, s.length);
        }
        const chinese = this.getTextNonNull(elem);
        console.log(`Value: ${chinese}`);
        const pinyinSpan = this.querySelectorNonNull("#PinyinSpan");
        const englishSpan = this.querySelectorNonNull("#EnglishSpan");
        titleElem.innerHTML = chinese;
        pinyinSpan.innerHTML = pinyin;
        if (english) {
            englishSpan.innerHTML = english;
        }
        else {
            englishSpan.innerHTML = "";
        }
        // Show parts of the term for multi-character terms
        const partsDiv = this.querySelectorNonNull("#parts");
        while (partsDiv.firstChild) {
            partsDiv.removeChild(partsDiv.firstChild);
        }
        const partsTitle = this.querySelectorNonNull("#partsTitle");
        if (chinese != null && chinese.length > 1) {
            partsTitle.style.display = "block";
            const parser = new TextParser(this.dictionaries);
            const terms = parser.segmentExludeWhole(chinese);
            console.log(`showVocabDialog got ${terms.length} terms`);
            const tList = document.createElement("ul");
            tList.className = "mdc-list mdc-list--two-line";
            terms.forEach((t) => {
                this.addTermToList(t, tList);
            });
            partsDiv.appendChild(tList);
        }
        else {
            partsTitle.style.display = "none";
        }
        // Show more details
        if (this.dictionaries.has(chinese)) {
            const term = this.dictionaries.lookup(chinese);
            const entry = term.getEntries()[0];
            const notesSpan = this.querySelectorNonNull("#VocabNotesSpan");
            if (entry.getSenses().length == 1) {
                const ws = entry.getSenses()[0];
                notesSpan.innerHTML = ws.getNotes();
            }
            else {
                notesSpan.innerHTML = "";
            }
            const sourceSpan = this.querySelectorNonNull("#SourceSpan");
            const sourceTitle = entry.getSource().title;
            sourceSpan.innerHTML = 'Source: ' + entry.getSource().title;
        }
        this.wordDialog.open();
    }
}
const app = new DemoApp();
app.init();
app.load();
