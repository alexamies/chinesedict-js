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
import { Term } from "./Term";
/**
 * Utility for segmenting text into individual terms.
 */
export declare class TextParser {
    private dictionaries;
    /**
     * Construct a Dictionary object
     *
     * @param {!DictionaryCollection} dictionaries - a collection of dictionary
     */
    constructor(dictionaries: DictionaryCollection);
    /**
     * Segments the text into an array of individual words, excluding the whole
     * text given as a parameter
     *
     * @param {string} text - The text string to be segmented
     * @return {Array.<Term>} The segmented text as an array of terms
     */
    segmentExludeWhole(text: string): Term[];
    /**
     * Segments the text into an array of individual words
     *
     * @param {string} text - The text string to be segmented
     * @return {Array.<Term>} The segmented text as an array of terms
     */
    segmentText(text: string): Term[];
}
