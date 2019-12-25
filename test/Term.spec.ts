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

import { DictionaryEntry } from "../src/DictionaryEntry";
import { DictionarySource } from "../src/DictionarySource";
import { Term } from "../src/Term";
import {} from "jasmine";

const source = new DictionarySource('/assets/words.json',
                                     'Test dictionary',
                                     'For testing purposes');

describe("Term", () => {
  describe("#getEntries", () => {
    it('filename should be set properly', () => {
      const traditional = '他';
      const hwid = '518';
      const pinyin = 'tā';
      const english = 'other / another / some other';
      const grammar = 'noun';
      const notes = '';
      const entry = new DictionaryEntry(traditional, source, [], hwid);
      const term = new Term(traditional, [entry]);
      expect(term.getEntries().length).toEqual(1);
    });
  });
});
