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
import { IDataLoader } from "./IDataLoader";
import { IDictionaryLoader } from "./IDictionaryLoader";
import { Observable } from "rxjs";
/**
 * Loads the dictionaries from source files.
 */
export declare class DictionaryLoader implements IDictionaryLoader {
    private sources;
    private headwords;
    private dictionaries;
    private indexSimplified;
    private dataLoader;
    /**
     * Create an empty DictionaryLoader instance
     *
     * @param {string} sources - Names of the dictionary files
     * @param {DictionaryCollection} dictionaries - To load the data into
     * @param {boolean} indexSimplified - Whether to index by Simplified
     * @param {IDataLoader} dataLoader - Where to load data from, default AJAX
     */
    constructor(sources: DictionarySource[], dictionaries: DictionaryCollection, indexSimplified?: boolean, dataLoader?: IDataLoader | null);
    /**
     * Returns an Observable that will complete on loading all the dictionaries
     * @return {Observable} will complete after loading
     */
    loadDictionaries(): Observable<unknown>;
}
