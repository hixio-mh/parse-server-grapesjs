var bodyParser = require('body-parser')
var fs         = require('fs')

function GrapesJS(opts){
	opts.path        			   = opts.path || '/design'
	opts.public_html               = opts.public_html || __dirname+'/html'
	opts.public_html_node_modules  = opts.public_html_node_modules || __dirname+'/node_modules'
	this.opts = opts 
	this.addRoutes()
}

GrapesJS.prototype.addRoutes = function(){
	let opts = this.opts
	opts.app.use( bodyParser.json({limit:'200mb'}) )
	opts.app.use(opts.path+'/node_modules',  opts.express.static( opts.public_html_node_modules ) )
	opts.app.use(opts.path+'/save', this.save.bind(this) )
	opts.app.use(opts.path,  opts.express.static( opts.public_html ) )
}

GrapesJS.prototype.save = function(req, res, next){
	if( this.opts.onSave ) return this.opts.onSave(req, res)
	res.send('{"not implemented (yet)":1}').end()
}
GrapesJS.prototype.load = function(req, res, next){
	if( this.opts.onLoad ) return this.opts.onLoad(req, res)
	res.send('{"not implemented (yet)":1}').end()
}

module.exports = (opts) => new GrapesJS(opts)
