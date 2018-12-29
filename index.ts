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

/**
 * @fileoverview
 * A module that encapsulates a Chinese-English dictionary, including finding
 * words in sections of Chinese text.
 */

// Dependencies, including Browser implementation of fetch and dialogPolyfill
// pollyfill for HTMLDialogElement
declare var fetch;
declare var dialogPolyfill;
declare global {
  interface HTMLDialogElement {
      close(): void;
      showModal(): void;
  }
}

/** 
 * A class for finding Chinese words and segmenting blocks of text with a
 * Chinese-English dictionary. May highlight either all terms in the text 
 * matching dictionary entries or only the proper nouns.
 */
export class ChineseDict {
  headwords: Map<string, Term>;
  selector: string;
  dialog_id: string;
  highlight: 'all' | 'proper' | '';

  /**
   * Use a DictionaryBuilder implementation rather than calling the constructor
   * directly.
   *
   * @param {string} selector - A DOM selector used to find the page elements
   * @param {string} dialog_id - A DOM id used to find the dialog
   * @param {string} highlight - Which terms to highlight: all | proper | ''
   */
  constructor(selector: string,
              dialog_id: string,
              highlight: 'all' | 'proper' | '') {
    console.log('ChineseDict constructor');
  	this.headwords = new Map<string, Term>();
    this.selector = selector;
    this.dialog_id = dialog_id;
    this.highlight = highlight;
  }

  /**
   * Decorate the segments of text
   *
   * @private
   * @param {!HTMLElement} elem - The DOM element to add the segments to
   * @param {!Array.<Term>} terms - The segmented text array of terms
   * @param {string} dialog_id - A DOM id used to find the dialog
   * @param {string} highlight - Which terms to highlight: all | proper
   */
  decorate_segments_(elem: HTMLElement,
                     terms: Array<Term>,
                     dialog_id: string,
                     highlight: 'all' | 'proper') {
    console.log(`decorate_segments_ dialog_id: ${dialog_id}, ${highlight}`);
  	elem.innerHTML = "";
  	for (let term of terms) {
  	  const chinese = term.getChinese();
      const grammar = term.getGrammar();
  	  if (term.getHeadwordId()) {
        if ((highlight !== 'proper') || (grammar === 'proper noun')) {
          const link: HTMLAnchorElement = document.createElement('a');
          link.textContent = chinese;
          link.href = '#';
          link.className = 'highlight';
          link.addEventListener('click', (event) => {
            this.showDialog(event, term, dialog_id)});
          link.addEventListener('mouseover', (event) => {
            this.doMouseover(event, term)});
          elem.appendChild(link);
        } else {
          const span: HTMLSpanElement = document.createElement('span');
          span.className = 'nohighlight';
          span.textContent = chinese;
          span.addEventListener('click', (event) => {
            this.showDialog(event, term, dialog_id)});
          span.addEventListener('mouseover', (event) => {
            this.doMouseover(event, term)});
          elem.appendChild(span);
        }
  	  } else {
        var text = document.createTextNode(chinese);
        elem.appendChild(text);
  	  }
  	}
  }

  /**
   * Respond to a mouse over event for a dictionary term. Expected to be called
   * in response to a user event.
   *
   * @param {MouseEvent} event - An event triggered by a user
   * @param {Term} term - Encapsulates the Chinese and the English equivalent
   */
  doMouseover(event: MouseEvent, term: Term) {
    const target = <HTMLElement>event.target;
    target.title = `${term.getPinyin()} | ${term.getEnglish()}`;
  }

  /**
   * Scans blocks of text, highlighting the words in in the dictionary with
   * links that can be clicked to find the definitions. The blocks of text
   * are identified with a DOM selector. Expected to be called by a builder in
   * initializing the dictionary.
   *
   * @param {string} selector - A DOM selector used to find the page elements
   * @param {string} dialog_id - A DOM id used to find the dialog
   * @param {string} highlight - Which terms to highlight: all | proper
   */
  highlightWords(selector, dialog_id, highlight) {
  	if (!selector) {
      console.log('findwords: selector empty');
      return;
  	}
    let elems = document.body.querySelectorAll(selector);
    if (!elems) {
      console.log(`findwords: no elements matching ${selector}`);
      return;
    }
    console.log(`findwords num elems: ${elems.length}`);
    for (let i = 0; i < elems.length; i++) {
      const el = elems[i];
      const text = el.textContent;
      let terms = this.segment_text_(text);
      this.decorate_segments_(el, terms, dialog_id, highlight);
    }
  }

  /**
   * Deserializes the dictionary from protobuf format. Expected to be called by
   * a builder in initializing the dictionary.
   *
   * @param {!Array.<Array.<String>>} dictData - An array of dictionary terms
   */
  loadDictionary(dictData) {
    console.log(`read ${dictData.length} dictionary entries`);
    for (let i = 0; i < dictData.length; i++) {
      const entry = dictData[i];
      const traditional = entry["t"];
      const sense = new WordSense(entry["s"],
                                  entry["t"],
                                  entry['p'],
                                  entry['e'],
                                  entry['g']);
      const term = new Term(traditional,
                            entry['h'],
                            sense);
      this.headwords.set(traditional, term);
    }
  }

