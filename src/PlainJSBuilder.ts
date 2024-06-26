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
import { DictionaryLoader } from './DictionaryLoader';
import { DictionarySource } from './DictionarySource';
import { DictionaryView } from './DictionaryView';
import { DictionaryViewConfig } from './DictionaryViewConfig';
import { IDataLoader } from './IDataLoader';

/**
 * An implementation of the DictionaryBuilder interface for building and
 * initializing DictionaryView objects for browser apps that do not use an
 * application framework. The DictionaryView created will scan designated text
 * and set up events to show a dialog for all vocabulary discovered.
 */
export class PlainJSBuilder implements DictionaryBuilder {
  private view: DictionaryView;
  private loader: DictionaryLoader;

  /**
   * Create an empty PlainJSBuilder instance
   *
   * @param {string} source - Name of the dictionary file
   * @param {string} selector - A DOM selector used to find the page elements
   * @param {string} dialogId - A DOM id used to find the dialog
   * @param {string} highlight - Which terms to highlight: all | proper
   */
  constructor(sources: DictionarySource[],
              selector: string,
              dialogId: string,
              highlight: "all" | "proper",
              indexSimplified = false,
              dataLoader: IDataLoader | null = null) {
    console.log("PlainJSBuilder constructor");
    const dictionaries = new DictionaryCollection();
    this.loader = new DictionaryLoader(sources,
                                       dictionaries,
                                       indexSimplified,
                                       dataLoader);
    const config = new DictionaryViewConfig().setWithLookupInput(false);
    this.view = new DictionaryView(selector,
                                   dialogId,
                                   highlight,
                                   config,
                                   dictionaries);
  }

  /**
   * Creates and initializes a DictionaryView, load the dictionary, and scan DOM
   * elements matching the selector. If the highlight is empty or has value
   * 'all' then all words with dictionary entries will be highlighted. If
   * highlight is set to 'proper' then event listeners will be added for all
   * terms but only those that are proper nouns (names, places, etc) will be
   * highlighted. Subscribe to the Observable and get the DictionaryView when
   * it is complete.
   */
  public buildDictionary() {
    console.log("buildDictionary enter");
    const observable = this.loader.loadDictionaries();
    observable.subscribe(
      () => {
        console.log("buildDictionary subscriber");
        this.view.highlightWords();
        this.view.setupDialog();
       },
      (err) => { console.error("buildDictionary error: " + err); },
    );
    return this.view;
  }
}
