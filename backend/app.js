// server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import crypto from 'node:crypto'

import routes from './routes/index.js'
import { loadCatalog } from './utils/catelog.js'

const PORT = Number(process.env.PORT || 4000)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kiddies_db'
const SID_COOKIE_NAME = process.env.SID_COOKIE_NAME || 'kk_sid'

function sessionCookie(req, res, next) {
  let sid = req.cookies?.[SID_COOKIE_NAME]
  if (!sid) {
    sid = crypto.randomUUID()
    res.cookie(SID_COOKIE_NAME, sid, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 14 * 24 * 3600 * 1000
    })
  }
  req.sessionId = sid
  next()
}

async function connectMongo(uri) {
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  console.log('Mongo connected')
}

const app = express()
app.use(helmet({ contentSecurityPolicy: false }))

// CORS: exact origins + credentials
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true) // server-to-server, curl, Postman
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}))
// DO NOT add: app.options('*', cors()) or app.options('/*', cors())

app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(sessionCookie)

app.use('/api', routes)

app.use((_req, res) => res.status(404).json({ error: 'not_found' }))

;(async function start() {
  await connectMongo(MONGO_URI)
  await loadCatalog()
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`)
  })
})().catch(err => {
  console.error('Startup failed', err)
  process.exit(1)
})
