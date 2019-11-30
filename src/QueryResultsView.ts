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
import { Observable } from "rxjs";

/**
 * A class for displaying dictionary query results that might consist of
 * multiple terms. Fixed values of field ids are used:
 * queryResultsDiv: 'query_results_div',
 * queryResultsHeader: 'query_results_header',
 * queryMessageDiv: 'query_message_div'
 * queryResultsList: 'query_results_list',
 */
export class QueryResultsView implements QueryResultsSubscriber {
  private queryResultsDiv: HTMLElement;
  private queryResultsHeader: HTMLElement;
  private queryMessageDiv: HTMLElement;
  private queryResultsList: HTMLElement;

  /**
   * Create a QueryResultsView object
   */
  constructor() {
    this.queryResultsDiv = (document.getElementById("query_results_div") as HTMLElement);
    this.queryResultsHeader = (document.getElementById("query_results_header") as HTMLElement);
    this.queryMessageDiv = (document.getElementById("query_message_div") as HTMLElement);
    this.queryResultsList = (document.getElementById("query_results_list") as HTMLElement);
  }

  /**
   * Respond to an error
   *
   * @param {!string} message - an error message
   */
  public error(message: string) {
    console.log("QueryResultsView.error enter");
    this.queryResultsHeader.style.display = "none";
    while (this.queryResultsList.firstChild) {
      this.queryResultsList.removeChild(this.queryResultsList.firstChild);
    }
    this.queryMessageDiv.innerHTML = message;
  }

  /**
   * Shows the results
   *
   * @param {!QueryResults} dictionaries - holds the query results
   */
  public next(qResults: QueryResults) {
    console.log("QueryResultsView.next enter");
    this.queryResultsHeader.style.display = "block";
    while (this.queryResultsList.firstChild) {
      this.queryResultsList.removeChild(this.queryResultsList.firstChild);
    }
    const r = qResults.results;
    const msg = `${ r.length } terms found for query ${ qResults.query }`;
    this.queryMessageDiv.innerHTML = msg;

    const tList = document.createElement("ul");
    r.forEach( (term) => {
      const entries = term.getEntries();
      const cn = entries[0].getChinese();
      const pinyin = entries[0].getPinyin();
      const en = entries[0].getEnglish();
      const li = document.createElement("li");
      const txt = `${ cn } ${ pinyin } - ${ en }`;
      const tNode = document.createTextNode(txt);
      li.appendChild(tNode);
      tList.appendChild(li);
    });
    this.queryResultsList.appendChild(tList);
  }
}
