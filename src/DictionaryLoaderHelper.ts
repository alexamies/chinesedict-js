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
import { DictionarySource } from "./DictionarySource";
import { Term } from "./Term";
import { WordSense } from "./WordSense";

// Interface for JSON data loaded into dictionary
export interface JSONDictEntry {
  s: string; // simplified
  t: string; // traditional
  p: string; // Pinyin
  e: string; // English
  g: string; // grammar
  n: string; // notes
  h: string; // headword id
}

/**
 * Utility for loading dictionary sources.
 */
export class DictionaryLoaderHelper {

  /**
   * Deserializes the dictionary from compressed object into structured format.
   *
   * @param {DictionarySource} source - A dictionary sources
   * @param {JSONDictEntry} dictData - A dictionary sources
   * @param {Map<string, Term>} headwords - The data will be loaded into this
   * @param {boolean} indexSimplified - If true, simplified forms will be added
   *                  to the index
   */
  public loadDictionary(source: DictionarySource,
  	                     dictData: JSONDictEntry[],
  	                     headwords: Map<string, Term>,
  	                     indexSimplified: boolean) {
    const title = source.title;
    console.log(`DictionaryLoaderHelper ${ title }, ${ indexSimplified }`);
    for (const entry of dictData) {
      const traditional = entry.t;
      const sense = new WordSense(entry.s,
                                  entry.t,
                                  entry.p,
                                  entry.e,
                                  entry.g,
                                  entry.n);
      const dictEntry = new DictionaryEntry(traditional, source, [sense],
                                            entry.h);
      if (!headwords.has(traditional)) {
        // console.log(`Loading ${ traditional } from ${ source.title } `);
        const term = new Term(traditional, [dictEntry]);
        headwords.set(traditional, term);
      } else {
        // console.log(`Adding ${ traditional } from ${ source.title } `);
        const term = headwords.get(traditional);
        term!.addDictionaryEntry(sense, dictEntry);
      }
      if (indexSimplified) {
        if (traditional !== entry.s &&
            !headwords.has(entry.s)) {
          const term = new Term(entry.s, [dictEntry]);
          headwords.set(entry.s, term);
        } else {
          const term = headwords.get(entry.s);
          term!.addDictionaryEntry(sense, dictEntry);
        }
      }
    }
  }
}