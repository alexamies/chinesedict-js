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
  * @fileoverview Unit tests for DictionaryView
  */

import { PlainJSBuilder } from "../src/PlainJSBuilder";
import { DictionarySource } from "../src/DictionarySource";
import { MockDataLoader } from "./MockDataLoader";
import {} from "jasmine";

const source = new DictionarySource('/assets/words.json',
                                     'Test dictionary',
                                     'For testing purposes');
const jsonStr1 =
`[{"s":"夫家",
  "t":"夫家",
  "p":"fūjiā",
  "e":"husband's family",
  "g":"noun",
  "h":"101676"}]`;

describe("DictionaryView", () => {
  describe("#lookup", () => {
    it("Can lookup a term in the test dictionary if loaded", () => {
      const keys = ["/assets/words.json"];
      const jsonStrArr = [jsonStr1];
      const dataLoader = new MockDataLoader(keys, jsonStrArr);
      const builder = new PlainJSBuilder([source],
                                         ".textbody",
                                         "dict-dialog",
                                         "all",
                                         false,
                                         dataLoader);
      const dictView = builder.buildDictionary();
      const chinese = "夫家";
      const term = dictView.lookup(chinese);
      console.log(`dictView.isLoaded() ${ dictView.isLoaded() }`);
      if (dictView.isLoaded()) {
        expect(term.getEntries().length).toEqual(1);
        const entry = term.getEntries()[0];
        expect(entry.getPinyin()).toEqual("fūjiā");
      }
    });
  });
});
