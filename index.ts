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
  headwords;
  selector: string;
  dialog_id: string;
  highlight: 'all' | 'proper';

  /**
   * Use a DictionaryBuilder implementation rather than calling the constructor
   * directly.
   *
   * @param {string} selector - A DOM selector used to find the page elements
   * @param {string} dialog_id - A DOM id used to find the dialog
   * @param {string} highlight - Which terms to highlight: all | proper
   */
  constructor(selector: string,
              dialog_id: string,
              highlight: 'all' | 'proper') {
    console.log('ChineseDict constructor');
  	const headwords = new Map();
  	this.headwords = headwords;
    this.selector = selector;
    this.dialog_id = dialog_id;
    this.highlight = highlight;
  }

  /**
   * Decorate the segments of text
   *
   * @private
   * @param {!Element} elem - The DOM element to add the segments to
   * @param {!Array.<string>} terms - The segmented text array of terms
   * @param {string} dialog_id - A DOM id used to find the dialog
   * @param {string} highlight - Which terms to highlight: all | proper
   */
  decorate_segments_(elem, terms, dialog_id, highlight) {
    console.log(`decorate_segments_ dialog_id: ${dialog_id}, ${highlight}`);
  	elem.innerHTML = "";
  	for (let i = 0; i < terms.length; i++) {
  	  const term = terms[i];
  	  const chinese = term.get_chinese();
      const grammar = term.get_grammar();
  	  if (term.get_headword_id()) {
  	  	var link = document.createElement('a');
  	  	link.textContent = chinese;
  	  	link.href = '#';
        if ((highlight !== 'proper') || (grammar === 'proper noun')) {
          link.className = 'highlight';
        } else {
          link.className = 'nohighlight';
        }
  	  	link.addEventListener('click', (event) => {
  	  		this.showDialog(event, term, dialog_id)});
        link.addEventListener('mouseover', (event) => {
          this.domouseover_(event, term)});
  	  	elem.appendChild(link);
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
  domouseover_(event, term) {
    event.target.title = term.get_english();
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
   * @param {!Map} A map of headwords
   */
  loadDictionary(dictData, headwords) {
    console.log(`read ${dictData.length} dictionary entries`);
    for (let i = 0; i < dictData.length; i++) {
      const entry = dictData[i];
      const traditional = entry["t"];
      headwords.set(traditional, entry);
    }
  }

  /**
   * Look up a term in the matching the given Chinese
   */
  lookup(chinese: string): object {
    if (this.headwords.has(chinese)) {
      return this.headwords.get(chinese);
    }
    return {};
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
          const entry = this.headwords.get(chars);
          const term = new Term(chars, entry['h'], entry['p'], entry['e'],
                                entry['g']);
          segments.push(term);
          j += chars.length;
          break;
        }
        if (chars.length == 1) {
          segments.push(new Term(chars, '', '', '', ''));
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
        let d = dialog as any as HTMLDialogElement;
        d.close();
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
  showDialog(event, term, dialog_id) {
  	console.log(`showDialog this: ${this}`);
  	const chinese = event.target.textContent;
  	const english = term.get_english();
    const pinyin = term.get_pinyin();
  	const id = term.get_headword_id();
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
  	  console.log('showDialog showing dialog');
      let d = dialog as any as HTMLDialogElement;
  	  d.showModal();
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
 * initializing ChineseDict objects for browser scripts that do not use an
 * application framework.
 */
export class NoFrameworkBuilder implements DictionaryBuilder {
  private filename: string;
  private dict: ChineseDict;

  /**
   * Create an empty ChineseDict object. Call init() to load the dictionary
   * and scan DOM elements. If the highlight is empty or has value
   * 'all' then all words with dictionary entries will be highlighted. If
   * highlight is set to 'proper' then event listeners will be added for all
   * terms but only those that are proper nouns (names, places, etc) will be
   * highlighted.
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
    console.log('NoFrameworkBuilder constructor');
    this.filename = filename;
    this.dict = new ChineseDict(selector, dialog_id, highlight);
  }

  /**
   * Creates and initializes a ChineseDict
   */
  buildDictionary(): ChineseDict {
    const dict = this.dict;
    if (this.filename) {
      fetch(this.filename)
        .then(function(response) {
          console.log(`NoFrameworkBuilder response.status: ${response.status}`);
          if(response.ok) {
            return response.json();
          }
          throw new Error('Error fetching dictionary');
        })
        .then(function(dictData) {
          dict.loadDictionary(dictData, dict.headwords);
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
class Term {
  private chinese: string;
  private headword_id: string;
  private pinyin: string;
  private english: string;
  private grammar: string;

  /**
   * Create a Term object
   * @param {!string} chinese - The Chinese text for the term
   * @param {string} headword_id - The headword id
   * @param {string} pinyin - Mandarin pronunciation
   * @param {string} english - English equivalent
   * @param {string} grammar - Part of speech
   */
  constructor(chinese: string,
              headword_id: string,
              pinyin: string,
              english: string,
              grammar: string) {
    this.chinese = chinese;
    this.headword_id = headword_id;
    this.pinyin = pinyin;
    this.english = english;
    this.grammar = grammar;
  }

  /**
   * Gets the Chinese text for the term
   * @return {!string} The Chinese text for the term
   */
  get_chinese() {
  	return this.chinese;
  }

  /**
   * Gets the English equivalent for the term
   * @return {string} English equivalent for the term
   */
  get_english() {
    return this.english;
  }

  /**
   * Gets the part of speech for the term
   * @return {string} part of speech for the term
   */
  get_grammar() {
    return this.grammar;
  }

  /**
   * Gets the headword_id for the term
   * @return {string} headword_id - The headword id
   */
  get_headword_id() {
  	return this.headword_id;
  }

  /**
   * Gets the Mandarin pronunciation for the term
   * @return {string} Mandarin pronunciation
   */
  get_pinyin() {
    return this.pinyin;
  }
}
