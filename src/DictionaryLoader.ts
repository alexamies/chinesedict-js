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
import { DictionaryLoaderHelper } from "./DictionaryLoaderHelper";
import { JSONDictEntry } from "./DictionaryLoaderHelper";
import { DictionarySource } from "./DictionarySource";
import { IDictionaryLoader } from "./IDictionaryLoader";
import { Term } from "./Term";
import { Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";

/**
 * Loads the dictionaries from source files.
 */
export class DictionaryLoader implements IDictionaryLoader {
  private sources: DictionarySource[];
  private headwords: Map<string, Term>;
  private dictionaries: DictionaryCollection;
  private indexSimplified: boolean;

  /**
   * Create an empty DictionaryLoader instance
   *
   * @param {string} sources - Names of the dictionary files
   * @param {DictionaryCollection} dictionaries - To load the data into
   */
  constructor(sources: DictionarySource[],
              dictionaries: DictionaryCollection,
              indexSimplified = false) {
    console.log("DictionaryLoader constructor");
    this.sources = sources;
    this.headwords = new Map<string, Term>();
    this.dictionaries = dictionaries;
    this.indexSimplified = indexSimplified;
  }

  /**
   * Returns an Observable that will complete on loading all the dictionaries
   */
  public loadDictionaries() {
    console.log("loadDictionaries enter");
    const observable = new Observable((subscriber) => {
      const sources = this.sources;
      let numLoaded = 0;
      for (const source of sources) {
        const filename = source.filename;
        console.log(`loadDictionaries loading ${ filename }`);
        if (filename) {
          const reqObs = ajax.getJSON(filename);
          const subscribe = reqObs.subscribe(
            (res) => {
              console.log(`loadDictionaries: for ${ filename }`);
              const helper = new DictionaryLoaderHelper();
              helper.loadDictionary(source,
                                    res as JSONDictEntry[],
                                    this.headwords,
                                    this.indexSimplified);
              numLoaded++;
              if (numLoaded >= sources.length) {
                console.log(`loadDictionaries: ${ this.headwords.size } terms`);
                this.dictionaries.setHeadwords(this.headwords);
                subscriber.next(numLoaded);
                subscriber.complete();
              }
            },
            (error) => {
              console.log(`Error fetching dictionary: ${ error }`);
              subscriber.next(error);
              return of(error);
            },
          );
        } else {
          subscriber.next("Error no filename provided");
        }
      }
    });
    return observable;
  }
}
