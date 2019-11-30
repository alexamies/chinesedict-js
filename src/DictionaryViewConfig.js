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
import { QueryResultsView } from "./QueryResultsView";
/**
 * A class for configuring the DictionaryView, intended as input to a
 * DictionaryBuilder factory.
 */
export class DictionaryViewConfig {
    /**
     * Creates a DictionaryViewConfig object with default values:
     * lookupInputFormId: 'lookup_input_form', lookupInputTFId: 'lookup_input',
     * withLookupInput: true.
     */
    constructor() {
        this.withLookupInput = true;
        this.rSubscriber = new QueryResultsView();
    }
    /**
     * Get the subscriber to push new query results to
     *
     * @return {QueryResultsSubscriber} to push results to
     */
    getQueryResultsSubscriber() {
        return this.rSubscriber;
    }
    /**
     * Set the subscriber to push new query results to
     *
     * @param {!QueryResultsSubscriber} rSubscriber - to push results to
     * @return {DictionaryViewConfig} this object so that calls can be chained
     */
    setQueryResultsSubscriber(rSubscriber) {
        this.rSubscriber = rSubscriber;
        return this;
    }
    /**
     * If withLookupInput is true then the DictionaryView will listen for events
     * on the given HTML form and lookup and display dictionary terms in response.
     *
     * @return {!boolean} Whether to use a textfield for looking up terms
     */
    isWithLookupInput() {
        return this.withLookupInput;
    }
    /**
     * If withLookupInput is true then the DictionaryView will listen for events
     * on the given HTML form and lookup and display dictionary terms in response.
     *
     * @param {!boolean} withLookupInput - Whether to use a textfield for looking
     *                                     up terms
     * @return {DictionaryViewConfig} this object so that calls can be chained
     */
    setWithLookupInput(withLookupInput) {
        this.withLookupInput = withLookupInput;
        return this;
    }
}
