var http = require('http')
var fs = require('fs')
var path = require('path')

var hostname = '0.0.0.0'
var port = 3000

var server = http.createServer()
server.on('request', (req, res) => {
    const { method, url, headers } = req
    console.log(`${method} request for ${url} received`)
    
    if(url == "/") {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        fs.readFile(path.join(__dirname, "index_earthquake_demo.html"), 'utf8', (error, data) => {
            if(!error) {
                console.log(data.toString())
                res.write(data.toString())
                res.end()
            }
        })
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/` )
})