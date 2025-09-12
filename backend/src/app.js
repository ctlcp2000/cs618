import express from 'express'
import { createPost, updatePost, deletePost } from './services/posts.js'
import { postsRoutes } from './routes/posts.js'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(bodyParser.json())
postsRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

app.post('/api/v1/posts', async (req, res) => {
  try {
    const post = await createPost(req.body)
    return res.json(post)
  } catch (err) {
    console.error('error creating post', err)
    return res.status(500).end()
  }
})

app.patch('/api/v1/posts/:id', async (req, res) => {
  try {
    const post = await updatePost(req.params.id, req.body)
    return res.json(post)
  } catch (err) {
    console.error('error updating post', err)
    return res.status(500).end()
  }
})

app.delete('/api/v1/posts/:id', async (req, res) => {
  try {
    const { deletedCount } = await deletePost(req.params.id)
    if (deletedCount === 0) return res.sendStatus(404)
    return res.status(204).end()
  } catch (err) {
    console.error('error deleting post', err)
    return res.status(500).end()
  }
})
export { app }
