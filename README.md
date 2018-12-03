# Chinese Dictionary JavaScript Module
Status: early prototype

This project contains a client JavaScript module for showing keywords in a
static Chinese web page. The JavaScript module should work on any web page.
It does not require a web frameworks, like Material or React. It is designed
and built using plain ES6 JavaScript and compiled into a bundle to be compatible
with multiple browsers.

## Prerequisities
Install [Nodejs](https://nodejs.org). Set it up with the command
```
npm init -y
```

## Install
Get the chinesedict-js JavaScript module with the command:
```
npm install git+https://github.com/alexamies/chinesedict-js.git
```

The files from the GitHub project will be located in the directory
```
node_modules/@alexamies/chinesedict-js
```

If you want to build examples using the templates here then it may be more
convenient to clone it from GitHub:
```
git clone https://github.com/alexamies/chinesedict-js.git
cd chinesedict-js.git
```

Add JavaScript code to import the Common JavaScrope module in your web
application browser code and use it:
```
const ChineseDict = require('./chinesedict.js');
new ChineseDict('words.json', '.textbody', 'dict-dialog');
```

The parameters to the constructor of ChineseDict are

1. filename - Name of the dictionary file
2. selector - A DOM selector for the Chinese text to be segmented
3. dialog_id - A DOM id used to find the dialog

See the file index.html for example use and a template for your project.

where 'div_id' is select for the HTML elements containing the Chinese text.
See the example client_app.js. Then compile the chinesedict-js into your code:
```
npm install
npm run build
```

The dialog-polyfill.css file needs to be copied manually at the moment:
```
cp node_modules/dialog-polyfill/dialog-polyfill.css dist/.
```

## Use
Serve index.html as a static file on a web server. For example, using a Docker
Apache 2 image:
```
docker run -itd --rm -p 8080:80 --name demo_app  \
  --mount type=bind,source="$(pwd)",target=/usr/local/apache2/htdocs \
  httpd:2.4
```
Open the index.html file in a web browser at http://localhost/index.html
Click on one of the highlighted words. If everything is ok you should see a
dialog like this (on Chrome):

<img
src='https://github.com/alexamies/chinesedict-js/blob/master/screenshot.png'/>

## Customize
You can customize the module with your own dictionary, HTML content, and styles.
The dictionary should be structured the same as the example words.pb file
provided, which may be reused under the [Creative Commons Attribution-Share
Alike 3.0 License - CCASE 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

The build/gen_dictionary.js file is Nodejs command line utility to generate
the dictionary file. To generate the dictionary use the command

```
cd build
npm install
node gen_dictionary.js 
```

The dictionary file is stored and read with
[Protobuf](https://developers.google.com/protocol-buffers/) in 
[proto3](https://developers.google.com/protocol-buffers/docs/proto3) format.
You can use your own dictionary or you can convert a dictionary like 
[words.txt](https://github.com/alexamies/chinesenotes.com/tree/master/data/words.txt)
from tab separated variable format to the format required here.

## Develop
To modify the dictionary format, edit the .proto file and use the protoc
compiler to generate JavaScript libraries:
```
protoc --js_out=import_style=commonjs,binary:. chinesedict.proto
```

The generated code is in the file chinesedict_pb.js. See the [JavaScript
Generated
Code](https://developers.google.com/protocol-buffers/docs/reference/javascript-generated)
guide for details on the generation of the protobuf JavaScript files in
CommonJS import style.

## Test
### Cross Browser Support
Cross browser support is provided for the HTML
[dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
using [dialog-polyfill](https://github.com/GoogleChrome/dialog-polyfill) since
the dialog element is not yet supported natively by Edge or Safari.

Cross compatibility of the ES6 style JavaScript and Common JS modules with the
[Babel presets](https://babeljs.io/docs/en/presets) used in Webpack compilation.

### Unit Testing
Run unit tests in Mocha with the command
```
npm test
```

### Mobile Support
Browser testing on mobile devices is a TODO. You may need to add your own
styles. 
