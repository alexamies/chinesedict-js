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
import { DictionarySource } from "./DictionarySource";
import { WordSense } from "./WordSense";
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
    constructor(headword: string, source: DictionarySource, senses: WordSense[], headwordId: string);
    /**
     * A convenience method that flattens the English equivalents for the term
     * into a single string with a ';' delimiter
     * @return {string} English equivalents for the term
     */
    addWordSense(ws: WordSense): void;
    /**
     * Get the Chinese, including the traditional form in Chinese brackets （）
     * after the simplified, if it differs.
     * @return {string} The Chinese text for teh headword
     */
    getChinese(): string;
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
    getGrammar(): string | undefined;
    /**
     * Gets the headword_id for the term
     * @return {string} headword_id - The headword id
     */
    getHeadwordId(): string;
    /**
     * A convenience method that flattens the pinyin for the term. Gives
     * a comma delimited list of unique values
     * @return {string} Mandarin pronunciation
     */
    getPinyin(): string;
    /**
     * Gets the word senses
     * @return {Array<WordSense>} an array of WordSense objects
     */
    getSenses(): WordSense[];
    /**
     * A convenience method that flattens the simplified Chinese for the term.
     * Gives a Chinese comma (、) delimited list of unique values
     * @return {string} Simplified Chinese
     */
    getSimplified(): string;
    /**
     * Gets the dictionary source
     * @return {DictionarySource} the source of the dictionary
     */
    getSource(): DictionarySource;
    /**
     * A convenience method that flattens the traditional Chinese for the term.
     * Gives a Chinese comma (、) delimited list of unique values
     * @return {string} Traditional Chinese
     */
    getTraditional(): string;
}
