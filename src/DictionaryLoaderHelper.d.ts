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
import { DictionarySource } from "./DictionarySource";
import { Term } from "./Term";
export interface JSONDictEntry {
    s: string;
    t: string;
    p: string;
    e: string;
    g: string;
    n: string;
    h: string;
}
/**
 * Utility for loading dictionary sources.
 */
export declare class DictionaryLoaderHelper {
    /**
     * Deserializes the dictionary from compressed object into structured format.
     *
     * @param {DictionarySource} source - A dictionary sources
     * @param {JSONDictEntry} dictData - A dictionary sources
     * @param {Map<string, Term>} headwords - The data will be loaded into this
     * @param {boolean} indexSimplified - If true, simplified forms will be added
     *                  to the index
     */
    loadDictionary(source: DictionarySource, dictData: JSONDictEntry[], headwords: Map<string, Term>, indexSimplified: boolean): void;
}