  /**
   * Look up a term in the matching the given Chinese
   */
  lookup(chinese: string): Term {
    if (this.headwords.has(chinese)) {
      return this.headwords.get(chinese);
    }
    const sense = new WordSense('', '', '', '', '');
    return new Term(chinese, '', sense);
  }

  /**
   * Segments the text into an array of individual words
   * 
   * @private
   * @param {string} text - The text string to be segmented
   * @return {Array.<Term>} The segmented text as an array of terms
   */
  segment_text_(text): Array<Term> {
  	if (!text) {
  	  console.log('segment_text_ empty text');
  	  return [];
  	}
    let segments: Array<Term> = [];
    let j = 0;
    while (j < text.length) {
      let k = text.length - j;
      while (k > 0) {
        const chars = text.substring(j, j + k);
        if (this.headwords.has(chars)) {
          //console.log(`findwords found: ${chars} for j ${j}, k ${k}`);
          const term = this.headwords.get(chars);
          segments.push(term);
          j += chars.length;
          break;
        }
        if (chars.length == 1) {
          const sense = new WordSense('', '', '', '', '');
          segments.push(new Term(chars, '', sense));
          j++;
        }
        k--;
      }
    }
    return segments;
  }

  /**
   * Add a listener to the dialog OK button. The OK button should have the ID
   * of the dialog with '_ok' appended. Expected to be called by a builder in
   * initializing the dictionary.
   *
   * @param {string} dialog_id - The DOM id of the dialog HTML element
   */
  setupDialog(dialog_id) {
  	const dialog = document.getElementById(dialog_id);
    if (typeof dialogPolyfill !== 'undefined') {
      dialogPolyfill.registerDialog(dialog);
    }
  	const dialog_ok_id = dialog_id + '_ok';
  	const dialog_ok = document.getElementById(dialog_ok_id);
  	if (dialog && dialog_ok) {
  	  dialog_ok.addEventListener('click', () => {
        if (dialog instanceof HTMLDialogElement) {
          dialog.close();
        }
  	  });
 	  }
  }

  /**
   * Show a dialog with the dictionary definition. Expected to be called in
   * response to a user clicking on a highlighted word.
   *
   * @param {MouseEvent} event - An event triggered by a user
   * @param {Term} term - Encapsulates the Chinese and the English equivalent
   * @param {string} dialog_id - A DOM id used to find the dialog
   */
  showDialog(event: MouseEvent, term: Term, dialog_id: string) {
  	console.log(`showDialog this: ${this}`);
    const target = <HTMLElement>event.target;
  	const chinese = target.textContent;
  	const english = term.getEnglish();
    const pinyin = term.getPinyin();
  	const id = term.getHeadwordId();
  	const dialog = document.getElementById(dialog_id);
  	if (dialog) {
  	  const headword_div_id = dialog_id + '_headword';
  	  const headword_div = document.getElementById(headword_div_id);
  	  if (headword_div) {
  	    headword_div.innerHTML = chinese;
  	  }
      const pinyin_div_id = dialog_id + '_pinyin';
      const pinyin_div = document.getElementById(pinyin_div_id);
      if (pinyin_div) {
        pinyin_div.innerHTML = pinyin;
      }
  	  const english_div_id = dialog_id + '_english';
  	  const english_div = document.getElementById(english_div_id);
  	  if (english_div) {
  	    english_div.innerHTML = english;
  	  }
  	  const headword_id_div_id = dialog_id + '_headword_id';
  	  const headword_id_div = document.getElementById(headword_id_div_id);
  	  if (headword_id_div) {
  	    headword_id_div.innerHTML = id;
  	  }
      if (dialog instanceof HTMLDialogElement) {
  	    dialog.showModal();
      } else {
        console.log(`dialog is a $ { typeof dialog }`);
      }
  	} else {
  	  console.log(`showDialog ${dialog_id} not found`);
  	  alert(`chinese: ${chinese} english: ${english}, id: ${id}`);
  	}
  }
}


/** 
 * An interface for building and initializing ChineseDict objects for different
 * web application framework or no framework.
 */
export interface DictionaryBuilder {

  /**
   * Creates and initializes a ChineseDict
   */
  buildDictionary(): ChineseDict;

}


/** 
 * An implementation of the DictionaryBuilder interface for building and
 * initializing ChineseDict objects for browser apps that do not use an
 * application framework.
 */
export class PlainJSBuilder implements DictionaryBuilder {
  private filename: string;
  private dict: ChineseDict;

