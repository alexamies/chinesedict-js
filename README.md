# Chinese Dictionary JavaScript Module
Status: early prototype

An ECMAScript 2015 (ES6) browser module for showing Chinese-English dictionary
terms in web pages. The JavaScript code will scan Chinese text, highlight the
words contained in the dictionary. When a user mouses over the dictionary terms
then a tooltip with the English equivalent will be displayed. When a user clicks
on a term then the other details of the dictionary term will be shown.

The JavaScript module does not require a web framework, like Material or React,
but it should be compatible with those. It is designed and built using plain
JavaScript and to be used with modern browsers.

Only traditional Chinese text is supported at present.

## Prerequisites
Install Node.js. Initialize your public HTML directory:
```
mkdir public_html
cd public_html
npm init -y
```

## Install
Get the chinesedict-js JavaScript module with the command:
```
npm install @alexamies/chinesedict-js
```

The files from the GitHub project will be located in the directory
```
node_modules/@alexamies/chinesedict-js
```

## Use
You can import the chinesedict-js module into your web pages with a JavaScript
[import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
statement.

You may want to create a dist directory to bundle files served but these
instructions simply serve from the node_modules/@alexamies/chinesedict-js/
directory. For example, bundling into directory dist:
```
mkdir dist
cp node_modules/@alexamies/chinesedict-js/index.js dist/.
cp node_modules/@alexamies/chinesedict-js/chinesedict.css dist/.
```

Make sure that you reference your own JavaScript code in your HTML page using a
[script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
element with type="module"
```
<script src="demo_app.js" type="module"></script>
```

In demo_app.js, add JavaScript code to import the ES6 module:
```
import ChineseDict from '/dist/index.js';
new ChineseDict('words.json', '.textbody', 'dict-dialog');
```

The parameters to the constructor of ChineseDict are

1. filename - Name of the dictionary JSON file
2. selector - A DOM selector for the Chinese text to be segmented
3. dialog_id - A DOM id used to find the dialog

where 'div_id' is select for the HTML elements containing the Chinese text.

Also, in your CSS file import the stylesheet:
```
@import '/node_modules/@alexamies/chinesedict-js/chinesedict.css';
```

The [dialog-polyfill](https://github.com/GoogleChrome/dialog-polyfill) is used
for cross-browser compatibility. The dialog-polyfill files needs to be copied
manually at the moment. On the command line:
```
npm install dialog-polyfill
cp node_modules/dialog-polyfill/dialog-polyfill.js dist/.
cp node_modules/dialog-polyfill/dialog-polyfill.css dist/.
```

The dialog-polyfill is not used as a module. Load it into your HTML page:
```
<script src="/dist/dialog-polyfill.js"></script>
```

Also, import the stylesheet into your CSS file with a
[CSS import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)
statement:
```
@import '/dist/dialog-polyfill.css';
```

## Simple Demo
The file index.html is ready to be served as a demo web page. The easiest way to
run this yourself is to clone it from GitHub:
```
git clone https://github.com/alexamies/chinesedict-js.git
cd chinesedict-js.git
```

It needs to be served on a web server (not just opened in a browser from the
local file system). For example, using a Docker Apache 2 image:
```
docker run -itd --rm -p 8080:80 --name demo_app  \
  --mount type=bind,source="$(pwd)",target=/usr/local/apache2/htdocs \
  httpd:2.4
```

Open the index.html file in a web browser at http://localhost:8080/index.html
Click on one of the highlighted words. If everything is ok you should see a
dialog like this (on Chrome):

<img
src='https://github.com/alexamies/chinesedict-js/blob/master/screenshot.png?raw=true'/>

## More Complex Demo
A more complex example is given in the [demo](demo/) directory. See this at
[chinesedictdemo.appspot.com](https://chinesedictdemo.appspot.com).

## Customize
You can customize the module with your own dictionary, HTML content, and styles.
The dictionary should be structured the same as the example words.json file
provided. If you have not got your own dictionary then you can use the [NTI
Buddhist Text Reader Project](https://github.com/alexamies/buddhist-dictionary),
or [Chinese Notes](https://github.com/alexamies/chinesenotes.com)
Chinese-English dictionary, which may be reused under the [Creative Commons
Attribution-Share Alike 3.0 License -
CCASE 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

The build/gen_dictionary.js file is Nodejs command line utility to generate
the dictionary file. This utility assumes the tab separated variable format of
the words.txt file in the [Chinese
Notes](https://github.com/alexamies/chinesenotes.com) project. To generate the
dictionary use the command

```
cd build
npm install
node gen_dictionary.js words.tsv
```

To restrict the entries to a specific topic use the --topic argument. For
example,
```
node gen_dictionary.js --topic "Literary Chinese" words.tsv
```

The dictionary file is stored in JSON format.

## Integration
### Typescript
A preliminary prototype for Typescript integration is given at
[typescript/README.md](typescript/README.md).

### Angular
A preliminary prototype for Angular integration is given at
[angular/README.md](angular/README.md).

## Test
### Cross Browser Support
Cross browser support is provided for the HTML
[dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
using [dialog-polyfill](https://github.com/GoogleChrome/dialog-polyfill) since
the dialog element is not yet supported natively by Edge or Safari.

Modern browsers ES6 style JavaScript including modules. If you want to support
older browsers you will need to do that with
[Babel presets](https://babeljs.io/docs/en/presets) or Webpack compilation.

### Mobile Device Support
The module can be used on web pages designed for mobile devices. 

### Performance
Bundling and minification with WebPack or Babel may help but their current ES6
module support lags behind browsers. Use of common JS modules does not perform
adequately, except for very small dictionaries and text sizes.
