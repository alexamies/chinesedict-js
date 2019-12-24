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
 
/**
 * Uses Browser local storage to save and retrieve the dictionary.
 */
export class Storage {
  private readonly KEY = "cnotesdict";

  /**
   * Saves the data to local storage
   * @param {!string} data -  Stringified data
   * @return {Boolean} True if the data was saved successfully
   */
  public save(data: string) {
    try {
      const storage = window["localStorage"];
      storage.setItem(this.KEY, data);
      return true;
    } catch(e) {
      console.log(`Unable to save dictionary data: ${e.code}, ${e.name}`);
      return false;
    }
  }

  /**
   * Saves the data to local storage
   * @return {string} data -  Stringified data
   */
  public read() {
    try {
      const storage = window["localStorage"];
      return storage.getItem(this.KEY);
    } catch(e) {
      console.log(`Unable to save dictionary data: ${e.code}, ${e.name}`);
      return null;
    }
  }
}
