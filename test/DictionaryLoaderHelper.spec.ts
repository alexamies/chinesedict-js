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
  * @fileoverview Unit tests for DictionaryLoaderHelper
  */

import { DictionaryLoaderHelper } from "../src/DictionaryLoaderHelper";
import { JSONDictEntry } from "../src/DictionaryLoaderHelper";
import { DictionarySource } from "../src/DictionarySource";
import { Term } from "../src/Term";
import {} from "jasmine";

const source = new DictionarySource('/assets/words.json',
                                     'DictionaryLoaderHelper Test',
                                     'For testing purposes');

const jsonStr =
`[{"s":"澳大利亚",
   "t":"澳大利亞",
   "p":"Àodàlìyà",
   "e":"Australia",
   "g":"proper noun",
   "h":"704"}]`;

describe('DictionaryLoaderHelper', function() {
  describe('#loadDictionary', () => {
    it('Simplified is not loaded', function(done) {
      const data = JSON.parse(jsonStr) as JSONDictEntry[];
      const headwords = new Map<string, Term>();
      const helper = new DictionaryLoaderHelper();
      helper.loadDictionary(source,
                            data as JSONDictEntry[],
                            headwords,
                            false);
      expect(headwords.has("澳大利亚")).toBe(false);
      done();
    });
    it('Can find by simplified term 澳大利亚', function(done) {
       const data = JSON.parse(jsonStr) as JSONDictEntry[];
      const headwords = new Map<string, Term>();
      const helper = new DictionaryLoaderHelper();
      helper.loadDictionary(source,
                            data as JSONDictEntry[],
                            headwords,
                            true);
      expect(headwords.has("澳大利亚")).toBe(true);
      done();
   });
  });
});