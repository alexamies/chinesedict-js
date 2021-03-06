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
 * Class encapsulating the sense of a Chinese word
 */
export class WordSense {
  private simplified: string;
  private traditional: string | undefined;
  private pinyin: string | undefined;
  private english: string | undefined;
  private grammar: string | undefined;
  private notes: string | undefined;

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
  public getEnglish() {
    if (this.english == '\\N') {
      return '';
    }
    return this.english;
  }

  /**
   * Gets the part of speech for the sense
   * @return {string} part of speech for the sense
   */
  public getGrammar() {
    return this.grammar;
  }

  /**
   * Gets the Mandarin pronunciation for the sense
   * @return {string} Mandarin pronunciation
   */
  public getPinyin() {
    if (this.pinyin == '\\N') {
      return '';
    }
    return this.pinyin;
  }

  /**
   * Gets notes relating to the word sense
   * @return {string} freeform notes
   */
  public getNotes() {
    return this.notes;
  }

  /**
   * Gets the simplified Chinese text for the sense
   * @return {!string} The simplified Chinese text for the sense
   */
  public getSimplified() {
    return this.simplified;
  }

  /**
   * Gets the traditional Chinese for the sense
   * @return {string} traditional Chinese
   */
  public getTraditional() {
    return this.traditional;
  }
}
