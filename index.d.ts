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
import { Observable } from 'rxjs';
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
 * A dictionary collection represents one or more dictionary sources, indexed by
 * a set of headwords and loaded from a set of JSON files. The set of headwords
 * is empty until the dictionary is loaded.
 */
export declare class DictionaryCollection {
    private headwords;
    private loaded;
    /**
     * Construct a DictionaryCollection instance
     */
    constructor();
    /**
     * Checks for the presence of a headword in the DictionaryCollection.
     *
     * @param {!string} headword - Simplified or traditional Chinese
     */
    has(headword: string): boolean;
    /**
     * True is the dictionary is loaded. The lookup method will return
     * non-trivial terms after that.
     */
    isLoaded(): boolean;
    /**
     * Looks up a headword in the DictionaryCollection. If the headword is not
     * present then return a Term object populated with the headword but with an
     * empty body.
     *
     * @param {!string} headword - Simplified or traditional Chinese
     * @return {!Term} A non-null term
     */
    lookup(headword: string): Term;
    /**
     * Sets the map of headwords, also indicating that the dictionary collection
     * is loaded.
     *
     * @param {!Map<string, Term>} headwords - indexing the dictionary collection
     */
    setHeadwords(headwords: Map<string, Term>): void;
}
/**
 * An entry in a dictionary from a specific source.
 */
export declare class DictionaryEntry {
    private headword;
    private source;
    private senses;
    private headwordId;
    /**
     * Construct a Dictionary object
     *
     * @param {!string} headword - The Chinese headword, simplified or traditional
     * @param {!DictionarySource} source - The dictionary containing the entry
     * @param {!Array<WordSense>} senses - An array of word senses
     */
    constructor(headword: string, source: DictionarySource, senses: Array<WordSense>, headwordId: string);
    /**
     * A convenience method that flattens the English equivalents for the term
     * into a single string with a ';' delimiter
     * @return {string} English equivalents for the term
     */
    addWordSense(ws: WordSense): void;
    /**
     * A convenience method that flattens the English equivalents for the term
     * into a single string with a ';' delimiter
     * @return {string} English equivalents for the term
     */
    getEnglish(): string;
    /**
     * A convenience method that flattens the part of speech for the term. If
     * there is only one sense then use that for the part of speech. Otherwise,
     * return an empty string.
     * @return {string} part of speech for the term
     */
    getGrammar(): string;
    /**
     * Gets the headword_id for the term
     * @return {string} headword_id - The headword id
     */
    getHeadwordId(): string;
    /**
     * A convenience method that flattens the part of pinyin for the term. Gives
     * a comma delimited list of unique values
     * @return {string} Mandarin pronunciation
     */
    getPinyin(): string;
    /**
     * Gets the dictionary source
     * @return {DictionarySource} the source of the dictionary
     */
    getSource(): DictionarySource;
    /**
     * Gets the word senses
     * @return {Array<WordSense>} an array of WordSense objects
     */
    getSenses(): WordSense[];
}
/**
 * Loads the dictionaries from source files.
 */
export declare class DictionaryLoader {
    private sources;
    private headwords;
    /**
     * Create an empty PlainJSBuilder instance
     *
     * @param {string} sources - Names of the dictionary files
     */
    constructor(sources: Array<DictionarySource>);
    /**
     * Returns a map of headwords, wait until after loading to call this
     */
    getDictionaryCollection(): DictionaryCollection;
    /**
     * Returns an Observable that will complete on loading all the dictionaries
     */
    loadDictionaries(): Observable<unknown>;
    /**
     * @private
     * Deserializes the dictionary from protobuf format. Expected to be called by
     * a builder in initializing the dictionary.
     *
     * @param {!Array<object>} dictData - An array of dictionary term objects
     */
    load_dictionary_(source: DictionarySource, dictData: Array<JSONDictEntry>): void;
}
/**
 * The source of a dictionary, including where to load it from, its name,
 * and where to find out about it.
 */
