import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import * as tq from 'type-graphql'
import { resolvers } from '@generated/type-graphql'
import { context } from './context'
import { jwtAuth, googleOAuth2 } from './middleware'
import expressJwt from 'express-jwt'
import dotenv from 'dotenv'

const main = async () => {
  dotenv.config()
  const app = express()

  app.use(cors({ origin: process.env.corsOrigin }))
  app.post('/auth/google', express.json(), googleOAuth2)

  app.use(
    '/graphql',
    expressJwt({ secret: process.env.secret!, algorithms: ['HS256'] }),
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
}

main().catch(console.error)
