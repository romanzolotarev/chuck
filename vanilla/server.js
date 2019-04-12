const fs = require('fs')
const http = require('http')
const path = require('path')
const url = require('url')

const index = 'index.html'

const port = process.argv[2]
if (port === undefined) {
  console.error(
    `usage: ${path.parse(process.argv[0]).base} ${
      path.parse(process.argv[1]).base
    } <port>`
  )
  process.exit(1)
}

http
  .createServer((req, res) => {
    const parsedUrl = url.parse(req.url)
    const pathname = `.${parsedUrl.pathname}`

    console.log(JSON.stringify(parsedUrl.pathname))
    fs.exists(pathname, exist => {
      if (!exist) {
        res.statusCode = 404
        const message = `${pathname}: not found`
        console.log(`${res.statusCode} ${req.method} ${req.url} ${message}`)
        res.end(`${message}`)
        return
      }

      const getFilename = p => {
        if (fs.statSync(p).isDirectory()) {
          return `${p}/${index}`
        }
        return `${p}`
      }

      const filename = getFilename(pathname)

      const afterRead = (err, data) => {
        const ext = path.parse(filename).ext
        const mimeTypes = {
          '.css': 'text/css',
          '.html': 'text/html',
          '.ico': 'image/x-icon',
          '.jpeg': 'image/jpeg',
          '.jpg': 'image/jpeg',
          '.js': 'text/javascript',
          '.json': 'application/json',
          '.pdf': 'application/pdf',
          '.png': 'image/png',
          '.svg': 'image/svg+xml'
        }
        if (err) {
          res.statusCode = 500
          const message = `${filename}: can't open`
          console.log(`${res.statusCode} ${req.method} ${req.url} ${message}`)
          res.end(`${message}`)
        } else {
          res.setHeader('Content-type', mimeTypes[ext] || 'text/plain')
          console.log(`${res.statusCode} ${req.method} ${req.url}`)
          res.end(data)
        }
      }

      fs.readFile(filename, afterRead)
    })
  })
  .listen(parseInt(port, 10))

console.log(`http://localhost:${port}`)