export declare class DictionarySource {
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
    constructor(filename: string, title: string, description: string);
}
/**
 * A class for presenting Chinese words and segmenting blocks of text with one
 * or more Chinese-English dictionaries. It may highlight either all terms in
 * the text matching dictionary entries or only the proper nouns.
 */
export declare class DictionaryView {
    private dictionaries;
    private selector;
    private dialog_id;
    private highlight;
    private dialog;
    private dialogContainerEl;
    private headwordEl;
    /**
     * Use a DictionaryBuilder implementation rather than calling the constructor
     * directly.
     *
     * @param {string} selector - A DOM selector used to find the page elements
     * @param {string} dialog_id - A DOM id used to find the dialog
     * @param {string} highlight - Which terms to highlight: all | proper | ''
     */
    constructor(selector: string, dialog_id: string, highlight: 'all' | 'proper' | '');
    /**
     * Add a dictionary entry to the dialog
     *
     * @param {string} chinese - the Chinese text
     * @param {DictionaryEntry} entry - the word data to add to the dialog
     */
    addDictEntryToDialog(chinese: string, entry: DictionaryEntry): void;
    /**
     * Add parts of a Chinese string to the dialog
     *
     * @param {string} chinese - the Chinese text
     * @param {HTMLDivElement} containerEl - to display the parts in
     */
    addPartsToDialog(chinese: string, containerEl: HTMLDivElement): void;
    /**
     * Decorate the segments of text
     *
     * @private
     * @param {!HTMLElement} elem - The DOM element to add the segments to
     * @param {!Array.<Term>} terms - The segmented text array of terms
     * @param {string} dialog_id - A DOM id used to find the dialog
     * @param {string} highlight - Which terms to highlight: all | proper | ''
     */
    decorate_segments_(elem: Element, terms: Array<Term>, dialog_id: string, highlight: 'all' | 'proper' | ''): void;
    /**
     * Respond to a mouse over event for a dictionary term. Expected to be called
     * in response to a user event.
     *
     * @param {MouseEvent} event - An event triggered by a user
     * @param {Term} term - Encapsulates the Chinese and the English equivalent
     */
    doMouseover(event: MouseEvent, term: Term): void;
    /**
     * Scans blocks of text, highlighting the words in in the dictionary with
     * links that can be clicked to find the definitions. The blocks of text
     * are identified with a DOM selector. Expected to be called by a builder in
     * initializing the dictionary.
     */
    highlightWords(): void;
    /**
     * Look up a term in the matching the given Chinese
     */
    lookup(chinese: string): Term;
    /**
     * Segments the text into an array of individual words
     *
     * @private
     * @param {string} text - The text string to be segmented
     * @return {Array.<Term>} The segmented text as an array of terms
     */
    segment_text_(text: string): Array<Term>;
    /**
     * Sets the collection of dictionaries to use in the dictionary view.
     *
     * @param {!DictionaryCollection} The collection of dictionaries
     */
    setDictionaryCollection(dictionaries: DictionaryCollection): void;
    /**
     * Add a listener to the dialog OK button. The OK button should have the ID
     * of the dialog with '_ok' appended. Expected to be called by a builder in
     * initializing the dictionary.
     */
    setupDialog(): void;
    /**
     * Show a dialog with the dictionary definition. Expected to be called in
     * response to a user clicking on a highlighted word.
     *
     * @param {MouseEvent} event - An event triggered by a user
     * @param {Term} term - Encapsulates the Chinese and the English equivalent
     * @param {string} dialog_id - A DOM id used to find the dialog
     */
    showDialog(event: MouseEvent, term: Term, dialog_id: string): void;
}
interface JSONDictEntry {
    s: string;
    t: string;
    p: string;
    e: string;
    g: string;
    n: string;
    h: string;
}
/**
 * An implementation of the DictionaryBuilder interface for building and
 * initializing DictionaryView objects for browser apps that do not use an
 * application framework.
 */
