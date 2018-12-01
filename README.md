# Chinese Dictionary JavaScript Module
Status: early prototype

This project contains a client JavaScript module for showing keywords in a
static Chinese web page. The JavaScript module should work on any web page.
It does not require a web frameworks, like Material or React. It is designed
and built using plain ES6 JavaScript and compiled into a bundle to be compatible
with multiple browsers.

## Prerequisities
Install [Nodejs](https://nodejs.org).

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
Serve index.html as a static file on a web server. For example, using a Docker
Apache 2 image:
```
docker run -itd --rm -p 8080:80 --name demo_app  \
  --mount type=bind,source="$(pwd)",target=/usr/local/apache2/htdocs \
  httpd:2.4
```
Open the index.html file in a web browser at http://localhost/index.html
Click on one of the highlighted words. If everything is ok you should see a
dialog like on the included screenshot.png. To do: make a nicer dialog.

## Customize
You can customize the module with your own dictionary, HTML content, and styles.

## Unit Tests
```
npm test
```
