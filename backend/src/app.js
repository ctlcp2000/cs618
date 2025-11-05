import express from 'express'
import { createPost, updatePost, deletePost } from './services/posts.js'
import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import { eventRoutes } from './routes/events.js'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { typeDefs, resolvers } from './graphql/index.js'
import { optionalAuth } from './middleware/jwt.js'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

const app = express()
app.use(cors())
apolloServer.start().then(() =>
  app.use(
    '/graphql',
    optionalAuth,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        return { auth: req.auth }
      },
    }),
  ),
)

app.use(bodyParser.json())
postsRoutes(app)
userRoutes(app)
eventRoutes(app)

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
