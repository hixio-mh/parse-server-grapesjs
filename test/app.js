var express = require('express')
var path = require('path')
const {ParseServer,logger} = require('parse-server')
var Parse = require('parse/node')
var fs = require('fs')


var id = process.env.APP || 'test'
var PORT = process.env.PORT   || 8081
var HOST = process.env.HOST   || 'http://localhost'
var ServerURL=process.env.URL_API || HOST +":"+PORT+"/api"
var MasterKey= process.env.PARSE_MASTERKEY ? process.env.PARSE_MASTERKEY : (process.env.PARSE_MASTERKEY = "test")
var DatabaseURI = process.DBURI || 'postgres://postgres:postgres@localhost:5432/parse_'+id
var AppId=id
var MyFileKey=process.env.FILEKEY || "myFileKey"
var RestAPIKey= process.env.RESTAPIKEY || "restAPIKey"
var AppName=id
var allowInsecureHTTP = true
var runtests = process.env.RUNTESTS

const cfg = {
	engine: {'memory': { count: 1000}}, 
    databaseURI: DatabaseURI,
    appId: AppId,
    restAPIKey: RestAPIKey,
    fileKey: MyFileKey,
    javascriptKey: process.env.KEY_JS || 'test',
    masterKey: MasterKey,
    serverURL: ServerURL,
    publicServerURL: ServerURL,
   // cloud: __dirname + '/cloud/index.js',
    appName: AppName,
    appNameForURL: AppName,
    verifyUserEmails: false,
	port: PORT, 
    filesAdapter: {
        module: 'parse-server-fs-store-adapter',
    }, 
	options: { 
		filesSubDirectory: 'data/files/'+AppId
	}
}

var apps     = [cfg]
var parse    = new ParseServer(cfg)

var app = process.app = express()

require('./../index')({
	apps, 
	parse, 
	app,  
	express: require('express'), 
	public_html:   __dirname+'/html' 
	/*
	path:         '/design', 
	grapesjs_html: __dirname+'/html/mygrapesjs', 
	onList: (req, res) => {
		console.dir(req.body)
		res.send('{"save":true}').end()
	},  
	onSave: (req, res) => {
		console.dir(req.body)
		res.send('{"save":true}').end()
	}, 
	onLoad: (req, res) => {
		console.dir(req.body)
		res.send('{"load":true}').end()
	}
	*/
})

// make the Parse Server available at /${appname}
app.use('/api',     parse)

app.use(express.static(path.join(process.cwd(), '/public')))

var httpServer = require('http').createServer(app)
httpServer.listen(PORT, undefined, undefined, () => {
	console.log("admin login/pw: admin/admin")
	console.log("=> listening at "+HOST+":"+PORT+"/")

	Parse.initialize( cfg.appId,  cfg.javascriptKey )
	// create first user 
	var user = new Parse.User();
	user.set("username",  "test");
	user.set("password",  "test");
	user.set("email",  "your@email.com")
	user.signUp()
	.then( () => console.log("test user created: login/pw: your@email.com/test") )
	.catch( (err) => console.log(err) )

})
