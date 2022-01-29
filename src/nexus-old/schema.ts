import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
  list,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';



export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: (_parent, _args, context) => {
        return context.prisma.user.findMany()
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.nonNull.field('signupUser', {
      type: 'User',
      args: {
        data: nonNull(
          arg({
            type: 'UserCreateInput',
          }),
        ),
      },
      resolve: (_, args, context) => {
        return context.prisma.user.create({
          data: {
            name: args.data.name,
            email: args.data.email,
          },
        })
      },
    })
  },
})

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.nonNull.string('email')
  },
})

const Client = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.nonNull.string('email')
    t.string('phoneNo')
    t.field('bookings', {
      type: list('Booking')
    })
  },
})

const Booking = objectType({
  name: 'Booking',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('code')
    t.nonNull.field('startDatetime', { type: 'DateTime' })
    t.nonNull.field('endDatetime', { type: 'DateTime' })
    t.nonNull.int('duration')
    t.nonNull.field('service', {
      type: 'Service',
      resolve: (parent, _, context) => {
        return context.prisma.post
          .findUnique({
            where: { id: parent.id }
          })
      }
    }
    )
    t.nonNull.int('serviceId')

  }
})

const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id')
    t.string('email')
  },
})

const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.string('name')
  },
})

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    User,
    UserUniqueInput,
    UserCreateInput,
    SortOrder,
    DateTime,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
