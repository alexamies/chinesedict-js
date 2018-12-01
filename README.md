# Chinese Dictionary JavaScript Module
This project contains a client JavaScript module for showing keywords in a
static Chinese web page. The JavaScript module should work on any web page.
It does not require a web frameworks, like Material or React. It is designed
and built using plain ES6 JavaScript and compiled into a bundle to be compatible
with multiple browsers.

## Prerequisities
Install [Nodejs](https://nodejs.org/en/).

## Install
Get the chinesedict-js module with this command:
```
npm install @alexamies/chinesedict-js
```

Add JavaScript code to import the Common JavaScrope module in your web
application browser code and use it:
```
const findwords = require('./chinesedict');
findwords('div_id');
```

where 'div_id' is select for the HTML elements containing the Chinese text.
See the example client_app.js. Then compile the chinesedict-js into your code:
```
npm install
npm run build
```

## Use
Open the index.html file in a web browser to test or un in a web server.
 