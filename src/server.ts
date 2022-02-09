import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import * as tq from 'type-graphql'
import { resolvers } from '@generated/type-graphql'
import { context } from './context.js'
import { handleCallback, jwtAuth, generateToken } from './middleware.js'
import expressJwt from 'express-jwt'
import config from './config.js'

const app = express()

app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.post('/simplybook', express.json(), handleCallback)
app.post('/gettoken', express.json(), generateToken)

app.use(
  '/graphql',
  expressJwt({ secret: config.secret, algorithms: ['HS256'] }),
  jwtAuth,
  graphqlHTTP({
    schema: await tq.buildSchema({
      resolvers,
    }),
    context: context,
    graphiql: true,
  }),
)

app.listen(4000)
console.log(`\
🚀 Server ready at: http://localhost:4000
`)