export declare class PlainJSBuilder implements DictionaryBuilder {
    private sources;
    private dict;
    /**
     * Create an empty PlainJSBuilder instance
     *
     * @param {string} source - Name of the dictionary file
     * @param {string} selector - A DOM selector used to find the page elements
     * @param {string} dialog_id - A DOM id used to find the dialog
     * @param {string} highlight - Which terms to highlight: all | proper
     */
    constructor(sources: Array<DictionarySource>, selector: string, dialog_id: string, highlight: 'all' | 'proper');
    /**
     * Creates and initializes a DictionaryView, load the dictionary, and scan DOM
     * elements matching the selector. If the highlight is empty or has value
     * 'all' then all words with dictionary entries will be highlighted. If
     * highlight is set to 'proper' then event listeners will be added for all
     * terms but only those that are proper nouns (names, places, etc) will be
     * highlighted.
     */
    buildDictionary(): DictionaryView;
}
/**
 * Encapsulates a text segment with information about matching dictionary entry
 */
export declare class Term {
    private chinese;
    private entries;
    /**
     * Create a Term object
     * @param {!string} chinese - Either simplified or traditional, used to look
     *                            up the term
     * @param {string} headword_id - The headword id
     * @param {DictionaryEntry} entries - An array of dictionary entries
     */
    constructor(chinese: string, entries: Array<DictionaryEntry>);
    /**
     * Adds a word sense
     */
    addDictionaryEntry(ws: WordSense, entry: DictionaryEntry): void;
    /**
     * Gets the Chinese text that the term is stored and looked up by
     * @return {!string} Either simplified or traditional
     */
    getChinese(): string;
    /**
     * Gets the dictionary entries for this term
     * @return {!Array<DictionaryEntry>} An array of entries
     */
    getEntries(): Array<DictionaryEntry>;
}
/**
 * Utility for segmenting text into individual terms.
 */
export declare class TextParser {
    private dictionaries;
    /**
     * Construct a Dictionary object
     *
     * @param {!DictionaryCollection} dictionaries - a collection of dictionary
     */
    constructor(dictionaries: DictionaryCollection);
    /**
     * Segments the text into an array of individual words, excluding the whole
     * text given as a parameter
     *
     * @param {string} text - The text string to be segmented
     * @return {Array.<Term>} The segmented text as an array of terms
     */
    segmentExludeWhole(text: string): Array<Term>;
    /**
     * Segments the text into an array of individual words
     *
     * @param {string} text - The text string to be segmented
     * @return {Array.<Term>} The segmented text as an array of terms
     */
    segmentText(text: string): Array<Term>;
}
/**
 * Class encapsulating the sense of a Chinese word
 */
declare class WordSense {
    private simplified;
    private traditional;
    private pinyin;
    private english;
    private grammar;
    private notes;
    /**
     * Create a WordSense object
     * @param {!string} simplified - Simplified Chinese
     * @param {!string} traditional - Traditional Chinese
     * @param {string} pinyin - Mandarin pronunciation
     * @param {string} english - English equivalent
     * @param {string} grammar - Part of speech
     * @param {string} notes - Freeform notes
     */
    constructor(simplified: string, traditional: string, pinyin: string, english: string, grammar: string, notes: string);
    /**
     * Gets the English equivalent for the sense
     * @return {string} English equivalent for the sense
     */
    getEnglish(): string;
    /**
     * Gets the part of speech for the sense
     * @return {string} part of speech for the sense
     */
    getGrammar(): string;
    /**
     * Gets the Mandarin pronunciation for the sense
     * @return {string} Mandarin pronunciation
     */
    getPinyin(): string;
    /**
     * Gets notes relating to the word sense
     * @return {string} freeform notes
     */
    getNotes(): string;
    /**
     * Gets the simplified Chinese text for the sense
     * @return {!string} The simplified Chinese text for the sense
     */
    getSimplified(): string;
    /**
     * Gets the traditional Chinese for the sense
     * @return {string} traditional Chinese
     */
    getTraditional(): string;
}
export {};
