let express = require('express')

function GrapesJS(opts){
	opts.path        = opts.path || '/design'
	opts.public_html = opts.public_html || __dirname+'/html'
	this.opts = opts 
	app.use(opts.path+'/save',  this.middleware)
	app.use(opts.path,  express.static( opts.public_html )
}

GrapesJS.prototype.middleware = function(req, res, next){

}

module.exports = new GrapesJS()
