import getUserId from "../utils/getUserId";

const User = {
  email: {
    fragment: "fragment userId on User { id }",
    resolve: (parent, args, { request, prisma }, info) => {
      const userId = getUserId(request, false);

      if (userId && userId === parent.id) {
        return parent.email;
      }
      return null;
    }
  },
  posts: {
    fragment: "fragment user on User {id}",
    resolve: (parent, args, { db, prisma }, info) => {
      return prisma.query.posts(
        {
          where: {
            author: {
              id: parent.id
            },
            published: true
          }
        },
        info
      );
    }
  }

  // comments: (parent, args, {prisma}, info) => {
  //     // return db.comments.filter(comment => comment.author === parent.id)
  //     return prisma.query.comments({
  //         where: {
  //             author: {
  //                 id: parent.id
  //             }
  //         }
  //     }, info)
  // }
};

export default User;
