## Integration with Typescript
Status: Preliminary

## Prerequisites
The integration is based on [Typescript
modules](https://www.typescriptlang.org/docs/handbook/modules.html), which share
the same concept of modules as ECMAScript 2015 (ES6).

Install Typescript
```
npm install -g typescript
```

Copy the asset files to this directory.
```
cp ../words.json assets/.
cp ../demo_app.css assets/..
cp ../chinesedict.css assets/..
```

Compile the demo app
```
tsc -m es2015 --target es2015 myapp.ts
```

If you have errors then try tracing for module resolution
```
tsc --traceResolution -m es2015 --target ES6 myapp.ts
```

Run a web server to serve the page. Again, for example, using a Docker Apache 2
image:
```
docker run -itd --rm -p 8080:80 --name demo_app  \
  --mount type=bind,source="${PWD}",target=/usr/local/apache2/htdocs \
  httpd:2.4
```

Open the index.html file in Chrome at http://localhost:8080/index.html
