import { applyMiddleware } from 'graphql-middleware'
import * as tq from 'type-graphql'
import { resolvers } from '@generated/type-graphql'
import permissions from './permissions'

const buildSchema = async () => {
  const tqSchema = await tq.buildSchema({
    resolvers,
  })
  const schema = applyMiddleware(tqSchema, permissions)
  return schema
}

export default buildSchema
