# Chinese Dictionary JavaScript Module
Status: early prototype

An ES6 JavaScript browser module for showing Chinese-English dictionary terms
in a static Chinese web page. The JavaScript module does not require a web
framework, like Material or React, but it should be compatible with those. It is
designed and built using plain JavaScript to be used with modern browsers.

## Prerequisites
Install Node.js. Initialize it in your public HTML directory:
```
mkdir public_html
cd public_html
npm init
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

You can also clone it from GitHub:
```
git clone https://github.com/alexamies/chinesedict-js.git
cd chinesedict-js.git
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
The file index.html is ready to be served as a demo web page. It needs to be
served on a web server (not just opened in a browser from the local file
system). For example, using a Docker Apache 2 image:
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

Instructions for bundling in your web application are described below.

See a more complex demo at
[chinesedictdemo.appspot.com](https://chinesedictdemo.appspot.com).

## Prerequisities
Install [Nodejs](https://nodejs.org). set it up in your own web application
directory with the command
```
npm init -y
```

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
node gen_dictionary.js words.tsv
```

The dictionary file is stored and read JSON format.
You can use your own dictionary or you can convert a dictionary like 
[words.txt](https://github.com/alexamies/chinesenotes.com/tree/master/data/words.txt)
from tab separated variable format to the format required here.

A more complex example is given in the [demo](demo/) directory.

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
Bundling and minification with WebPack or Babel may help but, as mentioned
above, their current ES6 module support lags behind browsers.