const fs         = require('fs')
const bodyParser = require('body-parser')
const glob 		 = require('glob')
const Parse      = require('parse/node')

function GrapesJS(opts){
	opts.path        			   = opts.path || '/design'
	opts.public_html_node_modules  = opts.public_html_node_modules || __dirname+'/node_modules'
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
		opts.app.use(path+'/save', this.save.bind(this) )
		opts.app.use(path+'/list', this.list.bind(this) )
		opts.app.use(path+'/load', this.load.bind(this) )
	})
	return this
}

GrapesJS.prototype.createClass = function(){
	let opts = this.opts
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

GrapesJS.prototype.list = function(req, res, next){
	let opts = this.opts
	if( this.opts.onList ) return this.opts.onList(req, res)
	var files = glob( this.opts.public_html+'/*/*.html', {}, function(err, files){
		files = files.map( (f) => f.replace(opts.public_html, '') )
		if( err ) res.send( JSON.stringify({ok:false, err}) ).end()
		else res.send( JSON.stringify(files) ).end()
	}.bind(this))
}

GrapesJS.prototype.save = function(req, res, next){
	if( this.opts.onSave ) return this.opts.onSave(req, res)
	res.send('{"not implemented (yet)":1}').end()
}

GrapesJS.prototype.load = function(req, res, next){
	if( this.opts.onLoad ) return this.opts.onLoad(req, res)
	console.dir(req.query)
	console.dir(req.body)
	res.send('{"not implemented (yet)":1}').end()
}

module.exports = (opts) => new GrapesJS(opts)
