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
import { DictionaryBuilder } from './DictionaryBuilder';
import { DictionarySource } from "./DictionarySource";
import { DictionaryView } from "./DictionaryView";
import { DictionaryViewConfig } from "./DictionaryViewConfig";
/**
 * An implementation of the DictionaryBuilder interface for building and
 * initializing a basic DictionaryView object with a textfield input to read
 * values and a list for displaying matching terms.
 */
export declare class BasicDictionaryBuilder implements DictionaryBuilder {
    private sources;
    private config;
    private view;
    private dictionaries;
    /**
     * Create an empty BasicDictionaryBuilder instance with given sources and
     * configuration.
     *
     * @param {!Array<DictionarySource>} source - Name of the dictionary file
     * @param {!DictionaryViewConfig} config - Configuration of the view to build
     */
    constructor(sources: DictionarySource[], config: DictionaryViewConfig);
    /**
     * Creates and initializes a DictionaryView, load the dictionary, and
     * initialize the DictionaryView.
     */
    buildDictionary(): DictionaryView;
}
