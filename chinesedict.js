/**
 *  @license
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
 * A JavaScript module that finds words in a string of Chinese text
 */

/** 
 * A class for finding Chinese words and segmenting blocks of text with a
 * Chinese-English dictionary.
 */
class ChineseDict {

  /**
   * Create a ChineseDict object, loads the dictionary
   * @param {string} filename - Name of the dictionary file
   * @param {string} selector - A DOM selector used to find the page elements
   */
  constructor(filename, selector) {
  	const headwords = new Map();
  	this.headwords = headwords;
  	const dict = this;
  	if (filename) {
      fetch(filename)
        .then(function(response) {
          return response.json();
        })
        .then(function(words) {
  	      console.log(`ChineseDict words.length: ${words.length}`);
  	      for (let i = 0; i < words.length; i++) {
  	  	    const word = words[i];
  	        const traditional = word['traditional'];
            console.log(`ChineseDict traditional: ${traditional}`);
            headwords.set(traditional, word);
  	      }
  	      dict.findwords_(selector);
  	    });
    }
  }

  /**
   * Decorate the segments of text
   * @private
   * @param {Array.<string>} The segmented text array of terms
   * @return {string} text - The decorate text
   */
  decorate_segments_(terms) {
  	let decorated = '';
  	for (let i = 0; i < terms.length; i++) {
  	  const term = terms[i];
  	  let chinese = term.get_chinese();
  	  if (term.get_headword_id()) {
  		decorated += `<a href='#' class='headword'>${chinese}</a>`;
  	  } else {
        decorated += chinese;
  	  }
  	}
  	return decorated
  }

  /**
   * Scans blocks of text, highlighting the words in in the dictionary with
   * links that can be clicked to find the definitions. The blocks of text
   * are identified with a DOM selector.
   *
   * @private
   * @param {string} selector - A DOM selector used to find the page elements
   */
  findwords_(selector) {
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
      let segments = this.segment_text_(text);
      let replacement = this.decorate_segments_(segments);
      elems[i].innerHTML = replacement;
    }
  }

  /**
   * Segments the text into an array of individual words
   * @private
   * @param {string} text - The text string to be segmented
   * @return {Array.<Term>} The segmented text as an array of terms
   */
  segment_text_(text) {
  	if (!text) {
  	  console.log('segment_text_ empty text');
  	  return '';
  	}
    let segments = [];
    for (let j = 0; j < text.length; j++) {
      let k = text.length - j;
      while (k > 0) {
        const chars = text.substring(j, j + k);
        if (this.headwords.has(chars)) {
          console.log(`findwords found: ${chars}`);
          const entry = this.headwords.get(chars);
          const term = new Term(chars, entry['headword_id'], entry['english']);
          segments.push(term);
          j += chars.length;
          break;
        }
        if (chars.length == 1) {
          segments.push(new Term(chars));
        }
        k--;
      }
    }
    return segments;
  }
}

/** 
 * Encapsulates a text segment with information about matching dictionary entry 
 */
class Term {

  /**
   * Create a Term object
   * @param {!string} chinese - The Chinese text for the term
   * @param {number} headword_id - The headword id, if there is a match
   * @param {Array<string>} english - English equivalents, if there is a match
   */
  constructor(chinese, headword_id, english) {
  	this.chinese = chinese;
  	if (headword_id) {
  	  this.headword_id = headword_id;
  	}
  	if (english) {
  	  this.english = english;
  	} 	
  }

  /**
   * Gets the Chinese text for the term
   * @return {!string} The Chinese text for the term
   */
  get_chinese() {
  	return this.chinese;
  }

  /**
   * Gets the headword_id for the term
   * @return {number} headword_id - The headword id, if there is a match
   */
  get_headword_id() {
  	return this.headword_id;
  }

  /**
   * Gets the headword_id for the term
   * @return {Array<string>} english - English equivalents, if there is a match
   */
  get_english() {
  	return this.english;
  }

}


module.exports = ChineseDict;