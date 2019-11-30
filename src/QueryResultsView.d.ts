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
import { QueryResults } from "./QueryResults";
import { QueryResultsSubscriber } from "./QueryResultsSubscriber";
/**
 * A class for displaying dictionary query results that might consist of
 * multiple terms. Fixed values of field ids are used:
 * queryResultsDiv: 'query_results_div',
 * queryResultsHeader: 'query_results_header',
 * queryMessageDiv: 'query_message_div'
 * queryResultsList: 'query_results_list',
 */
export declare class QueryResultsView implements QueryResultsSubscriber {
    private queryResultsDiv;
    private queryResultsHeader;
    private queryMessageDiv;
    private queryResultsList;
    /**
     * Create a QueryResultsView object
     */
    constructor();
    /**
     * Respond to an error
     *
     * @param {!string} message - an error message
     */
    error(message: string): void;
    /**
     * Shows the results
     *
     * @param {!QueryResults} dictionaries - holds the query results
     */
    next(qResults: QueryResults): void;
}
