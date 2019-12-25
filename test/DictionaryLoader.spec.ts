/*
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
  * @fileoverview Unit tests for DictionaryLoader
  */

import { DictionaryCollection } from "../src/DictionaryCollection";
import { DictionaryLoader } from "../src/DictionaryLoader";
import { DictionarySource } from "../src/DictionarySource";
import { MockDataLoader } from "./MockDataLoader";
import {} from "jasmine";

const jsonStr1 =
`[{"s":"夫家",
  "t":"夫家",
  "p":"fūjiā",
  "e":"husband's family",
  "g":"noun",
  "h":"101676"}]`;

const jsonStr2 =
`[{"t":"四面","s":"四面","p":"sìmiàn","e":"all sides"}]`;

const source = new DictionarySource("/assets/words.json",
                                    "DictionaryCollection Test",
                                    "For testing purposes");

describe('DictionaryLoader', function() {
  describe('#loadDictionaries', () => {
    it('Mock loader loads the term 夫家', (done) => {
      console.log("DictionaryLoader#loadDictionaries");
      const dictionaries = new DictionaryCollection();
      const keys = ["/assets/words.json"];
      const jsonStrArr = [jsonStr1];
      const dataLoader = new MockDataLoader(keys, jsonStrArr);
      const loader = new DictionaryLoader([source],
                                          dictionaries,
                                          false,
                                          dataLoader);
      const obs = loader.loadDictionaries();
      obs.subscribe(() => {
      	console.log("DictionaryLoader#loadDictionaries");
      	expect(dictionaries.has("夫家")).toBe(true);
      	done();
      });
    });
    it('Multiple dictionaries loaded', (done) => {
      const key1 = "../assets/cccedict_sample.json";
      const key2 = "../assets/words.json";
      const keys = [key1, key2];
      const jsonStrArr = [jsonStr1, jsonStr2];
      const dataLoader = new MockDataLoader(keys, jsonStrArr);
      const s1 = new DictionarySource(key1,
                                      "CC-CEDICT Sample",
                                      "For testing purposes");
      const s2 = new DictionarySource(key2,
                                      "CC-CEDICT Sample",
                                      "For testing multple dictionaries");
      const dictionaries = new DictionaryCollection();
      const loader = new DictionaryLoader([s1, s2],
                                           dictionaries,
                                           false,
                                           dataLoader);
      const observable = loader.loadDictionaries();
      observable.subscribe(
        () => {
          expect(dictionaries.has("夫家")).withContext("夫家").toBe(true);
          expect(dictionaries.has("四面")).withContext("四面").toBe(true);
          done();
        },
        (err) => {
          console.log(`DictionaryLoader#loadDictionaries, error: ${err}`);
          expect(false).withContext(`Error: ${err}`).toBe(true);
          done();
        },
      );
    });
  });
});