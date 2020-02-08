import getUserId from "../utils/getUserId";

const Query = {
  me: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request);

    return prisma.query.user({
      where: {
        id: userId
      }
    });
  },

  posts: (_, { query, skip, first, after, orderBy }, { prisma, request }, info) => {
    const opArgs = {
      where: {
        published: true
      },
      skip,
      first,
      after,
      orderBy
    };
    if (query) {
      opArgs.where = {
        OR: [
          {
            title_contains: query
          },
          {
            body_contains: query
          }
        ]
      };
    }

    return prisma.query.posts(opArgs, info);
  },

  myPosts: (parent, { query, skip, first, after, orderBy }, { prisma, request }, info) => {
    const userId = getUserId(request);
    const opArg = {
      where: {
        author: {
          id: userId
        }
      },
      skip,
      first,
      after,
      orderBy
    };

    if (query) {
      opArg.where.OR = [
        {
          title_contains: query
        },
        {
          body_contains: query
        }
      ];
    }

    return prisma.query.posts(opArg, info);
  },

  post: async (parent, { id }, { prisma, request }, info) => {
    const userId = getUserId(request, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id,
          OR: [
            {
              published: true
            },
            {
              author: {
                id: userId
              }
            }
          ]
        }
      },
      info
    );

    if (posts.length === 0) {
      throw new Error("Post not found!!");
    }

    return posts[0];
  },

  users: (_, { query, first, skip, after, orderBy }, { prisma }, info) => {
    const opArgs = {
      first,
      skip,
      after,
      orderBy
    };
    if (query) {
      opArgs.where = {
        name_contains: query
      };
    }
    return prisma.query.users(opArgs, info);
  },

  comments: (parent, {first, skip, after, orderBy}, { prisma }, info) => {
    const opArgs = {
      first, skip, after, orderBy
    }
    return prisma.query.comments(opArgs, info);
  }
};

export default Query;
