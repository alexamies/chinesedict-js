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
 * The source of a dictionary, including where to load it from, its name,
 * and where to find out about it.
 */
export declare class DictionarySource {
    filename: string;
    title: string;
    description: string;
    /**
     * Construct a Dictionary object
     *
     * @param {!string} filename - Where to load the dictionary
     * @param {!string} title - A human readable name
     * @param {!string} description - More about the dictionary
     */
    constructor(filename: string, title: string, description: string);
}
