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

import { fromEvent, Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';

/**
 * A module that encapsulates a Chinese-English dictionary, including finding
 * words in sections of Chinese text.
 */

// Dependencies, including Browser implementation of fetch and dialogPolyfill
// pollyfill for HTMLDialogElement
declare var dialogPolyfill: DialogPolyfill;
declare global {
  interface DialogPolyfill {
    registerDialog(dialog: HTMLDialogElement): void;
  }
}
declare global {
  interface HTMLDialogElement {
      close(): void;
      showModal(): void;
  }
}


/** 
 * An implementation of the DictionaryBuilder interface for building and
 * initializing a basic DictionaryView object with a textfield input to read
 * values and a list for displaying matching terms.
 */
export class BasicDictionaryBuilder implements DictionaryBuilder {
  private sources: Array<DictionarySource>;
  private config: DictionaryViewConfig;
  private view: DictionaryView;
  private dictionaries: DictionaryCollection;

  /**
   * Create an empty BasicDictionaryBuilder instance with given sources and
   * configuration.
   *
   * @param {!Array<DictionarySource>} source - Name of the dictionary file
   * @param {!DictionaryViewConfig} config - Configuration of the view to build
   */
  constructor(sources: Array<DictionarySource>,
              config: DictionaryViewConfig) {
    console.log('BasicDictionaryBuilder constructor');
    this.sources = sources;
    this.config = config;
    this.dictionaries = new DictionaryCollection();
    this.view = new DictionaryView("", "", "", config, this.dictionaries);
  }

  /**
   * Creates and initializes a DictionaryView, load the dictionary, and
   * initialize the DictionaryView.
   */
  buildDictionary() {
    console.log('BasicDictionaryBuilder.buildDictionary enter');
    this.view.wire();
    const loader = new DictionaryLoader(this.sources, this.dictionaries);
    const observable = loader.loadDictionaries();
    observable.subscribe(
      val => { console.log('BasicDictionaryBuilder.buildDictionary ' + val); },
      err => {
        console.error('BasicDictionaryBuilder.buildDictionary ' + err);
      },
      () => { 
        console.log('BasicDictionaryBuilder.buildDictionary done');
       }
    );
    return this.view;
  }
}


/** 
 * An interface for building and initializing DictionaryView objects for
 * different presentations.
 */
export interface DictionaryBuilder {

  /**
   * Creates and initializes a DictionaryView
   */
  buildDictionary(): DictionaryView;

}


/** 
 * A dictionary collection represents one or more dictionary sources, indexed by
 * a set of headwords and loaded from a set of JSON files. The set of headwords
 * is empty until the dictionary is loaded.
 */
export class DictionaryCollection {
  private headwords: Map<string, Term>;
  private loaded: boolean;

  /**
   * Construct a DictionaryCollection instance
   */
  constructor() {
    this.headwords = new Map<string, Term>();
    this.loaded = false;
  }

  /**
   * Checks for the presence of a headword in the DictionaryCollection.
   *
   * @param {!string} headword - Simplified or traditional Chinese
   */
  has(headword: string): boolean {
    return this.headwords.has(headword);
  } 

  /**
   * True is the dictionary is loaded. The lookup method will return
   * non-trivial terms after that.
   */
  isLoaded(): boolean {
    console.log(`DictionaryCollection.isLoaded ${ this.loaded }`);
    return this.loaded;
  }   

  /**
   * Looks up a headword in the DictionaryCollection. If the headword is not
   * present then return a Term object populated with the headword but with an
   * empty body.
   *
   * @param {!string} headword - Simplified or traditional Chinese
   * @return {!Term} A non-null term
   */
  lookup(headword: string): Term {
    const term = this.headwords.get(headword);
    if (term) {
      return term;
    } else {
      return new Term(headword, []);
    }
  } 

  /**
   * Sets the map of headwords, also indicating that the dictionary collection
   * is loaded.
   *
   * @param {!Map<string, Term>} headwords - indexing the dictionary collection
   */
  setHeadwords(headwords: Map<string, Term>) {
    console.log("DictionaryCollection.setHeadwords enter");
    this.headwords = headwords;
    this.loaded = true;
  } 
}

/** 
 * An entry in a dictionary from a specific source.
 */
export class DictionaryEntry {
  private headword: string;
  private source: DictionarySource;
  private senses: Array<WordSense>;
  private headwordId: string;

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
              headwordId: string) {
    //console.log(`DictionaryEntry ${ headword }`);
    this.headword = headword;
    this.source = source;
    this.senses = senses;
    this.headwordId = headwordId;
  }

  /**
   * A convenience method that flattens the English equivalents for the term
   * into a single string with a ';' delimiter
   * @return {string} English equivalents for the term
   */
  addWordSense(ws: WordSense) {
    this.senses.push(ws);
  }

  /**
   * Get the Chinese, including the traditional form in Chinese brackets （）
   * after the simplified, if it differs.
   * @return {string} The Chinese text for teh headword
   */
  getChinese() {
    const s = this.getSimplified();
    const t = this.getTraditional();
    let chinese = s;
    if (s != t) {
      chinese = `${ s }（${ t }）`;
    }
    return chinese;
  }

  /**
   * A convenience method that flattens the English equivalents for the term
   * into a single string with a ';' delimiter
   * @return {string} English equivalents for the term
   */
  getEnglish() {
    const r1 = new RegExp(' / ', 'g');
    const r2 = new RegExp('/', 'g');
    let english = "";
    for (let sense of this.senses) {
      let eng = sense.getEnglish();
      //console.log(`getEnglish before ${ eng }`);
      eng = eng.replace(r1, ', ');
      eng = eng.replace(r2, ', ');
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
    return this.headwordId;
  }

  /**
   * A convenience method that flattens the pinyin for the term. Gives
   * a comma delimited list of unique values
   * @return {string} Mandarin pronunciation
   */
  getPinyin() {
    const values: Set<string> = new Set<string>();
    for (let sense of this.senses) {
      const pinyin = sense.getPinyin();
      values.add(pinyin);
    }
    let p = '';
    for (let val of values.values()) {
      p += val + ', ';
    }
    const re = new RegExp(', $');  // remove trailing comma
    return p.replace(re, '');
  }

  /**
   * Gets the word senses
   * @return {Array<WordSense>} an array of WordSense objects
   */
  getSenses() {
    return this.senses;
  }

  /**
   * A convenience method that flattens the simplified Chinese for the term.
   * Gives a Chinese comma (、) delimited list of unique values
   * @return {string} Simplified Chinese
   */
  getSimplified() {
    const values: Set<string> = new Set<string>();
    for (let sense of this.senses) {
      const simplified = sense.getSimplified();
      values.add(simplified);
    }
    let p = '';
    for (let val of values.values()) {
      p += val + '、';
    }
    const re = new RegExp('、$');  // remove trailing comma
    return p.replace(re, '');
  }

  /**
   * Gets the dictionary source
   * @return {DictionarySource} the source of the dictionary
   */
  getSource(): DictionarySource {
    return this.source;
  }

  /**
   * A convenience method that flattens the traditional Chinese for the term.
   * Gives a Chinese comma (、) delimited list of unique values
   * @return {string} Traditional Chinese
   */
  getTraditional() {
    const values: Set<string> = new Set<string>();
    for (let sense of this.senses) {
      const trad = sense.getTraditional();
      values.add(trad);
    }
    let p = '';
    for (let val of values.values()) {
      p += val + '、';
    }
    const re = new RegExp('、$');  // remove trailing comma
    return p.replace(re, '');
  }
}


/** 
 * Loads the dictionaries from source files.
 */
export class DictionaryLoader {
  private sources: Array<DictionarySource>;
  private headwords: Map<string, Term>;
  private dictionaries: DictionaryCollection;

  /**
   * Create an empty PlainJSBuilder instance
   *
   * @param {string} sources - Names of the dictionary files
   * @param {DictionaryCollection} dictionaries - To load the data into
   */
  constructor(sources: Array<DictionarySource>,
              dictionaries: DictionaryCollection) {
    console.log('DictionaryLoader constructor');
    this.sources = sources;
    this.headwords = new Map<string, Term>();
    this.dictionaries = dictionaries;
  }

  /**
   * Returns an Observable that will complete on loading all the dictionaries
   */
  loadDictionaries() {
    console.log('loadDictionaries enter');
    const observable = new Observable(subscriber => {
      const sources = this.sources;
      let numLoaded = 0;
      for (const source of sources) {
        const filename = source.filename;
        console.log(`loadDictionaries loading ${ filename }`);
        if (filename) {
          const reqObs = ajax.getJSON(filename);
          const subscribe = reqObs.subscribe(
            res => {
              console.log(`loadDictionaries: for ${ filename }`);
              this.load_dictionary_(source, <Array<JSONDictEntry>>res);
              numLoaded++;
              subscriber.next(numLoaded);
              if (numLoaded >= sources.length) {
                console.log(`loadDictionaries: ${ this.headwords.size } terms`);
                this.dictionaries.setHeadwords(this.headwords);
                subscriber.complete();
              }
            },
            error => {
              console.log(`Error fetching dictionary: ${ error }`);
              subscriber.next(error);
              return of(error);
            }
          );
        } else {
          subscriber.next('Error no filename provided');
        }
      }
    });
    return observable;
  }

  /**
   * @private
   * Deserializes the dictionary from protobuf format. Expected to be called by
   * a builder in initializing the dictionary.
   *
   * @param {!Array<object>} dictData - An array of dictionary term objects
   */
  private load_dictionary_(source: DictionarySource, dictData: Array<JSONDictEntry>) {
    console.log(`load_dictionary_ terms from ${ source.title }`);
    for (const entry of dictData) {
      const traditional = entry["t"];
      const sense = new WordSense(entry["s"],
                                  entry["t"],
                                  entry["p"],
                                  entry["e"],
                                  entry["g"],
                                  entry["n"]);
      const dictEntry = new DictionaryEntry(traditional, source, [sense],
                                            entry["h"]);
      if (!this.headwords.has(traditional)) {
        // console.log(`Loading ${ traditional } from ${ source.title } `);
        const term = new Term(traditional, [dictEntry]);
        this.headwords.set(traditional, term);
      } else {
        // console.log(`Adding ${ traditional } from ${ source.title } `);
        const term = this.headwords.get(traditional);
        term!.addDictionaryEntry(sense, dictEntry);
      }
    }
  }
}


/** 
 * The source of a dictionary, including where to load it from, its name,
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
  private dictionaries: DictionaryCollection;
  private selector: string;
  private dialog_id: string;
  private highlight: 'all' | 'proper' | '';
  private dialog: HTMLDialogElement | null;
  private dialogContainerEl: Element | null;
  private headwordEl: Element | null;
  private config: DictionaryViewConfig;

  /**
   * Use a DictionaryBuilder implementation rather than calling the constructor
   * directly.
   *
   * @param {string} selector - A DOM selector used to find the page elements
   * @param {string} dialog_id - A DOM id used to find the dialog
   * @param {string} highlight - Which terms to highlight: all | proper | ''
   * @param {!DictionaryViewConfig} config - Configuration of the view to build
   * @return {!DictionaryCollection} dictionaries - As a holder before loading
   */
  constructor(selector: string,
              dialog_id: string,
              highlight: 'all' | 'proper' | '',
              config: DictionaryViewConfig,
              dictionaries: DictionaryCollection) {
    console.log('DictionaryView constructor');
  	this.dictionaries = dictionaries;
    this.selector = selector;
    this.dialog_id = dialog_id;
    this.highlight = highlight;
    this.dialog = <HTMLDialogElement | null>document.getElementById(this.dialog_id);
    const containerId= this.dialog_id +'_container';
    this.dialogContainerEl = <Element | null>document.getElementById(containerId);
    const headwordId= this.dialog_id +'_headword';
    this.headwordEl = <Element | null>document.getElementById(headwordId);
    this.config = config;
  }

  /**
   * Add a dictionary entry to the dialog
   *
   * @param {string} chinese - the Chinese text
   * @param {DictionaryEntry} entry - the word data to add to the dialog
   */
  private addDictEntryToDialog(chinese: string, entry: DictionaryEntry) {
    const containerEl = document.createElement('div');
    const pinyinEl = document.createElement('span');
    pinyinEl.className = 'dict-dialog_pinyin';
    pinyinEl.innerHTML = entry.getPinyin();
    containerEl.appendChild(pinyinEl);
    const englishEl = document.createElement('span');
    englishEl.className = 'dict-dialog_english';
    englishEl.innerHTML = entry.getEnglish();
    containerEl.appendChild(englishEl);
    if (entry.getHeadwordId()) {
      const headwordIdEl = document.createElement('span');
      headwordIdEl.className = 'dict-dialog_headword_id';
      headwordIdEl.innerHTML = entry.getHeadwordId();
      containerEl.appendChild(headwordIdEl);
    }
    const sourceEl = document.createElement('span');
    sourceEl.innerHTML = `Source: ${ entry.getSource().title } <br/>
      ${ entry.getSource().description }`;
    containerEl.appendChild(sourceEl);
    this.addPartsToDialog(chinese, containerEl);
    this.dialogContainerEl!.appendChild(containerEl);
  }  

  /**
   * Add parts of a Chinese string to the dialog
   *
   * @param {string} chinese - the Chinese text
   * @param {HTMLDivElement} containerEl - to display the parts in
   */
  private addPartsToDialog(chinese: string, containerEl: HTMLDivElement) {
    console.log(`addPartsToDialog enter ${chinese}`);
    const partsEl = document.createElement('div');
    const partsTitleEl = document.createElement('h5');
    partsTitleEl.innerHTML = `Characters`;
    partsEl.appendChild(partsTitleEl);
    let numAdded = 0;
    for (let i = 0; i < chinese.length; i++) {
      const cPart = chinese[i];
      if (this.dictionaries.has(cPart)) {
        numAdded++;
        const partTerm = this.dictionaries.lookup(chinese[i]);
        let eng = "";
        for (const entry of partTerm!.getEntries()) {
          eng += entry.getEnglish() + " ";
        }
        const partsBodyEl = document.createElement('div');
        partsBodyEl.innerHTML = `${cPart}: ${eng}`;
        partsEl.appendChild(partsBodyEl);
      }
    }
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
   * @param {string} dialog_id - A DOM id used to find the dialog
   * @param {string} highlight - Which terms to highlight: all | proper | ''
   */
  private decorate_segments_(elem: Element,
                     terms: Array<Term>,
                     dialog_id: string,
                     highlight: 'all' | 'proper' | '') {
    console.log(`decorate_segments_ dialog_id: ${dialog_id}, ${highlight}`);
  	elem.innerHTML = "";
  	for (let term of terms) {
      const entry = term.getEntries()[0];
  	  const chinese = term.getChinese();
  	  if (entry && entry.getEnglish()) {
        //console.log(`decorate_segments_ chinese: ${chinese}`);
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
   */
  highlightWords() {
    console.log('highlightWords: enter');
  	if (!this.selector) {
      console.log('highlightWords: selector empty');
      return;
  	}
    let elems = document.querySelectorAll(this.selector);
    if (!elems) {
      console.log(`findwords: no elements matching ${this.selector}`);
      return;
    }
    console.log(`highlightWords: ${ elems.length } elems`);
    elems.forEach((el) => {
      const text = el.textContent;
      //console.log(`highlightWords: ${ text }`);
      if (text) {
        const terms = this.segment_text_(text);
        this.decorate_segments_(el, terms, this.dialog_id, this.highlight);
      } else {
        console.log(`highlightWords: text is empty or null`);
      }
    });
  }

  /**
   * Whether the dictionary sources have been loaded
   */
  isLoaded(): boolean {
    return this.dictionaries.isLoaded();
  }

  /**
   * Look up a term in the matching the given Chinese
   */
  lookup(chinese: string): Term {
    return this.dictionaries.lookup(chinese);
  }

  /**
   * Segments the text into an array of individual words
   * 
   * @private
   * @param {string} text - The text string to be segmented
   * @return {Array.<Term>} The segmented text as an array of terms
   */
  private segment_text_(text: string): Array<Term> {
    const parser = new TextParser(this.dictionaries);
    return parser.segmentText(text);
  }

  /**
   * Sets the collection of dictionaries to use in the dictionary view.
   * 
   * @param {!DictionaryCollection} The collection of dictionaries
   */
  setDictionaryCollection(dictionaries: DictionaryCollection) {
    console.log("setDictionaryCollection enter");
    this.dictionaries = dictionaries;
  }

  /**
   * Add a listener to the dialog OK button. The OK button should have the ID
   * of the dialog with '_ok' appended. Expected to be called by a builder in
   * initializing the dictionary.
   */
  setupDialog() {
  	const dialogOkId = this.dialog_id + '_ok';
  	let dialogOk = document.getElementById(dialogOkId);
    if (!this.dialog) {
      console.log(`setupDialog ${ this.dialog_id } not found, creating`);
      this.dialog = document.createElement('dialog');
      this.headwordEl = document.createElement('p');
      this.dialog.appendChild(this.headwordEl);
      this.dialogContainerEl = document.createElement('div');
      this.dialog.appendChild(this.dialogContainerEl);
      dialogOk = document.createElement('button');
      dialogOk.innerText = 'OK';
      dialogOk.className = 'dialog_ok';
      this.dialog.appendChild(dialogOk);
      document.body.appendChild(this.dialog);
    }
    if (this.dialog instanceof HTMLDialogElement) {
      if (typeof dialogPolyfill !== 'undefined') {
        dialogPolyfill.registerDialog(this.dialog);
      }
    } else {
      console.log(`dialog is typeof ${ typeof this.dialog }`);
    }
  	dialogOk!.addEventListener('click', () => {
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
   * @param {string} dialog_id - A DOM id used to find the dialog
   */
  showDialog(event: MouseEvent, term: Term, dialog_id: string) {
    const target = <HTMLElement>event.target;
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
    //console.log(`showDialog got: ${ term.getEntries().length } entries`);
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
    console.log('DictionaryView.init enter');
    if (this.config.isWithLookupInput()) {
      const viewLookup = new DictionaryViewLookup(this.config,
                                                  this.dictionaries);
      const resultsView = this.config.getQueryResultsSubscriber();
      viewLookup.wire()
      .subscribe(
        value => {
          const qResults = <QueryResults>value;
          if (!qResults) {
            resultsView.error("DictionaryView no results found");
          } else {
            resultsView.next(qResults);
          }
        },
        err => { resultsView.error(`Initialization error: ${ err }`); }
      );
    }
  }  
}


/** 
 * A class for configuring the DictionaryView, intended as input to a
 * DictionaryBuilder factory.
 */
export class DictionaryViewConfig {
  private withLookupInput: boolean;
  private rSubscriber: QueryResultsSubscriber;

  /**
   * Creates a DictionaryViewConfig object with default values: 
   * lookupInputFormId: 'lookup_input_form', lookupInputTFId: 'lookup_input',
   * withLookupInput: true.
   */
  constructor() {
    this.withLookupInput = true;
    this.rSubscriber = new QueryResultsView();
  }

  /**
   * Get the subscriber to push new query results to
   *
   * @return {QueryResultsSubscriber} to push results to
   */
  getQueryResultsSubscriber(): QueryResultsSubscriber {
    return this.rSubscriber;
  }

  /**
   * Set the subscriber to push new query results to
   *
   * @param {!QueryResultsSubscriber} rSubscriber - to push results to
   * @return {DictionaryViewConfig} this object so that calls can be chained
   */
  setQueryResultsSubscriber(rSubscriber: QueryResultsSubscriber): DictionaryViewConfig {
    this.rSubscriber = rSubscriber;
    return this;
  }

  /**
   * If withLookupInput is true then the DictionaryView will listen for events
   * on the given HTML form and lookup and display dictionary terms in response.
   *
   * @return {!boolean} Whether to use a textfield for looking up terms
   */
  isWithLookupInput(): boolean {
    return this.withLookupInput;
  }

  /**
   * If withLookupInput is true then the DictionaryView will listen for events
   * on the given HTML form and lookup and display dictionary terms in response.
   *
   * @param {!boolean} withLookupInput - Whether to use a textfield for looking
   *                                     up terms
   * @return {DictionaryViewConfig} this object so that calls can be chained
   */
  setWithLookupInput(withLookupInput: boolean): DictionaryViewConfig {
    this.withLookupInput = withLookupInput;
    return this;
  }

}


/** 
 * A class for encapsulating view elements for looking up dictionary terms.
 * Fixed values are used for field ids: 
 * lookupInputFormId: 'lookup_input_form', lookupInputTFId: 'lookup_input'.
 */
class DictionaryViewLookup {
  private readonly lookupInputFormId = "lookup_input_form";
  private readonly lookupInputTFId = "lookup_input";
  private config: DictionaryViewConfig;
  private dictionaries: DictionaryCollection;

  /**
   * Creates a DictionaryViewLookup object with given config values.
   *
   * @param {!DictionaryViewConfig} config - Configuration values
   * @param {!DictionaryCollection} dictionaries - holds the dictionary data
   */
  constructor(config: DictionaryViewConfig,
              dictionaries: DictionaryCollection) {
    this.config = config;
    this.dictionaries = dictionaries;
  }

  /**
   * Initialize the input form to listen for submit events
   */
  wire() {
    console.log("DictionaryViewLookup.init");
    const formSelector = "#" + this.lookupInputFormId;
    const form = document.querySelector(formSelector);
    const inputSelector = "#" + this.lookupInputTFId;
    const input = <HTMLInputElement>document.querySelector(inputSelector);
    const observable = new Observable(subscriber => {
      if (form) {
        fromEvent(form, "submit")
        .subscribe(evt => {
          evt.preventDefault();
          console.log("DictionaryViewLookup got a submit event");
          if (!this.dictionaries.isLoaded()) {
            subscriber.error("Dictionary is not loaded");
          } else {
            const parser = new TextParser(this.dictionaries);
            const terms = parser.segmentText(input.value);
            const qResults = new QueryResults(input.value, terms);
            subscriber.next(qResults);
          }
          return false;
        });
      } else {
        console.log("DictionaryViewLookup.init form not found");
        subscriber.complete();
      }
    });
    return observable;
  }
}


// Interface for JSON data loaded into dictionary
interface JSONDictEntry {
  s: string // simplified
  t: string // traditional
  p: string // Pinyin
  e: string // English
  g: string // grammar
  n: string // notes
  h: string // headword id
}


/** 
 * An implementation of the DictionaryBuilder interface for building and
 * initializing DictionaryView objects for browser apps that do not use an
 * application framework. The DictionaryView created will scan designated text
 * and set up events to show a dialog for all vocabulary discovered.
 */
export class PlainJSBuilder implements DictionaryBuilder {
  private view: DictionaryView;
  private loader: DictionaryLoader;

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
    const dictionaries = new DictionaryCollection();
    this.loader = new DictionaryLoader(sources, dictionaries);
    const config = new DictionaryViewConfig().setWithLookupInput(false);
    this.view = new DictionaryView(selector,
                                   dialog_id,
                                   highlight,
                                   config,
                                   dictionaries);
  }

  /**
   * Creates and initializes a DictionaryView, load the dictionary, and scan DOM 
   * elements matching the selector. If the highlight is empty or has value
   * 'all' then all words with dictionary entries will be highlighted. If
   * highlight is set to 'proper' then event listeners will be added for all
   * terms but only those that are proper nouns (names, places, etc) will be
   * highlighted. Subscribe to the Observable and get the DictionaryView when
   * it is complete.
   */
  buildDictionary() {
    console.log('buildDictionary enter');
    const observable = this.loader.loadDictionaries();
    observable.subscribe(
      val => { console.log('buildDictionary next ' + val); },
      err => { console.error('buildDictionary error: ' + err); },
      () => { 
        console.log('buildDictionary done');
        this.view.highlightWords();
        this.view.setupDialog();
       }
    );
    return this.view;
  }
}



/** 
 * Wraps results from a dictionary query.
 */
export class QueryResults {
  query: string;
  results: Array<Term>;

  /**
   * Construct a QueryResults object
   *
   * @param {!string} query - The query leading to the results
   * @param {!Array<Term>} results - The results found
   */
  constructor(query: string, results: Array<Term>) {
    this.query = query;
    this.results = results;
  }
}


/** 
 * An interface for subscribing to query results that might consist of
 * multiple terms.
 */
export interface QueryResultsSubscriber {

  /**
   * Respond to an error
   *
   * @param {!string} message - an error message
   */
  error(message: string): void;

  /**
   * Respond to newly available results
   *
   * @param {!QueryResults} dictionaries - holds the query results
   */
  next(results: QueryResults): void;
}


/** 
 * A class for displaying dictionary query results that might consist of
 * multiple terms. Fixed values of field ids are used: 
 * queryResultsDiv: 'query_results_div',
 * queryResultsHeader: 'query_results_header', 
 * queryMessageDiv: 'query_message_div'
 * queryResultsList: 'query_results_list',
 */
class QueryResultsView implements QueryResultsSubscriber {
  private queryResultsDiv: HTMLElement;
  private queryResultsHeader: HTMLElement;
  private queryMessageDiv: HTMLElement;
  private queryResultsList: HTMLElement;

  /**
   * Create a QueryResultsView object
   */
  constructor() {
    this.queryResultsDiv = <HTMLElement>document.getElementById("query_results_div");
    this.queryResultsHeader = <HTMLElement>document.getElementById("query_results_header");
    this.queryMessageDiv = <HTMLElement>document.getElementById("query_message_div");
    this.queryResultsList = <HTMLElement>document.getElementById("query_results_list");
  }

  /**
   * Respond to an error
   *
   * @param {!string} message - an error message
   */
  error(message: string) {
    console.log("QueryResultsView.error enter");
    this.queryResultsHeader.style.display = "none";
    while (this.queryResultsList.firstChild) {
      this.queryResultsList.removeChild(this.queryResultsList.firstChild);
    }
    this.queryMessageDiv.innerHTML = message;
  }

  /**
   * Shows the results
   *
   * @param {!QueryResults} dictionaries - holds the query results
   */
  next(qResults: QueryResults) {
    console.log("QueryResultsView.next enter");
    this.queryResultsHeader.style.display = "block";
    while (this.queryResultsList.firstChild) {
      this.queryResultsList.removeChild(this.queryResultsList.firstChild);
    }
    const r = qResults.results;
    const msg = `${ r.length } terms found for query ${ qResults.query }`;
    this.queryMessageDiv.innerHTML = msg;

    const tList = document.createElement("ul");
    r.forEach( term => {
      const entries = term.getEntries();
      const cn = entries[0].getChinese();
      const pinyin = entries[0].getPinyin();
      const en = entries[0].getEnglish();
      const li = document.createElement("li");
      const txt = `${ cn } ${ pinyin } - ${ en }`;
      const tNode = document.createTextNode(txt);
      li.appendChild(tNode);
      tList.appendChild(li);
    });
    this.queryResultsList.appendChild(tList);
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
  addDictionaryEntry(ws: WordSense, entry: DictionaryEntry): void {
    for (const e of this.entries) {
      if (e.getSource().title === entry.getSource().title) {
        e.addWordSense(ws);
        return;
      }
    }
    this.entries.push(entry);
  }

  /**
   * Gets the Chinese text that the term is stored and looked up by
   * 
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
 * Utility for segmenting text into individual terms.
 */
export class TextParser {
  private dictionaries: DictionaryCollection;

  /**
   * Construct a Dictionary object
   *
   * @param {!DictionaryCollection} dictionaries - a collection of dictionary
   */
  constructor(dictionaries: DictionaryCollection) {
    this.dictionaries = dictionaries;
  }

  /**
   * Segments the text into an array of individual words, excluding the whole
   * text given as a parameter
   * 
   * @param {string} text - The text string to be segmented
   * @return {Array.<Term>} The segmented text as an array of terms
   */
  segmentExludeWhole(text: string): Array<Term> {
    if (!text) {
      console.log('segmentExludeWhole empty text');
      return [];
    }
    const segments: Array<Term> = [];
    let j = 0;
    while (j < text.length) {
      let k = text.length - j;
      while (k > 0) {
        const chars = text.substring(j, j + k);
        //console.log(`segmentExludeWhole checking: ${chars} for j ${j}, k ${k}`);
        if (chars.length < text.length && this.dictionaries.has(chars)) {
          //console.log(`segmentExludeWhole found: ${chars} for j ${j}, k ${k}`);
          const term = this.dictionaries.lookup(chars);
          segments.push(term);
          j += chars.length;
          break;
        }
        if (chars.length == 1) {
          if (this.dictionaries.has(chars)) {
            const t = this.dictionaries.lookup(chars);
            segments.push(t);
          } else {
            segments.push(new Term(chars, []));
          }
          j++;
        }
        k--;
      }
    }
    return segments;
  }

  /**
   * Segments the text into an array of individual words
   * 
   * @param {string} text - The text string to be segmented
   * @return {Array.<Term>} The segmented text as an array of terms
   */
  segmentText(text: string): Array<Term> {
    if (!text) {
      console.log('segment_text_ empty text');
      return [];
    }
    const segments: Array<Term> = [];
    let j = 0;
    while (j < text.length) {
      let k = text.length - j;
      while (k > 0) {
        const chars = text.substring(j, j + k);
        if (this.dictionaries.has(chars)) {
          //console.log(`findwords found: ${chars} for j ${j}, k ${k}`);
          const term = this.dictionaries.lookup(chars);
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
}


/**
 * Class encapsulating the sense of a Chinese word
 */
export class WordSense {
  private simplified: string;
  private traditional: string;
  private pinyin: string;
  private english: string;
  private grammar: string;
  private notes: string;

  /**
   * Create a WordSense object
   * @param {!string} simplified - Simplified Chinese
   * @param {!string} traditional - Traditional Chinese
   * @param {string} pinyin - Mandarin pronunciation
   * @param {string} english - English equivalent
   * @param {string} grammar - Part of speech
   * @param {string} notes - Freeform notes
   */
  constructor(simplified: string,
              traditional: string,
              pinyin: string,
              english: string,
              grammar: string,
              notes: string) {
    this.simplified = simplified;
    this.traditional = traditional;
    this.pinyin = pinyin;
    this.english = english;
    this.grammar = grammar;
    this.notes = notes;
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
   * Gets notes relating to the word sense
   * @return {string} freeform notes
   */
  getNotes() {
    return this.notes;
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