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
import { DictionaryViewLookup } from "./DictionaryViewLookup";
import { TextParser } from "./TextParser";
/**
 * A class for presenting Chinese words and segmenting blocks of text with one
 * or more Chinese-English dictionaries. It may highlight either all terms in
 * the text matching dictionary entries or only the proper nouns.
 */
export class DictionaryView {
    /**
     * Use a DictionaryBuilder implementation rather than calling the constructor
     * directly.
     *
     * @param {string} selector - A DOM selector used to find the page elements
     * @param {string} dialogId - A DOM id used to find the dialog
     * @param {string} highlight - Which terms to highlight: all | proper | ''
     * @param {!DictionaryViewConfig} config - Configuration of the view to build
     * @return {!DictionaryCollection} dictionaries - As a holder before loading
     */
    constructor(selector, dialogId, highlight, config, dictionaries) {
        console.log("DictionaryView constructor");
        this.dictionaries = dictionaries;
        this.selector = selector;
        this.dialogId = dialogId;
        this.highlight = highlight;
        this.dialog = document.getElementById(this.dialogId);
        const containerId = this.dialogId + "_container";
        this.dialogContainerEl = document.getElementById(containerId);
        const headwordId = this.dialogId + "_headword";
        this.headwordEl = document.getElementById(headwordId);
        this.config = config;
    }
    /**
     * Respond to a mouse over event for a dictionary term. Expected to be called
     * in response to a user event.
     *
     * @param {MouseEvent} event - An event triggered by a user
     * @param {Term} term - Encapsulates the Chinese and the English equivalent
     */
    doMouseover(event, term) {
        const target = event.target;
        const entry = term.getEntries()[0];
        target.title = `${entry.getPinyin()} | ${entry.getEnglish()}`;
    }
    /**
     * Scans blocks of text, highlighting the words in in the dictionary with
     * links that can be clicked to find the definitions. The blocks of text
     * are identified with a DOM selector. Expected to be called by a builder in
     * initializing the dictionary.
     */
    highlightWords() {
        console.log("highlightWords: enter");
        if (!this.selector) {
            console.log("highlightWords: selector empty");
            return;
        }
        const elems = document.querySelectorAll(this.selector);
        if (!elems) {
            console.log(`findwords: no elements matching ${this.selector}`);
            return;
        }
        console.log(`highlightWords: ${elems.length} elems`);
        elems.forEach((el) => {
            const text = el.textContent;
            // console.log(`highlightWords: ${ text }`);
            if (text) {
                const terms = this.segment_text_(text);
                this.decorate_segments_(el, terms, this.dialogId, this.highlight);
            }
            else {
                console.log(`highlightWords: text is empty or null`);
            }
        });
    }
    /**
     * Whether the dictionary sources have been loaded
     */
    isLoaded() {
        return this.dictionaries.isLoaded();
    }
    /**
     * Look up a term in the matching the given Chinese
     */
    lookup(chinese) {
        return this.dictionaries.lookup(chinese);
    }
    /**
     * Sets the collection of dictionaries to use in the dictionary view.
     *
     * @param {!DictionaryCollection} The collection of dictionaries
     */
    setDictionaryCollection(dictionaries) {
        console.log("setDictionaryCollection enter");
        this.dictionaries = dictionaries;
    }
    /**
     * Add a listener to the dialog OK button. The OK button should have the ID
     * of the dialog with '_ok' appended. Expected to be called by a builder in
     * initializing the dictionary.
     */
    setupDialog() {
        const dialogOkId = this.dialogId + "_ok";
        let dialogOk = document.getElementById(dialogOkId);
        if (!this.dialog) {
            console.log(`setupDialog ${this.dialogId} not found, creating`);
            this.dialog = document.createElement("dialog");
            this.headwordEl = document.createElement("p");
            this.dialog.appendChild(this.headwordEl);
            this.dialogContainerEl = document.createElement("div");
            this.dialog.appendChild(this.dialogContainerEl);
            dialogOk = document.createElement("button");
            dialogOk.innerText = "OK";
            dialogOk.className = "dialog_ok";
            this.dialog.appendChild(dialogOk);
            document.body.appendChild(this.dialog);
        }
        if (this.dialog instanceof HTMLDialogElement) {
            if (typeof dialogPolyfill !== "undefined") {
                dialogPolyfill.registerDialog(this.dialog);
            }
        }
        else {
            console.log(`dialog is typeof ${typeof this.dialog}`);
        }
        dialogOk.addEventListener("click", () => {
            if (this.dialog instanceof HTMLDialogElement) {
                this.dialog.close();
            }
        });
    }
    /**
     * Show a dialog with the dictionary definition. Expected to be called in
     * response to a user clicking on a highlighted word.
     *
     * @param {MouseEvent} event - An event triggered by a user
     * @param {Term} term - Encapsulates the Chinese and the English equivalent
     * @param {string} dialogId - A DOM id used to find the dialog
     */
    showDialog(event, term, dialogId) {
        const target = event.target;
        const chinese = target.textContent;
        if (term.getEntries().length === 0) {
            return;
        }
        if (this.headwordEl && chinese) {
            this.headwordEl.innerHTML = chinese;
        }
        if (this.dialogContainerEl) {
            while (this.dialogContainerEl.firstChild) {
                this.dialogContainerEl.removeChild(this.dialogContainerEl.firstChild);
            }
        }
        // console.log(`showDialog got: ${ term.getEntries().length } entries`);
        if (chinese) {
            for (const entry of term.getEntries()) {
                this.addDictEntryToDialog(chinese, entry);
            }
        }
        if (this.dialog) {
            this.dialog.showModal();
        }
    }
    /**
     * Initializes the view to listen for events, wiring the HTML elements to
     * the event subscribers.
     */
    wire() {
        console.log("DictionaryView.init enter");
        if (this.config.isWithLookupInput()) {
            const viewLookup = new DictionaryViewLookup(this.config, this.dictionaries);
            const resultsView = this.config.getQueryResultsSubscriber();
            viewLookup.wire()
                .subscribe((value) => {
                const qResults = value;
                if (!qResults) {
                    resultsView.error("DictionaryView no results found");
                }
                else {
                    resultsView.next(qResults);
                }
            }, (err) => { resultsView.error(`Initialization error: ${err}`); });
        }
    }
    /**
     * Add a dictionary entry to the dialog
     *
     * @param {string} chinese - the Chinese text
     * @param {DictionaryEntry} entry - the word data to add to the dialog
     */
    addDictEntryToDialog(chinese, entry) {
        const containerEl = document.createElement("div");
        const pinyinEl = document.createElement("span");
        pinyinEl.className = "dict-dialog_pinyin";
        pinyinEl.innerHTML = entry.getPinyin();
        containerEl.appendChild(pinyinEl);
        const englishEl = document.createElement("span");
        englishEl.className = "dict-dialog_english";
        englishEl.innerHTML = entry.getEnglish();
        containerEl.appendChild(englishEl);
        if (entry.getHeadwordId()) {
            const headwordIdEl = document.createElement("span");
            headwordIdEl.className = "dict-dialog_headword_id";
            headwordIdEl.innerHTML = entry.getHeadwordId();
            containerEl.appendChild(headwordIdEl);
        }
        const sourceEl = document.createElement("span");
        sourceEl.innerHTML = `Source: ${entry.getSource().title} <br/>
      ${entry.getSource().description}`;
        containerEl.appendChild(sourceEl);
        this.addPartsToDialog(chinese, containerEl);
        this.dialogContainerEl.appendChild(containerEl);
    }
    /**
     * Add parts of a Chinese string to the dialog
     *
     * @param {string} chinese - the Chinese text
     * @param {HTMLDivElement} containerEl - to display the parts in
     */
    addPartsToDialog(chinese, containerEl) {
        console.log(`addPartsToDialog enter ${chinese}`);
        const partsEl = document.createElement("div");
        const partsTitleEl = document.createElement("h5");
        partsTitleEl.innerHTML = `Characters`;
        partsEl.appendChild(partsTitleEl);
        let numAdded = 0;
        const parser = new TextParser(this.dictionaries);
        const terms = parser.segmentExludeWhole(chinese);
        terms.forEach((t) => {
            numAdded++;
            let eng = "";
            for (const entry of t.getEntries()) {
                eng += entry.getEnglish() + " ";
            }
            const partsBodyEl = document.createElement("div");
            partsBodyEl.innerHTML = `${t.getChinese()}: ${eng}`;
            partsEl.appendChild(partsBodyEl);
        });
        if (numAdded > 0) {
            containerEl.appendChild(partsEl);
        }
    }
    /**
     * Decorate the segments of text
     *
     * @private
     * @param {!HTMLElement} elem - The DOM element to add the segments to
     * @param {!Array.<Term>} terms - The segmented text array of terms
     * @param {string} dialogId - A DOM id used to find the dialog
     * @param {string} highlight - Which terms to highlight: all | proper | ''
     */
    decorate_segments_(elem, terms, dialogId, highlight) {
        console.log(`decorate_segments_ dialogId: ${dialogId}, ${highlight}`);
        elem.innerHTML = "";
        for (const term of terms) {
            const entry = term.getEntries()[0];
            const chinese = term.getChinese();
            if (entry && entry.getEnglish()) {
                // console.log(`decorate_segments_ chinese: ${chinese}`);
                const grammar = entry.getGrammar();
                if ((highlight !== "proper") || (grammar === "proper noun")) {
                    const link = document.createElement("a");
                    link.textContent = chinese;
                    link.href = "#";
                    link.className = "highlight";
                    link.addEventListener("click", (event) => {
                        this.showDialog(event, term, dialogId);
                    });
                    link.addEventListener("mouseover", (event) => {
                        this.doMouseover(event, term);
                    });
                    elem.appendChild(link);
                }
                else {
                    const span = document.createElement("span");
                    span.className = "nohighlight";
                    span.textContent = chinese;
                    span.addEventListener("click", (event) => {
                        this.showDialog(event, term, dialogId);
                    });
                    span.addEventListener("mouseover", (event) => {
                        this.doMouseover(event, term);
                    });
                    elem.appendChild(span);
                }
            }
            else {
                const text = document.createTextNode(chinese);
                elem.appendChild(text);
            }
        }
    }
    /**
     * Segments the text into an array of individual words
     *
     * @private
     * @param {string} text - The text string to be segmented
     * @return {Array.<Term>} The segmented text as an array of terms
     */
    segment_text_(text) {
        const parser = new TextParser(this.dictionaries);
        return parser.segmentText(text);
    }
}
