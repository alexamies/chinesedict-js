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
import { DictionaryEntry } from "./DictionaryEntry";
import { Term } from "./Term";
import { WordSense } from "./WordSense";
import { Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
/**
 * Loads the dictionaries from source files.
 */
export class DictionaryLoader {
    /**
     * Create an empty DictionaryLoader instance
     *
     * @param {string} sources - Names of the dictionary files
     * @param {DictionaryCollection} dictionaries - To load the data into
     */
    constructor(sources, dictionaries) {
        console.log("DictionaryLoader constructor");
        this.sources = sources;
        this.headwords = new Map();
        this.dictionaries = dictionaries;
    }
    /**
     * Returns an Observable that will complete on loading all the dictionaries
     */
    loadDictionaries() {
        console.log("loadDictionaries enter");
        const observable = new Observable((subscriber) => {
            const sources = this.sources;
            let numLoaded = 0;
            for (const source of sources) {
                const filename = source.filename;
                console.log(`loadDictionaries loading ${filename}`);
                if (filename) {
                    const reqObs = ajax.getJSON(filename);
                    const subscribe = reqObs.subscribe((res) => {
                        console.log(`loadDictionaries: for ${filename}`);
                        this.load_dictionary_(source, res);
                        numLoaded++;
                        if (numLoaded >= sources.length) {
                            console.log(`loadDictionaries: ${this.headwords.size} terms`);
                            this.dictionaries.setHeadwords(this.headwords);
                            subscriber.next(numLoaded);
                            subscriber.complete();
                        }
                    }, (error) => {
                        console.log(`Error fetching dictionary: ${error}`);
                        subscriber.next(error);
                        return of(error);
                    });
                }
                else {
                    subscriber.next("Error no filename provided");
                }
            }
        });
        return observable;
    }
    /**
     * @private
     * Deserializes the dictionary from protobuf format. Expected to be called by
     * a builder in initializing the dictionary.
     *
     * @param {!Array<object>} dictData - An array of dictionary term objects
     */
    load_dictionary_(source, dictData) {
        console.log(`load_dictionary_ terms from ${source.title}`);
        for (const entry of dictData) {
            const traditional = entry.t;
            const sense = new WordSense(entry.s, entry.t, entry.p, entry.e, entry.g, entry.n);
            const dictEntry = new DictionaryEntry(traditional, source, [sense], entry.h);
            if (!this.headwords.has(traditional)) {
                // console.log(`Loading ${ traditional } from ${ source.title } `);
                const term = new Term(traditional, [dictEntry]);
                this.headwords.set(traditional, term);
            }
            else {
                // console.log(`Adding ${ traditional } from ${ source.title } `);
                const term = this.headwords.get(traditional);
                term.addDictionaryEntry(sense, dictEntry);
            }
        }
    }
}
