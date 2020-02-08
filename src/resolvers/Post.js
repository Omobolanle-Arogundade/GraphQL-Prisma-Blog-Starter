const Post = {
    // author: (parent, args, {prisma}, info) => {
    //     // return db.users.find(user => user.id === parent.author)
    //     return prisma.query.users({
    //         where: {
    //             id: parent.author
    //         }
    //     }, info)
    // },

    // comments: (parent, args, {prisma}, info) => {
    //     // return db.comments.filter(comment => comment.post === parent.id)
    //     return prisma.query.comments({
    //         where: {
    //             post: {
    //                 id: parent.id
    //             }
    //         }
    //     })
    // }
}

export default Post;