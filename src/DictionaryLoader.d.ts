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
import { DictionarySource } from "./DictionarySource";
import { Observable } from "rxjs";
/**
 * Loads the dictionaries from source files.
 */
export declare class DictionaryLoader {
    private sources;
    private headwords;
    private dictionaries;
    /**
     * Create an empty DictionaryLoader instance
     *
     * @param {string} sources - Names of the dictionary files
     * @param {DictionaryCollection} dictionaries - To load the data into
     */
    constructor(sources: DictionarySource[], dictionaries: DictionaryCollection);
    /**
     * Returns an Observable that will complete on loading all the dictionaries
     */
    loadDictionaries(): Observable<unknown>;
    /**
     * @private
     * Deserializes the dictionary from protobuf format. Expected to be called by
     * a builder in initializing the dictionary.
     *
     * @param {!Array<object>} dictData - An array of dictionary term objects
     */
    private load_dictionary_;
}
