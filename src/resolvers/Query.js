const Query = {
    me: (parent, args, { db }, info) => db.users[0],

    posts: (_, {query}, {db}, info) => {
        if(!query) return db.posts
        else return db.posts.filter(post => {
            return post.title.toLowerCase().includes(query.toLowerCase()) || post.body.toLowerCase().includes(query.toLowerCase()) 
        })
    },
    users: (_, {query}, { db }) => {
        if (!query) {
            return db.users
        }
        return db.users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
    },
    comments: (parent, args, {db}, info) => db.comments
}

export default Query;