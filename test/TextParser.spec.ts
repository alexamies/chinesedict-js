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
  * @fileoverview Unit tests for Term
  */

import { DictionaryCollection } from "../src/DictionaryCollection";
import { DictionarySource } from "../src/DictionarySource";
import { DictionaryLoader } from "../src/DictionaryLoader";
import { MockDataLoader } from "./MockDataLoader";
import { TextParser } from "../src/TextParser";
import {} from "jasmine";

const source = new DictionarySource('/assets/words.json',
                                     'Test dictionary',
                                     'For testing purposes');
const jsonStr =
`[{
  "s":"他",
  "t":"他",
  "p":"tā",
  "e":"other",
  "g":"noun",
  "h":"518"
 },{
   "s":"力",
   "t":"力",
   "p":"lì",
   "e":"ability",
   "g":"noun",
   "h":"972"
 },{
   "s":"他力",
   "t":"他力",
   "p":"tālì",
   "e":"the power of another",
   "g":"set phrase",
   "h":"101695"
 }]`;

describe("TextParser", () => {
  describe('#segmentExludeWhole', () => {
    it('Parse text 他力 into two terms', (done) => {
      const dictionaries = new DictionaryCollection();
      const keys = ["/assets/words.json"];
      const jsonStrArr = [jsonStr];
      const dataLoader = new MockDataLoader(keys, jsonStrArr);
      const loader = new DictionaryLoader([source],
                                          dictionaries,
                                          false,
                                          dataLoader);
      const observable = loader.loadDictionaries();
      observable.subscribe(
        () => {
          const parser = new TextParser(dictionaries);
          const terms = parser.segmentExludeWhole('他力');
          expect(terms.length).withContext("terms.length incorrect").toEqual(2);
          terms.forEach((t) => {
            const entries = t.getEntries();
            expect(entries).withContext("entries not defined").toBeDefined();
            expect(entries.length).withContext("entries>0").toBeGreaterThan(0);
            entries.forEach((entry) => {
              expect(entries.length).withContext("entries>0").toBeGreaterThan(0);
              expect(entry.getPinyin())
                .withContext("pinyin not empty").not.toEqual("");
            });
          });
          done();
        },
        (err) => {
          expect(err).withContext(`Error: ${err}`).toBeNull();
          done(); 
        },
      );
    });
  });
  describe('#segmentText', () => {
    it('Parse text 他力 into one term', (done) => {
      const dictionaries = new DictionaryCollection();
      const keys = ["/assets/words.json"];
      const jsonStrArr = [jsonStr];
      const dataLoader = new MockDataLoader(keys, jsonStrArr);
      const loader = new DictionaryLoader([source],
                                          dictionaries,
                                          false,
                                          dataLoader);
      const observable = loader.loadDictionaries();
      observable.subscribe(
        () => {
          const parser = new TextParser(dictionaries);
          const terms = parser.segmentText('他力');
          expect(terms.length).withContext("terms.length != 1").toEqual(1);
          done();
        },
        (err) => {
          expect(err).withContext(`Error: ${err}`).toBeNull();
          done(); 
        },
      );
    });
  });
});
