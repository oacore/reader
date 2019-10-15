import express from 'express'
import next from 'next'
import parseArgs from 'minimist'

// for asset prefixing
process.env.EXPRESS_SERVER = true

const argv = parseArgs(process.argv.slice(2))
const port = argv.port || argv.p || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.all('*', (req, res) => {
    req.url = req.url.replace('/reader-beta', '')
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.warn(`> Ready on http://localhost:${port}`)
  })
})
