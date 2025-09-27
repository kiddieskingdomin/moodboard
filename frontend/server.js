import fs from 'node:fs/promises'
import express from 'express'
import { Transform } from 'node:stream'
import path from 'node:path'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'
const ABORT_DELAY = 10000

// Cached production assets
let templateHtml = ''
let manifest = null

if (isProduction) {
  templateHtml = await fs.readFile('./dist/client/index.html', 'utf-8')
  manifest = JSON.parse(
    await fs.readFile('./dist/client/.vite/manifest.json', 'utf-8')
  )
}

// helpers to inject CSS/JS from manifest
function renderPreloadLinks(entry) {
  if (!manifest) return ''
  const seen = new Set()
  const links = []

  function collectDeps(file) {
    const chunk = manifest[file]
    if (!chunk) return
    if (chunk.file && !seen.has(chunk.file)) {
      seen.add(chunk.file)
      links.push(`<link rel="modulepreload" href="${base}${chunk.file}">`)
    }
    if (chunk.css) {
      chunk.css.forEach(href => {
        links.push(`<link rel="preload" as="style" href="${base}${href}">`)
      })
    }
    if (chunk.imports) {
      chunk.imports.forEach(imp => collectDeps(imp))
    }
  }

  collectDeps(entry)
  return links.join('\n')
}

function renderStyles(entry) {
  if (!manifest) return ''
  const cssFiles = new Set()
  function collect(file) {
    const chunk = manifest[file]
    if (chunk?.css) chunk.css.forEach(href => cssFiles.add(href))
    if (chunk?.imports) chunk.imports.forEach(i => collect(i))
  }
  collect(entry)
  return [...cssFiles]
    .map(href => `<link rel="stylesheet" href="${base}${href}">`)
    .join('\n')
}

// Create http server
const app = express()

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template
    let render
    if (!isProduction) {
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    let didError = false

    const { pipe, abort } = render(url, {
      onShellError() {
        res.status(500).set({ 'Content-Type': 'text/html' })
        res.send('<h1>Something went wrong</h1>')
      },
      onShellReady() {
        res.status(didError ? 500 : 200)
        res.set({ 'Content-Type': 'text/html' })

        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding)
            callback()
          },
        })

        const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`)

        // Inject preload links + styles before </head>
        let headInjected = htmlStart
        if (isProduction) {
          const entryClient = 'src/entry-client.jsx' // adjust if diff
          const inject =
            renderPreloadLinks(entryClient) + '\n' + renderStyles(entryClient)
          headInjected = htmlStart.replace('</head>', `${inject}\n</head>`)
        }

        res.write(headInjected)

        transformStream.on('finish', () => {
          res.end(htmlEnd)
        })

        pipe(transformStream)
      },
      onError(error) {
        didError = true
        console.error(error)
      },
    })

    setTimeout(() => {
      abort()
    }, ABORT_DELAY)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
