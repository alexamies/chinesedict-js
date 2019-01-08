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
 * An interface for building and initializing DictionaryView objects for different
 * web application framework or no framework.
 */
export interface DictionaryBuilder {

  /**
   * Creates and initializes a DictionaryView
   */
  buildDictionary(): DictionaryView;

}


/** 
 * An entry in a dictionary from a specific source.
 */
export class DictionaryEntry {
  private headword: string;
  private source: DictionarySource;
  private senses: Array<WordSense>;
  private headword_id: string;

  /**
   * Construct a Dictionary object
   *
   * @param {!string} headword - The Chinese headword, simplified or traditional
   * @param {!DictionarySource} source - The dictionary containing the entry
   * @param {!Array<WordSense>} senses - An array of word senses
   */
  constructor(headword: string,
              source: DictionarySource,
              senses: Array<WordSense>,
              headword_id: string) {
    //console.log(`DictionaryEntry ${ headword }`);
    this.headword = headword;
    this.source = source;
    this.senses = senses;
    this.headword_id = headword_id;
  }

  /**
   * A convenience method that flattens the English equivalents for the term
   * into a single string with a ';' delimiter
   * @return {string} English equivalents for the term
   */
  getEnglish() {
    let english = "";
    for (let sense of this.senses) {
      let eng = sense.getEnglish();
      console.log(`getEnglish before ${ eng }`);
      const r = new RegExp(' / ', 'g');
      eng = eng.replace(r, ', ');
      english += eng + '; ';
    }
    const re = new RegExp('; $');  // remove trailing semicolon
    return english.replace(re, '');
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
  getHeadwordId(): string {
    return this.headword_id;
  }

  /**
   * A convenience method that flattens the part of pinyin for the term. Gives
   * a comma delimited list of unique values
   * @return {string} Mandarin pronunciation
   */
  getPinyin() {
    const values: Set<string> = new Set<string>();
    for (let sense of this.senses) {
      const pinyin = sense.getPinyin();
      values.add(pinyin);
    }
    let p: string = '';
    for (let val of values.values()) {
      p += val + ', ';
    }
    const re = new RegExp(', $');  // remove trailing comma
    return p.replace(re, '');
  }

  /**
   * Gets the dictionary source
   * @return {DictionarySource} the source of the dictionary
   */
  getSource(): DictionarySource {
    return this.source;
  }

}


/** 
 * The source a dictionary, including where to load it from, its name,
 * and where to find out about it.
 */
export class DictionarySource {
  filename: string;
  title: string;
  description: string;

  /**
   * Construct a Dictionary object
   *
   * @param {!string} filename - Where to load the dictionary
   * @param {!string} title - A human readable name
   * @param {!string} description - More about the dictionary
   */
  constructor(filename: string, title: string, description: string) {
    console.log(`DictionarySource ${ filename }`);
    this.filename = filename;
    this.title = title;
    this.description = description;
  }

}


/** 
 * A class for presenting Chinese words and segmenting blocks of text with one
 * or more Chinese-English dictionaries. It may highlight either all terms in
 * the text matching dictionary entries or only the proper nouns.
 */
export class DictionaryView {
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
    console.log('DictionaryView constructor');
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
      const entry = term.getEntries()[0];
  	  const chinese = term.getChinese();
  	  if (entry && entry.getHeadwordId()) {
        const grammar = entry.getGrammar();
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
    const entry = term.getEntries()[0];
    target.title = `${entry.getPinyin()} | ${entry.getEnglish()}`;
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
  loadDictionary(sources: Array<DictionarySource>, dictData: Array<Array<string>>) {
    console.log(`read ${dictData.length} dictionary entries`);
    for (let source of sources) {
      for (let entry of dictData) {
        const traditional = entry["t"];
        const sense = new WordSense(entry["s"],
                                    entry["t"],
                                    entry['p'],
                                    entry['e'],
                                    entry['g']);
        const dictEntry = new DictionaryEntry(traditional, source, [sense], entry['h']);
        if (!this.headwords.has(traditional)) {
          const term = new Term(traditional, [dictEntry]);
          this.headwords.set(traditional, term);
        } else {
          const term = this.headwords.get(traditional);
          term.addDictionaryEntry(dictEntry);
        }
      }
    }
  }

  /**
   * Look up a term in the matching the given Chinese
   */
  lookup(chinese: string): Term {
    if (this.headwords.has(chinese)) {
      return this.headwords.get(chinese);
    }
    return new Term(chinese, []);
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
          segments.push(new Term(chars, []));
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
    if (term.getEntries().length === 0) {
      return;
    }
    const entry = term.getEntries()[0];
  	const english = entry.getEnglish();
    const pinyin = entry.getPinyin();
    const source = entry.getSource().title;
  	const id = entry.getHeadwordId();
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
      const source_div_id = dialog_id + '_source';
      const source_div = document.getElementById(source_div_id);
      if (source_div) {
        source_div.innerHTML = `Source: ${ source }`;
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
 * An implementation of the DictionaryBuilder interface for building and
 * initializing DictionaryView objects for browser apps that do not use an
 * application framework.
 */
export class PlainJSBuilder implements DictionaryBuilder {
  private sources: Array<DictionarySource>;
  private dict: DictionaryView;

  /**
   * Create an empty PlainJSBuilder instance
   *
   * @param {string} source - Name of the dictionary file
   * @param {string} selector - A DOM selector used to find the page elements
   * @param {string} dialog_id - A DOM id used to find the dialog
   * @param {string} highlight - Which terms to highlight: all | proper
   */
  constructor(sources: Array<DictionarySource>,
              selector: string,
              dialog_id: string,
              highlight: 'all' | 'proper') {
    console.log('PlainJSBuilder constructor');
    this.sources = sources;
    this.dict = new DictionaryView(selector, dialog_id, highlight);
  }

  /**
   * Creates and initializes a DictionaryView, load the dictionary, and scan DOM 
   * elements matching the selector. If the highlight is empty or has value
   * 'all' then all words with dictionary entries will be highlighted. If
   * highlight is set to 'proper' then event listeners will be added for all
   * terms but only those that are proper nouns (names, places, etc) will be
   * highlighted.
   */
  buildDictionary(): DictionaryView {
    const dict = this.dict;
    const sources = this.sources;
    const filename = this.sources[0].filename
    if (filename) {
      fetch(filename)
        .then(function(response) {
          console.log(`PlainJSBuilder response.status: ${response.status}`);
          if(response.ok) {
            return response.json();
          }
          throw new Error('Error fetching dictionary');
        })
        .then(function(dictData) {
          dict.loadDictionary(sources, dictData);
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
  private entries: Array<DictionaryEntry>;

  /**
   * Create a Term object
   * @param {!string} chinese - Either simplified or traditional, used to look
   *                            up the term
   * @param {string} headword_id - The headword id
   * @param {DictionaryEntry} entries - An array of dictionary entries
   */
  constructor(chinese: string, entries: Array<DictionaryEntry>) {
    this.chinese = chinese;
    this.entries = entries;
  }

  /**
   * Adds a word sense
   */
  addDictionaryEntry(entry: DictionaryEntry): void {
    this.entries.push(entry);
  }

  /**
   * Gets the Chinese text that the term is stored and looked up by
   * @return {!string} Either simplified or traditional
   */
  getChinese(): string {
  	return this.chinese;
  }

  /**
   * Gets the dictionary entries for this term
   * @return {!Array<DictionaryEntry>} An array of entries
   */
  getEntries(): Array<DictionaryEntry> {
    return this.entries;
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