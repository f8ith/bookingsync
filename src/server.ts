import 'reflect-metadata'
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import * as tq from 'type-graphql'
import { resolvers } from '@generated/type-graphql'
import { context } from './context.js'
import { handleCallback } from './middleware.js'

const app = express()

app.use(
  '/graphql',
  graphqlHTTP({
    schema: await tq.buildSchema({
      resolvers,
    }),
    context: context,
    graphiql: true,
  }),
)
app.post('/simplybook', express.json(), handleCallback)
app.listen(4000)
console.log(`\
🚀 Server ready at: http://localhost:4000
`)
