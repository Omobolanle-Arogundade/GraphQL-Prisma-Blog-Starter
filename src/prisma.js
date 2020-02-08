import { Prisma } from 'prisma-binding';

import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT || 'http://localhost:4466',
    secret: 'thisismysecretstuff',
    fragmentReplacements // required to add fragments
});

export default prisma;