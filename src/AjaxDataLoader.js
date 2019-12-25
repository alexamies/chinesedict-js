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
import { ajax } from "rxjs/ajax";
/**
 * Loads data from source files remotely with AJAX
 */
export class AjaxDataLoader {
    /**
     * Returns an Observable that will complete on loading of the data source
     * @param {string} filename - File name of the source
     * @return {Observable} will complete after loading
     */
    getObservable(filename) {
        return ajax.getJSON(filename);
    }
}
