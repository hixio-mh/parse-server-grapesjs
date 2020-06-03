
![](https://github.com/coderofsalvation/parse-server-grapesjs/raw/master/demo.gif)

> WARNING: beta

# Usage

* `npm install parse-server-grapesjs --save`


```
    var app = process.app = express()
	const cfg = {
		databaseURI: DatabaseURI,
		appId: AppId,
		restAPIKey: RestAPIKey,
		fileKey: MyFileKey,
		javascriptKey: process.env.KEY_JS || 'test',

		....

		port: PORT, 
		options: { 
			filesSubDirectory: 'data/files' , 
		}
	}
    
+++ require('parse-server-grapesjs')({
+++ 	[cfg],                       // multiple apps! 
+++ 	app,  
+++ 	Parse: require('parse/node'), 
+++ 	express: require('express')
+++ })
    ...
```

> Profit! now surf to 'http://localhost:8081/design' e.g.

It will automatically create a `Template`-parseClass and save templates to it.<br>
This plugin is (intentionally) not writing HTML-files to a public folder.
This makes it usable for many types of parse setups:

* save to database and/or html-file (to host frontend on the parse-server)
* save to database and fetch from a github/gitlab CI-worker to host it on a GH/GL page.
* save to database and run a Parse-JOB or webhook whenever a template is updated

## I want to run a different / my patched version of the grapesjs

You can use the shipped version as a starting-point:

```
$ npm install parse-server-grapesjs --save
$ cp -r node_modules/parse-server-grapesjs/html myhtml

```

now pass the extra init option:

```
    var app = process.app = express()
    
+++  require('parse-server-grapesjs')({
+++    ...
!!!      path: '/myeditor', 
!!!    	 grapesjs_html: __dirname+'/myhtml', 

         ...
```

## Important 

By default there are no permissions installed (anyone can create/read/delete templates).
Make sure you setup Class-based permissions for the `Template`-class to restrict this.

### Thoughts / future 

If you're using a multiple-parse-app-in-one-setup, I think you definately want to setup gitlab/github pages, and have CI fetch the templates (and write them as .html-files).
Just think about it, the Parse Javascript-API is so flexible, hosting the HTML elsewhere is much better serverload / bandwidth wise.
