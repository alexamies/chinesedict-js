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
 
import { DictionaryEntry } from "./DictionaryEntry";
import { WordSense } from "./WordSense";

/**
 * Encapsulates a text segment with information about matching dictionary entry
 */
export class Term {
  private chinese: string;
  private entries: DictionaryEntry[];

  /**
   * Create a Term object
   * @param {!string} chinese - Either simplified or traditional, used to look
   *                            up the term
   * @param {string} headword_id - The headword id
   * @param {DictionaryEntry} entries - An array of dictionary entries
   */
  constructor(chinese: string, entries: DictionaryEntry[]) {
    this.chinese = chinese;
    this.entries = entries;
  }

  /**
   * Adds a word sense
   */
  public addDictionaryEntry(ws: WordSense, entry: DictionaryEntry): void {
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
  public getChinese(): string {
    return this.chinese;
  }

  /**
   * Gets the dictionary entries for this term
   * @return {!Array<DictionaryEntry>} An array of entries
   */
  public getEntries(): DictionaryEntry[] {
    return this.entries;
  }
}
