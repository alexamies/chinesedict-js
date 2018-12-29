# Demo Application
You can use the chinesedict-js module on any web or application server. These
instructions explain how to a more complex example than the initial example
using the App Engine Standard [Node.js Runtime
Environment](https://cloud.google.com/appengine/docs/standard/nodejs/runtime),
which uses the [Express](https://expressjs.com/) web framework. Actually, the
demo only uses Express for static file serving but takes advantage of the
economical container-based serving environment provided by App Engine Standard.

## Prerequisites
Create a [Google Cloud Platform](https://cloud.google.com/) (GCP)
project and install the [gcloud](https://cloud.google.com/sdk/gcloud/) command
line tool.

Set a variable for the top level project directory:
```
CDICT_HOME=`pwd`
```

## Build the dictionary
Clone the chinesenotes.com project and set an environment variable for the
location:
```
cd $CDICT_HOME/..
git clone https://github.com/alexamies/chinesenotes.com.git
CNREADER_HOME=`pwd`/chinesenotes.com
```

This contains a tab separated variable (TSV) dictionary file
[words.txt](https://github.com/alexamies/chinesenotes.com/blob/master/data/words.txt)
that will be used for this demo. Change to the build directory and build the
JSON format of the dictionary file:
```
cd $CDICT_HOME/build
node gen_dictionary.js --topic "Buddhism" $CNREADER_HOME/data/words.txt
```

This generates a words.json file that can be copied to your web dist
directory created below.

## Build the Web Client
The static files are compiled in the directory 'static'.
```
cd $CDICT_HOME/demo
npm install
```

Copy the relevant files into a dist directory:
```
mkdir -p static/dist
cp $CDICT_HOME/index.js static/dist/.
cp $CDICT_HOME/assets/chinesedict.css static/dist/.
cp node_modules/dialog-polyfill/dialog-polyfill.js static/dist/.
cp node_modules/dialog-polyfill/dialog-polyfill.css static/dist/.
```

This creates the dist directory and writes the bundled JavaScript files there.
Copy the dictionary file to the dist directory:
```
cp $CDICT_HOME/build/words.json static/dist/.
```

## Run locally
Since the application code does not use any App Engine specific features it can
be run without change using Node.js.
```
cp $CDICT_HOME
npm start
```

## Deploy to App Engine
Set the default GCP project:
```
GAE_APPLICATION=[Your project id]
gcloud config set project $GAE_APPLICATION
```

Deploy to App Engine from the demo directory to avoid deploying the full
contents of the GitHub project. You will need to do som editing of links and
reorganization of static assets.
```
cp $CDICT_HOME/demo
gcloud app deploy
```

## Example with Highlighting of Proper Nouns Only
The example in [static/highlighting.html](static/highlighting.html) demonstrates
restricting highlighting of proper nouns only. The other words are clickable
but not highlighted. This prevents the user being presented with a page filled
with highlighted elements.

Build the whole Chinese Notes dictionary
```
cd $CDICT_HOME/build
node gen_dictionary.js $CNREADER_HOME/data/words.txt
node check_dictionary.js
cd $CDICT_HOME/demo
cp $CDICT_HOME/build/words.json $CDICT_HOME/demo/static/dist/words_all.json
npm start
```

The entire Chinese Notes / NTI Reader dictionary is large. It would be ideal to
serve it compressed.