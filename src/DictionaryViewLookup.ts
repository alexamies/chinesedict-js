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
import { DictionaryViewConfig } from "./DictionaryViewConfig";
import { QueryResults } from "./QueryResults";
import { TextParser } from "./TextParser";
import { Observable } from "rxjs";
import { fromEvent } from "rxjs";

/**
 * A class for encapsulating view elements for looking up dictionary terms.
 * Fixed values are used for field ids:
 * lookupInputFormId: 'lookup_input_form', lookupInputTFId: 'lookup_input'.
 */
export class DictionaryViewLookup {
  private readonly lookupInputFormId = "lookup_input_form";
  private readonly lookupInputTFId = "lookup_input";
  private config: DictionaryViewConfig;
  private dictionaries: DictionaryCollection;

  /**
   * Creates a DictionaryViewLookup object with given config values.
   *
   * @param {!DictionaryViewConfig} config - Configuration values
   * @param {!DictionaryCollection} dictionaries - holds the dictionary data
   */
  constructor(config: DictionaryViewConfig,
              dictionaries: DictionaryCollection) {
    this.config = config;
    this.dictionaries = dictionaries;
  }

  /**
   * Initialize the input form to listen for submit events
   */
  public wire() {
    console.log("DictionaryViewLookup.init");
    const formSelector = "#" + this.lookupInputFormId;
    const form = document.querySelector(formSelector);
    const inputSelector = "#" + this.lookupInputTFId;
    const input = document.querySelector(inputSelector) as HTMLInputElement;
    const observable = new Observable((subscriber) => {
      if (form) {
        fromEvent(form, "submit")
        .subscribe((evt) => {
          evt.preventDefault();
          console.log("DictionaryViewLookup got a submit event");
          if (!this.dictionaries.isLoaded()) {
            subscriber.error("Dictionary is not loaded");
          } else {
            const parser = new TextParser(this.dictionaries);
            const terms = parser.segmentText(input.value);
            const qResults = new QueryResults(input.value, terms);
            subscriber.next(qResults);
          }
          return false;
        });
      } else {
        console.log("DictionaryViewLookup.init form not found");
        subscriber.complete();
      }
    });
    return observable;
  }
}
