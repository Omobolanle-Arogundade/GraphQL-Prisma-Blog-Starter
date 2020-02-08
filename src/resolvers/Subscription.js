import getUserId from '../utils/getUserId';

const Subscriptiobn = {
    comment: {
        subscribe: (parent, { postID }, {pubsub, prisma}, info) => {
            return prisma.subscription.comment({
                where: {
                    node: {
                        post: {
                            id: postID
                        }
                    }
                }
            }, info);
        }
    },

    post: {
        subscribe: (parent, args, {pubsub, prisma}, info) => {
            return prisma.subscription.post({
                where: {
                    node: {
                        published: true
                    }
                }
            }, info);
        }
    },

    myPost: {
        subscribe: (parent, args, { prisma, request }, info) => {
            const id = getUserId(request);
            return prisma.subscription.post({
                where: {
                    node: { 
                        author: {
                            id
                        }
                    }
                }
            }, info)
        }
    }
}

export default Subscriptiobn;