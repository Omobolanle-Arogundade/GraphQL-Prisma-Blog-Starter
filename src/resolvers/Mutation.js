import uuidv4 from 'uuid/v1';


const Mutation = {
    createUser: (_, args, {db}) => {
            const emailExists = db.users.some(user => user.email === args.data.email)
            if(emailExists){
                throw new Error('Email taken');
            } else{
                const user = {
                    id: uuidv4(),
                    ...args.data
                }
                db.users.push(user)
                return user;
            }
    },

    deleteUser: (parent, args, {db}, info) => {
        const id = args.id;
        const userIndex = db.users.findIndex(user => user.id === id);
        if(userIndex < 0) {
            throw new Error("User not found!!");
        }
        const deletedUSers = db.users.splice(userIndex, 1);

        db.posts = db.posts.filter(post => {
            const match = post.author === id;

            if (match) {
                db.comments = db.comments.filter(comment => comment.post !== post.id)
            }
            return !match;
        });   

        db.comments = db.comments.filter(comment => comment.author !== id)
        return deletedUSers[0];
    },

    updateUser: (parent, {id, data}, { db }, info) => {
        const user = db.users.find(user => user.id === id);
        const {name, email, age} = data
        const emailExists = db.users.some(user => user.email === email);

        if(!user) {
            throw new Error ('User not found!!');
        }

        if(name) {
            user.name = name
        }

        if(email){
            if(emailExists){
                throw new Error('Email already taken!!');
            }
            user.email = email
        }

        if(age !== undefined){
            user.age = age
        }


        return user;

    },


    createPost: (_, { title, body, published, author }, {db, pubsub}) => {
        const userExists = db.users.some(user => user.id === author);
        if(!userExists){
            throw new Error('User doesn\'t exist!!');
        } else{
            const post = {
                id: uuidv4(),
                title,
                body,
                published,
                author
            }

            db.posts.push(post);
            if(post.published){
                console.log('pub publish')
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }


            return post;
        }
    },

    deletePost: (parent, args, {db, pubsub}, info) => {
        const postIndex = db.posts.findIndex(post => post.id === args.id)

        if(postIndex < 0) {
            throw new Error('Post doesn\'t exist!!');
        }

        let [ deletedPost ] = db.posts.splice(postIndex, 1);
        db.comments = db.comments.filter(comment => comment.post !== args.id);

        console.log(deletedPost)
        if(deletedPost.published){
            pubsub.publish('post', {
                post: {
                    mutation: "DELETED",
                    data: deletedPost
                }
            })
        }

        return deletedPost;
        
    },

    updatePost: (parent, {id, data}, { db, pubsub }, info) => {
        const post = db.posts.find(post => post.id === id);
        const {title, body, published} = data;
        const originalPost = {...post};

        if(!post){
            throw new Error('Post not Found!!');
        }

        if(title){
            post.title = title
        }

        if(body) {
            post.body = body
        }
        console.log(published, 'published')

        if(typeof published === 'boolean'){
            post.published = published

            if(originalPost.published && !post.published) {
                console.log('Deleted')
                pubsub.publish('post', {
                    post: {
                        mutation: "DELETED",
                        data: originalPost
                    }
                })
            } else if(!originalPost.published && post.published) {
                console.log('created')

                pubsub.publish('post', {
                    post: {
                        mutation: "CREATED",
                        data: post
                    }
                })
            }
        } else if (post.published) {
            console.log('Updated')

            pubsub.publish('post', {
                post: {
                    mutation: "UPDATED",
                    data: post
                }
            })

        }

        if(post.published){

        }

        return post;
    },


    createComment: (_, {text, author, postID}, {db, pubsub}) => {
        const userExists = db.users.some(user => user.id === author);
        const postExists = db.posts.some(post => post.id === postID);

        if(userExists && postExists){
            const comment = {
                id: uuidv4(),
                text,
                author,
                post: postID
            }

            db.comments.push(comment);
            pubsub.publish(`comment ${postID}`, {
                comment: {
                    mutation: "CREATED",
                    data: comment
                }
            })
            return comment;
        } else{
            if (!userExists){
                throw new Error('User doesn\'t exist!!');
            } else if (!postExists) {
                throw new Error('Post doesn\'t exist!!');
            }
        }
    },

    deleteComment: (parent, args, {db, pubsub}, info) => {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id);
        if(commentIndex < 0) throw new Error('Comment doesn\'t exist!!')
        const [ deletedComment ] = db.comments.splice(commentIndex, 1)

        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: "DELETED",
                data: deletedComment
            }
        })

        return deletedComment;
    },

    updateComment: (parent, {id, data}, {db, pubsub}, info) => {
        const comment = db.comments.find(comment => comment.id === id);
        const {text} = data;

        if(!comment){
            throw new Error('Comment not found!!');
        }
        if(text){
            comment.text = text
        }

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: "UPDATED",
                data: comment
            }
        })

        return comment;


    }
 }

 export default Mutation;