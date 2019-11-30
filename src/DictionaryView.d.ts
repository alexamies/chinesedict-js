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
import { DictionaryCollection } from "./DictionaryCollection";
import { DictionaryViewConfig } from "./DictionaryViewConfig";
import { Term } from "./Term";
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
 * A class for presenting Chinese words and segmenting blocks of text with one
 * or more Chinese-English dictionaries. It may highlight either all terms in
 * the text matching dictionary entries or only the proper nouns.
 */
export declare class DictionaryView {
    private dictionaries;
    private selector;
    private dialogId;
    private highlight;
    private dialog;
    private dialogContainerEl;
    private headwordEl;
    private config;
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
    constructor(selector: string, dialogId: string, highlight: "all" | "proper" | "", config: DictionaryViewConfig, dictionaries: DictionaryCollection);
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
     * Whether the dictionary sources have been loaded
     */
    isLoaded(): boolean;
    /**
     * Look up a term in the matching the given Chinese
     */
    lookup(chinese: string): Term;
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
     * @param {string} dialogId - A DOM id used to find the dialog
     */
    showDialog(event: MouseEvent, term: Term, dialogId: string): void;
    /**
     * Initializes the view to listen for events, wiring the HTML elements to
     * the event subscribers.
     */
    wire(): void;
    /**
     * Add a dictionary entry to the dialog
     *
     * @param {string} chinese - the Chinese text
     * @param {DictionaryEntry} entry - the word data to add to the dialog
     */
    private addDictEntryToDialog;
    /**
     * Add parts of a Chinese string to the dialog
     *
     * @param {string} chinese - the Chinese text
     * @param {HTMLDivElement} containerEl - to display the parts in
     */
    private addPartsToDialog;
    /**
     * Decorate the segments of text
     *
     * @private
     * @param {!HTMLElement} elem - The DOM element to add the segments to
     * @param {!Array.<Term>} terms - The segmented text array of terms
     * @param {string} dialogId - A DOM id used to find the dialog
     * @param {string} highlight - Which terms to highlight: all | proper | ''
     */
    private decorate_segments_;
    /**
     * Segments the text into an array of individual words
     *
     * @private
     * @param {string} text - The text string to be segmented
     * @return {Array.<Term>} The segmented text as an array of terms
     */
    private segment_text_;
}
