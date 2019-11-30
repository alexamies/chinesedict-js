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
export class DictionaryEntry {
  private headword: string;
  private source: DictionarySource;
  private senses: WordSense[];
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
              senses: WordSense[],
              headwordId: string) {
    // console.log(`DictionaryEntry ${ headword }`);
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
  public addWordSense(ws: WordSense) {
    this.senses.push(ws);
  }

  /**
   * Get the Chinese, including the traditional form in Chinese brackets （）
   * after the simplified, if it differs.
   * @return {string} The Chinese text for teh headword
   */
  public getChinese() {
    const s = this.getSimplified();
    const t = this.getTraditional();
    let chinese = s;
    if (s !== t) {
      chinese = `${ s }（${ t }）`;
    }
    return chinese;
  }

  /**
   * A convenience method that flattens the English equivalents for the term
   * into a single string with a ';' delimiter
   * @return {string} English equivalents for the term
   */
  public getEnglish() {
    const r1 = new RegExp(" / ", "g");
    const r2 = new RegExp("/", "g");
    let english = "";
    for (const sense of this.senses) {
      let eng = sense.getEnglish();
      // console.log(`getEnglish before ${ eng }`);
      eng = eng.replace(r1, ", ");
      eng = eng.replace(r2, ", ");
      english += eng + "; ";
    }
    const re = new RegExp("; $");  // remove trailing semicolon
    return english.replace(re, "");
  }

  /**
   * A convenience method that flattens the part of speech for the term. If
   * there is only one sense then use that for the part of speech. Otherwise,
   * return an empty string.
   * @return {string} part of speech for the term
   */
  public getGrammar() {
    if (this.senses.length === 1) {
      return this.senses[0].getGrammar();
    }
    return "";
  }

  /**
   * Gets the headword_id for the term
   * @return {string} headword_id - The headword id
   */
  public getHeadwordId(): string {
    return this.headwordId;
  }

  /**
   * A convenience method that flattens the pinyin for the term. Gives
   * a comma delimited list of unique values
   * @return {string} Mandarin pronunciation
   */
  public getPinyin() {
    const values: Set<string> = new Set<string>();
    for (const sense of this.senses) {
      const pinyin = sense.getPinyin();
      values.add(pinyin);
    }
    let p = "";
    for (const val of values.values()) {
      p += val + ", ";
    }
    const re = new RegExp(", $");  // remove trailing comma
    return p.replace(re, "");
  }

  /**
   * Gets the word senses
   * @return {Array<WordSense>} an array of WordSense objects
   */
  public getSenses() {
    return this.senses;
  }

  /**
   * A convenience method that flattens the simplified Chinese for the term.
   * Gives a Chinese comma (、) delimited list of unique values
   * @return {string} Simplified Chinese
   */
  public getSimplified() {
    const values: Set<string> = new Set<string>();
    for (const sense of this.senses) {
      const simplified = sense.getSimplified();
      values.add(simplified);
    }
    let p = "";
    for (const val of values.values()) {
      p += val + "、";
    }
    const re = new RegExp("、$");  // remove trailing comma
    return p.replace(re, "");
  }

  /**
   * Gets the dictionary source
   * @return {DictionarySource} the source of the dictionary
   */
  public getSource(): DictionarySource {
    return this.source;
  }

  /**
   * A convenience method that flattens the traditional Chinese for the term.
   * Gives a Chinese comma (、) delimited list of unique values
   * @return {string} Traditional Chinese
   */
  public getTraditional() {
    const values: Set<string> = new Set<string>();
    for (const sense of this.senses) {
      const trad = sense.getTraditional();
      values.add(trad);
    }
    let p = "";
    for (const val of values.values()) {
      p += val + "、";
    }
    const re = new RegExp("、$");  // remove trailing comma
    return p.replace(re, "");
  }
}
