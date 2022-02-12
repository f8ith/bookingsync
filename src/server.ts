import 'reflect-metadata'
import express, { Request } from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { createContext } from './context'
import { jwtAuth, googleOAuth2 } from './middleware'
import expressJwt from 'express-jwt'
import dotenv from 'dotenv'
import buildSchema from './schema'

const main = async () => {
  dotenv.config()
  const app = express()
  const schema = await buildSchema()

  app.use(cors({ origin: process.env.corsOrigin }))
  app.post('/auth/google', express.json(), googleOAuth2)

  app.use(
    '/graphql',
    expressJwt({ secret: process.env.secret!, algorithms: ['HS256'] }),
    graphqlHTTP((req) => {
      return {
        schema: schema,
        context: createContext(req),
        graphiql: true,
      }
    }),
  )

  app.listen(4000)
  console.log(`\
🚀 Server ready at: http://localhost:4000
`)
}

main().catch(console.error)
