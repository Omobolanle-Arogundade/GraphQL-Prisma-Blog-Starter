import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://192.168.99.100:4466'
})


const createPost = async (authorId, data) => {

    const userExists = await prisma.exists.User({id: authorId});

    console.log("User exists? ", userExists);

    if(userExists){
        const post = await prisma.mutation.createPost({
            data: {
                ...data,
                author: {
                    connect: {
                        id: authorId
                    }
                }
            }
        }, '{id, author {id, name, posts {id, title, published }}}')



        return post

    }else {
        throw new Error(`User not found!!`)
    }


}

// createPost("ck5wg6ig8000l07687ns1cfs8", {
//     title: "A great book",
//     body: "This is a great book to read",
//     published: true
// }).then(data => {
//     console.log(JSON.stringify(data, undefined, 3));
// }).catch(err => console.error(err, "Errors oh!!"))


const updatePostForUser = async (postId, data) => {
    const postExists =await prisma.exists.Post({id: postId});

    if(postExists){
        const post = await prisma.mutation.updatePost({
            data: {...data },
            where: { id: postId }
        }, `{id title body}`)

        return post
    } else {
        throw new Error("Post doesn't exist!!");
    }
}

// updatePostForUser("ck5xkbspw004m0768ts3bdt7", {
//     title: "Updated Title2",
//     body: "New Bodya",
//     published: true
// }).then(data => {
//     console.log(JSON.stringify(data, undefined, 3))
// }).catch(err => {
//     console.error(err, "ERROR")
// })
