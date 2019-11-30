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
 * Wraps results from a dictionary query.
 */
export declare class QueryResults {
    query: string;
    results: Term[];
    /**
     * Construct a QueryResults object
     *
     * @param {!string} query - The query leading to the results
     * @param {!Array<Term>} results - The results found
     */
    constructor(query: string, results: Term[]);
}
