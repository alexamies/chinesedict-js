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

import { DictionaryCollection } from "../src/DictionaryCollection";
import { DictionaryLoaderHelper } from "../src/DictionaryLoaderHelper";
import { JSONDictEntry } from "../src/DictionaryLoaderHelper";
import { IDictionaryLoader } from "../src/IDictionaryLoader";
import { DictionarySource } from "../src/DictionarySource";
import { Term } from "../src/Term";
import { Observable, of } from "rxjs";

/**
 * Loads mock dictionaries from memory.
 */
export class MockDictionaryLoader implements IDictionaryLoader {
  private jsonData: string;
  private headwords: Map<string, Term>;
  private sources: DictionarySource[];
  private dictionaries: DictionaryCollection;
  private indexSimplified = true;

  /**
   * Create a MockDictionaryLoader instance
   *
   * @param {string} jsonData - To load into dicitonaries
   * @param {DictionaryCollection} dictionaries - To load the data into
   */
  constructor(sources: DictionarySource[], 
              dictionaries: DictionaryCollection,
              jsonData = "") {
    console.log("MockDictionaryLoader constructor");
    this.sources = sources;
    this.dictionaries = dictionaries;
    this.jsonData = jsonData;
    this.headwords = new Map<string, Term>();
  }

  /**
   * Loads the data syncrhonously so that unit tests can be completed quickly.
   */
  public loadDictionaries() {
    if (this.jsonData !== "") {
      const data = JSON.parse(this.jsonData) as JSONDictEntry[];
      if (this.sources && this.sources.length > 0) {
        const helper = new DictionaryLoaderHelper();
        helper.loadDictionary(this.sources[0],
                              data as JSONDictEntry[],
                              this.headwords,
                              this.indexSimplified);
      }
    } 
    this.dictionaries.setHeadwords(this.headwords);
    return of([1]);
  }
}