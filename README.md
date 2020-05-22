![](https://github.com/coderofsalvation/parse-server-grapesjs/raw/master/demo.gif)

# Usage

* `npm install parse-server-grapesjs --save`


```
    var app = process.app = express()
	const cfg = {
		engine: {'memory': { count: 1000}}, 
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
    
+++  require('parse-server-grapesjs')({
+++     path:'/design'
+++ 	cfg, 
+++ 	parse, 
+++ 	app,  
+++ 	express: require('express'), 
+++ 	onSave: (req, res) => {
+++ 		console.dir(req.body)
+++ 		res.send('{"save":true}').end()
+++ 	}, 
+++ 	onLoad: (req, res) => {
+++ 		console.dir(req.body)
+++ 		res.send('{"load":true}').end()
+++ 	}
+++ })
    
    ...
```

> Profit! now surf to 'http://localhost:8081/design' e.g.

saving/loading has intentionally left up to you. This makes it usable for many types of parse setups (save to file, db,  both?).

## I want to run my patched version of grapesjs

You can:

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
!!!      public_html: '/myhtml',
!!!      public_html_node_modules: __dirname+'/node_modules'
+++    ...
+++ })
    
    ...
```

### Thoughts / future 

* push to github/bitbucket/gitlab page
