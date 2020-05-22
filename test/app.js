var express = require('express')
var path = require('path')
const {ParseServer,logger} = require('parse-server')
var ParseDashboard = require('parse-dashboard')
var Parse = require('parse')
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
var ParseUser= process.env.ADMIN_USER || "admin"
var ParsePassword= process.env.ADMIN_PW || "admin"
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
		filesSubDirectory: 'data/files' , 
		grapesJSDir: 'data/files/grapesjs'
	}
}

var apps     = [cfg]
var parse    = new ParseServer(cfg)

var parseDashboardSettings = {
    "apps": apps, 
    "users": [
		{
        	"user": ParseUser,
        	"pass": ParsePassword,
        	"masterKey": MasterKey,
        	"apps": [{
            	"appId": AppId
        	}] 
    	},
	],
    trustProxy:1
}

var dashboard = new ParseDashboard(parseDashboardSettings, allowInsecureHTTP)

var app = process.app = express()

require('parse-server-grapesjs')({
	cfg, 
	parse, 
	app,  
	express: require('express'), 
	onSave: (req, res) => {
		console.dir(req.body)
		res.send('{"save":true}').end()
	}, 
	onLoad: (req, res) => {
		console.dir(req.body)
		res.send('{"load":true}').end()
	}
})

// make the Parse Server available at /${appname}
app.use('/api',     parse)

// make the Parse Dashboard available at /dashboard
app.use('/admin', dashboard)

app.use(express.static(path.join(process.cwd(), '/public')))

var httpServer = require('http').createServer(app)
httpServer.listen(PORT, undefined, undefined, () => {
  console.log("admin login/pw: admin/admin")
  console.log("=> listening at "+HOST+":"+PORT+"/")
})