  /**
   * Create an empty PlainJSBuilder instance
   *
   * @param {string} filename - Name of the dictionary file
   * @param {string} selector - A DOM selector used to find the page elements
   * @param {string} dialog_id - A DOM id used to find the dialog
   * @param {string} highlight - Which terms to highlight: all | proper
   */
  constructor(filename: string,
              selector: string,
              dialog_id: string,
              highlight: 'all' | 'proper') {
    console.log('PlainJSBuilder constructor');
    this.filename = filename;
    this.dict = new ChineseDict(selector, dialog_id, highlight);
  }

  /**
   * Creates and initializes a ChineseDict, load the dictionary, and scan DOM 
   * elements matching the selector. If the highlight is empty or has value
   * 'all' then all words with dictionary entries will be highlighted. If
   * highlight is set to 'proper' then event listeners will be added for all
   * terms but only those that are proper nouns (names, places, etc) will be
   * highlighted.
   */
  buildDictionary(): ChineseDict {
    const dict = this.dict;
    if (this.filename) {
      fetch(this.filename)
        .then(function(response) {
          console.log(`PlainJSBuilder response.status: ${response.status}`);
          if(response.ok) {
            return response.json();
          }
          throw new Error('Error fetching dictionary');
        })
        .then(function(dictData) {
          dict.loadDictionary(dictData);
          dict.highlightWords(dict.selector, dict.dialog_id, dict.highlight);
        });
    }
    dict.setupDialog(dict.dialog_id);
    return this.dict;
  }

}


/** 
 * Encapsulates a text segment with information about matching dictionary entry 
 */
export class Term {
  private chinese: string;
  private headword_id: string;
  private senses: Array<WordSense>;

  /**
   * Create a Term object
   * @param {!string} chinese - Either simplified or traditional, used to look
   *                            up the term
   * @param {string} headword_id - The headword id
   * @param {WordSense} sense - A WordSense object 
   */
  constructor(chinese: string,
              headword_id: string,
              sense: WordSense) {
    this.chinese = chinese;
    this.headword_id = headword_id;
    this.senses = [sense];
  }
  /**
   * Adds a word sense
   */
  addSense(sense: WordSense): void {
    this.senses.push(sense);
  }

  /**
   * Gets the Chinese text that the term is stored and looked up by
   * @return {!string} Either simplified or traditional
   */
  getChinese() {
  	return this.chinese;
  }

  /**
   * A convenience method that flattens the English equivalents for the term
   * into a single string with a ';' delimiter
   * @return {string} English equivalents for the term
   */
  getEnglish() {
    let english = "";
    for (let sense of this.senses) {
      english += sense.getEnglish();
      english.replace('/', ', ');
      english += '; ';
    }
    if (english.length > 1) {
      return english.substring(0, english.length - 2);
    }
    return english;
  }

  /**
   * A convenience method that flattens the part of speech for the term. If
   * there is only one sense then use that for the part of speech. Otherwise,
   * return an empty string.
   * @return {string} part of speech for the term
   */
  getGrammar() {
    if (this.senses.length === 1) {
      return this.senses[0].getGrammar();
    }
    return '';
  }

  /**
   * Gets the headword_id for the term
   * @return {string} headword_id - The headword id
   */
  getHeadwordId() {
  	return this.headword_id;
  }

  /**
   * A convenience method that flattens the part of pinyin for the term. If
   * there is only one sense then use that for the part of speech. Otherwise,
   * return an empty string.
   * @return {string} Mandarin pronunciation
   */
  getPinyin() {
    if (this.senses.length === 1) {
      return this.senses[0].getPinyin();
    }
    return '';
  }
}

/**
 * Class encapsulating the sense of a Chinese word
 */
class WordSense {
  private simplified: string;
  private traditional: string;
  private pinyin: string;
  private english: string;
  private grammar: string;

  /**
   * Create a WordSense object
   * @param {!string} simplified - Simplified Chinese
   * @param {!string} traditional - Traditional Chinese
   * @param {string} pinyin - Mandarin pronunciation
   * @param {string} english - English equivalent
   * @param {string} grammar - Part of speech
   */
  constructor(chinese: string,
              traditional: string,
              pinyin: string,
              english: string,
              grammar: string) {
    this.simplified = chinese;
    this.traditional = traditional;
    this.pinyin = pinyin;
    this.english = english;
    this.grammar = grammar;
  }

  /**
   * Gets the English equivalent for the sense
   * @return {string} English equivalent for the sense
   */
  getEnglish() {
    return this.english;
  }

  /**
   * Gets the part of speech for the sense
   * @return {string} part of speech for the sense
   */
  getGrammar() {
    return this.grammar;
  }

  /**
   * Gets the Mandarin pronunciation for the sense
   * @return {string} Mandarin pronunciation
   */
  getPinyin() {
    return this.pinyin;
  }

  /**
   * Gets the simplified Chinese text for the sense
   * @return {!string} The simplified Chinese text for the sense
   */
  getSimplified() {
    return this.simplified;
  }

  /**
   * Gets the traditional Chinese for the sense
   * @return {string} traditional Chinese
   */
  getTraditional() {
    return this.traditional;
  }
}