const Subscriptiobn = {
    comment: {
        subscribe: (parent, { postID }, {pubsub, db}, info) => {
            const post = db.posts.find(post => post.id === postID && post.published);

            if(!post) {
                throw new Error('Post not Found!!');
            }

            return pubsub.asyncIterator(`comment ${postID}`);
        }
    },

    post: {
        subscribe: (parent, args, {pubsub, db}, info) => {
            return pubsub.asyncIterator('post');
        }
    }
}

export default Subscriptiobn;