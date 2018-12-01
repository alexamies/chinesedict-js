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

// A JavaScript module that finds words in a string of Chinese text

/** The raw dictionary data */
const words = require('./words.js');

/** A class for finding Chinese words and segmenting blocks of text with a
 * Chinese-English dictionary.
 */
class ChineseDict {

  /**
   * Create a ChineseDict object, loads the dictionary
   */
  constructor() {
  	const wordArray = words();
  	const t = typeof wordArray;
  	console.log(`ChineseDict typeof words: ${t}`);
  	this.headwords = new Map();
  	for (let i = 0; i < wordArray.length; i++) {
  	  const word = wordArray[i];
  	  const traditional = word['traditional'];
      console.log(`ChineseDict traditional: ${traditional}`);
      this.headwords.set(traditional, word);
  	}
  }

  /**
   * Scans blocks of text, highlighting the words in in the dictionary with
   * links that can be clicked to find the definitions. The blocks of text
   * are identified with a DOM selector.
   * 
   * @param {string} selector - A DOM selector used to find the page elements
   */
  findwords(selector) {
    let elems = document.body.querySelectorAll(selector);
    console.log(`findwords num elems: ${elems.length}`);
    for (let i = 0; i < elems.length; i++) {
      const text = elems[i].textContent;
      let replacement = this.segment_text_(text);
      elems[i].innerHTML = replacement;
    }
  }

  /**
   * Segments the text into an array of individual words
   * @param {string} text - The text string to be segmented
   * @return {string} The replacement text
   */
  segment_text_(text) {
    let replacement = "";
    for (let j = 0; j < text.length; j++) {
      let k = text.length - j;
      while (k > 0) {
        const chars = text.substring(j, j + k);
        if (this.headwords.has(chars)) {
          console.log(`findwords found: ${chars}`);
          replacement += `<a href='#' class='headword'>${chars}</a>`;
          j += chars.length;
          break;
        }
        if (chars.length == 1) {
          replacement += chars;
        }
        k--;
      }
    }
    return replacement
  }
}

module.exports = ChineseDict;