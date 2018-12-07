# Demo Application
You can use the chinesedict-js module on any web or application server. These
instructions explain how to a more complex example than the initial example
using the App Engine Standard [Node.js Runtim
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
that we will use for this demo. Change to the build directory and build the
protobuf format of the dictionary file:
```
cd $CDICT_HOME/build
node gen_dictionary.js $CNREADER_HOME/data/words.txt
```

This generates a words.json file that can be copied to your web dist
directory created below.

## Build the Web Client
The static files are contained in the directory 'static'. Change to that
directory and build the client assets.
```
cd $CDICT_HOME/demo/static
npm install
```

This creates the dist directory and writes the bundled JavaScript files there.
Copy the dictionary file to the dist directory:
```
mkdir $CDICT_HOME/demo/static/dist
cp $CDICT_HOME/build/words.json $CDICT_HOME/demo/static/dist/.
```

## Run locally
Since the application code does not use any App Engine specific features it can
be run without change using Node.js.
```
cd $CDICT_HOME/demo
npm start
```

## Deploy to App Engine
Set the default GCP project:
```
GAE_APPLICATION=[Your project id]
gcloud config set project $GAE_APPLICATION
```

