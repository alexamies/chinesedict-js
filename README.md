# Chinese Dictionary JavaScript Module
Status: early prototype

This project contains an ES6 JavaScript browser module for showing keywords in a
static Chinese web page. The JavaScript module should work on any web page.
It does not require a web framework, like Material or React. It is designed
and built using plain JavaScript and compiled into a bundle to be compatible
with modern browsers.

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
src='https://github.com/alexamies/chinesedict-js/blob/master/screenshot.png'/>

Instructions for bundling in your web application are described below.

See a more complex demo at <a href='https://chinesedictdemo.appspot.com'
>chinesedictdemo.appspot.com</a>.

## Prerequisities
Install [Nodejs](https://nodejs.org). set it up in your own web application
directory with the command
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

You can also clone it from GitHub:
```
git clone https://github.com/alexamies/chinesedict-js.git
cd chinesedict-js.git
```

You may want to create a dist directory to bundle files served but these
instructions simply serve from the node_modules/@alexamies/chinesedict-js/
directory. For example, bundling into directory dist:
```
mkdir dist
cp node_modules/@alexamies/chinesedict-js/index.js dist/.
cp node_modules/@alexamies/chinesedict-js/chinesedict.css dist/.
```

Create a JavaScript module for your own code and import it into your HTML page:
```
&lt;script src="demo_app.js" type="module"&gt;&lt;/script&gt;
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
&lt;script src="/dist/dialog-polyfill.js"&gt;&lt;/script&gt;
```

Also, import the stylesheet:
```
@import '/dist/dialog-polyfill.css';
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
A sample webpack configuration file is included. However, that is not used at
present because their dependence on Common JS modules worsens performance.

### Mobile Support
Browser testing on mobile devices is a TODO. You may need to add your own
styles. 

### Performance
Bundling and minification with WebPack or Babel may help but, as mentioned
above, their current ES6 module support lags behind browsers.