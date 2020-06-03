const fs         = require('fs')
const bodyParser = require('body-parser')
const glob 		 = require('glob')

function GrapesJS(opts){
	opts.path        			   = opts.path || '/design'
	opts.public_html_node_modules  = opts.public_html_node_modules || __dirname+'/../'
	opts.grapesjs_html             = opts.grapesjs_html || __dirname+'/html'
	this.opts = opts
	this
	.addRoutes()
	.createClass()
}

GrapesJS.prototype.addRoutes = function(){
	let opts = this.opts
	opts.app.use(bodyParser.json({limit:'200mb'}) )
	this.opts.apps.map( (app) => {
		var path = opts.path+'/'+app.appId
		opts.app.get( path+'?[\/]',  (req, res, next) => {
			res.header('Content-type', 'text/html')
			var html = fs.readFileSync( opts.grapesjs_html+'/index.html' )
			             .toString()
			             .replace(/Parse.initialize.*/, `Parse.initialize( '${app.appId}', '${app.javascriptKey}'); Parse.serverURL = '${app.serverURL}';` )
			res.send( html ).end()
		})
		opts.app.use(path,  opts.express.static( opts.grapesjs_html ) )
		opts.app.use(path+'/node_modules',  opts.express.static( opts.public_html_node_modules ) )
	})
	return this
}

GrapesJS.prototype.createClass = function(){
	let opts = this.opts
	const Parse = this.opts.Parse
	this.opts.apps.map( (app) => {
		Parse.initialize( app.appId,  app.javascriptKey,  app.masterKey )
		Parse.serverURL = app.serverURL
		var schema = new Parse.Schema("Template")
		schema.get()
		.then( () => false )
		.catch( (e) => {
			console.log("creating Template-class for Parse app: "+app.appId )
			schema.addString("file")
			schema.addObject("data")
			schema.save()
			.then( () => false )
			.catch( console.error )
		})
	})
	return this
}

module.exports = (opts) => new GrapesJS(opts)
