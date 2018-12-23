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
 * A JavaScript module that finds words in a string of Chinese text
 */

declare var fetch;
declare var dialogPolyfill;

/** 
 * A class for finding Chinese words and segmenting blocks of text with a
 * Chinese-English dictionary.
 */
export class ChineseDict {
  headwords;

  /**
   * Create a ChineseDict object, loads the dictionary. Scans the text in the
   * DOM elements matching the selector. If the highlight is empty or has value
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
  constructor(filename, selector, dialog_id, highlight) {
    console.log('ChineseDict constructor');
  	const headwords = new Map();
  	this.headwords = headwords;
  	const dict = this;
  	if (filename) {
      fetch(filename)
        .then(function(response) {
          console.log(`ChineseDict response.status: ${response.status}`);
          if(response.ok) {
            return response.json();
          }
          throw new Error('Error fetching dictionary');
        })
        .then(function(dictData) {
          dict.load_dictionary_(dictData, headwords);
  	      dict.highlight_words_(selector, dialog_id, highlight);
  	    });
    }
    this.setup_dialog_(dialog_id);
  }

  /**
   * Decorate the segments of text
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
  	  		this.showdialog_(event, term, dialog_id)});
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
   * Respond to a mouse over event for a dictionary term
   * @private
   * @param {MouseEvent} event - An event triggered by a user
   * @param {Term} term - Encapsulates the Chinese and the English equivalent
   */
  domouseover_(event, term) {
    event.target.title = term.get_english();
  }

  /**
   * Scans blocks of text, highlighting the words in in the dictionary with
   * links that can be clicked to find the definitions. The blocks of text
   * are identified with a DOM selector.
   *
   * @private
   * @param {string} selector - A DOM selector used to find the page elements
   * @param {string} dialog_id - A DOM id used to find the dialog
   * @param {string} highlight - Which terms to highlight: all | proper
   */
  highlight_words_(selector, dialog_id, highlight) {
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
   * Deserializes the dictionary from protobuf format.
   *
   * @private
   * @param {!Array.<Array.<String>>} dictData - An array of dictionary terms
   * @param {!Map} A map of headwords
   */
  load_dictionary_(dictData, headwords) {
    console.log(`read ${dictData.length} dictionary entries`);
    for (let i = 0; i < dictData.length; i++) {
      const entry = dictData[i];
      const traditional = entry["t"];
      headwords.set(traditional, entry);
    }
  }

  /**
   * Segments the text into an array of individual words
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
   * of the dialog with '_ok' appended.
   * @private
   * @param {string} dialog_id - The DOM id of the dialog HTML element
   */
  setup_dialog_(dialog_id) {
  	const dialog = document.getElementById(dialog_id);
    if (typeof dialogPolyfill !== 'undefined') {
      dialogPolyfill.registerDialog(dialog);
    }
  	const dialog_ok_id = dialog_id + '_ok';
  	const dialog_ok = document.getElementById(dialog_ok_id);
  	if (dialog && dialog_ok) {
  	  dialog_ok.addEventListener('click', () => {
  	    dialog.close();
  	  });
 	  }
  }

  /**
   * Show a dialog with the dictionary definition
   * @private
   * @param {MouseEvent} event - An event triggered by a user
   * @param {Term} term - Encapsulates the Chinese and the English equivalent
   * @param {string} dialog_id - A DOM id used to find the dialog
   */
  showdialog_(event, term, dialog_id) {
  	console.log(`showdialog_ this: ${this}`);
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
  	  console.log('showdialog_ showing dialog');
  	  dialog.showModal();
  	} else {
  	  console.log(`showdialog_ ${dialog_id} not found`);
  	  alert(`chinese: ${chinese} english: ${english}, id: ${id}`);
  	}
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
