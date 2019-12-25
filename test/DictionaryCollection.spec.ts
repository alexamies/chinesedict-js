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
  * @fileoverview Unit tests for DictionaryCollection
  */

import { DictionaryCollection } from "../src/DictionaryCollection";
import { DictionarySource } from "../src/DictionarySource";
import { MockDictionaryLoader } from "./MockDictionaryLoader";
import {} from "jasmine";

const source = new DictionarySource('/assets/words.json',
                                     'DictionaryCollection Test',
                                     'For testing purposes');

const jsonStr =
`[{"s":"夫家",
  "t":"夫家",
  "p":"fūjiā",
  "e":"husband's family",
  "g":"noun",
  "h":"101676"}]`;

describe('DictionaryCollection', () => {
  describe('#has', () => {
    it('Empty dictionary has no term 夫家', (done) => {
      const dictionaries = new DictionaryCollection();
      const loader = new MockDictionaryLoader([source], dictionaries);
      const obs = loader.loadDictionaries();
      obs.subscribe(() => {
      	console.log("DictionaryCollection#has next");
      	expect(dictionaries.has("夫家")).toBe(false);
      	done();
      });
    });
    it('Mock dictionary has the term 夫家', (done) => {
      const dictionaries = new DictionaryCollection();
      const loader = new MockDictionaryLoader([source], dictionaries, jsonStr);
      const obs = loader.loadDictionaries();
      obs.subscribe(() => {
      	console.log("DictionaryCollection#has next");
      	expect(dictionaries.has("夫家")).toBe(true);
      	done();
      });
    });
  });
  describe('#isLoaded', function() {
    it('Mock dictionary has correct loaded status', (done) => {
      const dictionaries = new DictionaryCollection();
      const loader = new MockDictionaryLoader([source], dictionaries, jsonStr);
      const observable = loader.loadDictionaries();
      observable.subscribe(
        () => {
          expect(dictionaries.isLoaded()).toBe(true);
          done();
        },
        (err) => {
          expect(err).toBe(false);
          done();
        },
      );
    });
  });
  describe('#lookup', function() {
    it('Term 夫家 can be looked up in the mock dictionary', (done) => {
      const dictionaries = new DictionaryCollection();
      const loader = new MockDictionaryLoader([source], dictionaries, jsonStr);
      const observable = loader.loadDictionaries();
      observable.subscribe(
        () => {
          const keyword = '夫家';
          const term = dictionaries.lookup(keyword);
          expect(term.getChinese()).toEqual(keyword);
          done();
        },
        (err) => {
          expect(err).toBe(false);
          done();
        }
      );
    });
  });
});