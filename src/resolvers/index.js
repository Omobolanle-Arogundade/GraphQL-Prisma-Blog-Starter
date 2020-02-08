import { extractFragmentReplacements } from 'prisma-binding' // for setting up fragments


import Query from './Query';
import Mutation from './Mutation';
import User from './User';
import Post from './Post';
import Comment from './Comment';
import Subscription from './Subscription';

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export {resolvers, fragmentReplacements};