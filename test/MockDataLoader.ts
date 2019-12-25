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

import { IDataLoader } from "../src/IDataLoader";
import { JSONDictEntry } from "../src/DictionaryLoaderHelper";
import { Observable } from "rxjs";

/**
 * Loads mock data from memory
 */
export class MockDataLoader implements IDataLoader {
  private dataMap: Map<string, string>;

  /**
   * Create a MockDataLoader instance
   *
   * @param {string[]} keys - The key for the dictionary data
   * @param {string[]} jsonStrArr - The stringified JSON
   */
  constructor(keys: string[], 
              jsonStrArr: string[]) {
    console.log("MockDictionaryLoader constructor");
    this.dataMap = new Map<string, string>();
    let i = 0;
    for (const key of keys) {
      this.dataMap.set(key, jsonStrArr[i]);
      i++;
    }
  }

  /**
   * Returns an Observable that will complete on loading of the data source
   * @param {string} filename - File name of the source
   * @return {Observable} will complete after loading
   */
  public getObservable(filename: string): Observable<unknown> {
  	console.log(`MockDataLoader.getObservable filename ${filename}`);
    const observable = new Observable((subscriber) => {
    	const data = JSON.parse(this.dataMap.get(filename));
    	subscriber.next(data as JSONDictEntry[]);
    	subscriber.complete();
    });
    return observable;
  }

}
