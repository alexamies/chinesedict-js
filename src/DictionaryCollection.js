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
import { Term } from "./Term";
/**
 * A dictionary collection represents one or more dictionary sources, indexed by
 * a set of headwords and loaded from a set of JSON files. The set of headwords
 * is empty until the dictionary is loaded.
 */
export class DictionaryCollection {
    /**
     * Construct a DictionaryCollection instance
     */
    constructor() {
        this.headwords = new Map();
        this.loaded = false;
    }
    /**
     * Checks for the presence of a headword in the DictionaryCollection.
     *
     * @param {!string} headword - Simplified or traditional Chinese
     */
    has(headword) {
        return this.headwords.has(headword);
    }
    /**
     * True is the dictionary is loaded. The lookup method will return
     * non-trivial terms after that.
     */
    isLoaded() {
        console.log(`DictionaryCollection.isLoaded ${this.loaded}`);
        return this.loaded;
    }
    /**
     * Looks up a headword in the DictionaryCollection. If the headword is not
     * present then return a Term object populated with the headword but with an
     * empty body.
     *
     * @param {!string} headword - Simplified or traditional Chinese
     * @return {!Term} A non-null term
     */
    lookup(headword) {
        const term = this.headwords.get(headword);
        if (term) {
            return term;
        }
        else {
            return new Term(headword, []);
        }
    }
    /**
     * Sets the map of headwords, also indicating that the dictionary collection
     * is loaded.
     *
     * @param {!Map<string, Term>} headwords - indexing the dictionary collection
     */
    setHeadwords(headwords) {
        console.log("DictionaryCollection.setHeadwords enter");
        this.headwords = headwords;
        this.loaded = true;
    }
}
