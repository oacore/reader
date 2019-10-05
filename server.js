import express from 'express'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT, 10) || 3000
const host = dev ? 'localhost' : '0.0.0.0'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get('/reader-beta/:id', (req, res) => {
    return app.render(req, res, `/${req.params.id}`)
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, host, err => {
    if (err) throw err
    console.warn(`> Ready on http://${host}:${port}`)
  })
})
