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
 * Utility for segmenting text into individual terms.
 */
export class TextParser {
    /**
     * Construct a Dictionary object
     *
     * @param {!DictionaryCollection} dictionaries - a collection of dictionary
     */
    constructor(dictionaries) {
        this.dictionaries = dictionaries;
    }
    /**
     * Segments the text into an array of individual words, excluding the whole
     * text given as a parameter
     *
     * @param {string} text - The text string to be segmented
     * @return {Array.<Term>} The segmented text as an array of terms
     */
    segmentExludeWhole(text) {
        if (!text) {
            console.log("segmentExludeWhole empty text");
            return [];
        }
        const segments = [];
        let j = 0;
        while (j < text.length) {
            let k = text.length - j;
            while (k > 0) {
                const chars = text.substring(j, j + k);
                // console.log(`segmentExludeWhole checking: ${chars} for j ${j}, k ${k}`);
                if (chars.length < text.length && this.dictionaries.has(chars)) {
                    // console.log(`segmentExludeWhole found: ${chars} for j ${j}, k ${k}`);
                    const term = this.dictionaries.lookup(chars);
                    segments.push(term);
                    j += chars.length;
                    break;
                }
                if (chars.length === 1) {
                    if (this.dictionaries.has(chars)) {
                        const t = this.dictionaries.lookup(chars);
                        segments.push(t);
                    }
                    else {
                        segments.push(new Term(chars, []));
                    }
                    j++;
                }
                k--;
            }
        }
        return segments;
    }
    /**
     * Segments the text into an array of individual words
     *
     * @param {string} text - The text string to be segmented
     * @return {Array.<Term>} The segmented text as an array of terms
     */
    segmentText(text) {
        if (!text) {
            console.log("segment_text_ empty text");
            return [];
        }
        const segments = [];
        let j = 0;
        while (j < text.length) {
            let k = text.length - j;
            while (k > 0) {
                const chars = text.substring(j, j + k);
                if (this.dictionaries.has(chars)) {
                    // console.log(`findwords found: ${chars} for j ${j}, k ${k}`);
                    const term = this.dictionaries.lookup(chars);
                    segments.push(term);
                    j += chars.length;
                    break;
                }
                if (chars.length === 1) {
                    segments.push(new Term(chars, []));
                    j++;
                }
                k--;
            }
        }
        return segments;
    }
}
