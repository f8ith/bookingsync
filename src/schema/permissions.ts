import { rule, shield, not, and, or } from 'graphql-shield'

const isAdmin = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return ctx.user.role === 'admin'
  },
)

const isClient = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return ctx.user.role === 'client'
  },
)

const permissions = shield({
  Query: {
    '*': isAdmin,
  },
  Mutation: {
    '*': isAdmin,
  },
})

export default permissions
