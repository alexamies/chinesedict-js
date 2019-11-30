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
import { DictionaryCollection } from './DictionaryCollection';
import { DictionaryLoader } from "./DictionaryLoader";
import { DictionarySource } from "./DictionarySource";
import { DictionaryView } from "./DictionaryView";
import { DictionaryViewConfig } from "./DictionaryViewConfig";

/**
 * An implementation of the DictionaryBuilder interface for building and
 * initializing a basic DictionaryView object with a textfield input to read
 * values and a list for displaying matching terms.
 */
export class BasicDictionaryBuilder implements DictionaryBuilder {
  private sources: DictionarySource[];
  private config: DictionaryViewConfig;
  private view: DictionaryView;
  private dictionaries: DictionaryCollection;

  /**
   * Create an empty BasicDictionaryBuilder instance with given sources and
   * configuration.
   *
   * @param {!Array<DictionarySource>} source - Name of the dictionary file
   * @param {!DictionaryViewConfig} config - Configuration of the view to build
   */
  constructor(sources: DictionarySource[],
              config: DictionaryViewConfig) {
    console.log("BasicDictionaryBuilder constructor");
    this.sources = sources;
    this.config = config;
    this.dictionaries = new DictionaryCollection();
    this.view = new DictionaryView("", "", "", config, this.dictionaries);
  }

  /**
   * Creates and initializes a DictionaryView, load the dictionary, and
   * initialize the DictionaryView.
   */
  public buildDictionary() {
    console.log("BasicDictionaryBuilder.buildDictionary enter");
    this.view.wire();
    const loader = new DictionaryLoader(this.sources, this.dictionaries);
    const observable = loader.loadDictionaries();
    observable.subscribe(
      () => { console.log("BasicDictionaryBuilder.buildDictionary next"); },
      (err: Object) => {
        console.error("BasicDictionaryBuilder.buildDictionary " + err);
      },
      () => {
        console.log("BasicDictionaryBuilder.buildDictionary done");
       },
    );
    return this.view;
  }
}
