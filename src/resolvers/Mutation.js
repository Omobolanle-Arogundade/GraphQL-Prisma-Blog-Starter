import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

import getUserId from "../utils/getUserId";
import generateToken from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";


const Mutation = {
  createUser: async (_, args, { prisma }, info) => {
    const emailExists = await prisma.exists.User({ email: args.data.email });
    let password = args.data.password;

    if (emailExists) {
      throw new Error("Email Taken");
    } else {
      const hashedPassword = await hashPassword(password)
      const user = await prisma.mutation.createUser({
        data: {
          ...args.data,
          password: hashedPassword
        }
      });

      return {
        user,
        token: generateToken(user.id)
      };
    }
  },

  loginUser: async (parent, { data }, { prisma }, info) => {
    const { email, password } = data;

    const user = await prisma.query.user({
      where: {
        email
      }
    });

    if (!user) {
      throw new Error("User with email doens't exist!!"); // Use a more generic reason
    } else {
      const passwordCorrect = await bcrypt.compare(password, user.password);

      if (!passwordCorrect || password < 8) {
        throw new Error("Password isn't correct!!"); // Use a more generic reason
      } else {
        return {
          user,
          token: generateToken(user.id)
        };
      }
    }
  },

  deleteUser: async (parent, args, { prisma, request }, info) => {
    const id = getUserId(request);
    const opArg = {
      where: { id }
    };

    const userExists = await prisma.exists.User({
      id
    });

    if (!userExists) {
      throw new Error("User doesn't exist!!");
    } else {
      return prisma.mutation.deleteUser(opArg, info);
    }
  },

  updateUser: async (parent, { data }, { prisma, request }, info) => {
    const id = getUserId(request);
    const userExists = await prisma.exists.User({
      id
    });

    if (!userExists) {
      throw new Error("User not found!!");
    } else {
      if(typeof data.password === 'string'){
        data.password = await hashPassword(data.password)
      }
      return prisma.mutation.updateUser(
        {
          data,
          where: {
            id
          }
        },
        info
      );
    }
  },

  createPost: (_, { title, body, published }, { prisma, request }, info) => {
    const userId = getUserId(request);
    return prisma.mutation.createPost(
      {
        data: {
          title,
          body,
          published,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    );
  },

  deletePost: async (parent, { id }, { prisma, request }, info) => {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });

    if (!postExists) {
      throw new Error("Unable to delete post!!");
    }

    return prisma.mutation.deletePost({
      where: {
        id
      }
    });
  },

  updatePost: async (parent, { id, data }, { prisma, request }, info) => {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });

    const isPublished = await prisma.exists.Post({
      id,
      author: {
        id: userId
      },
      published: true
    });

    if (!postExists) {
      throw new Error("Post not Found!!");
    }

    if (isPublished && data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id
          }
        }
      });
    }

    return prisma.mutation.updatePost(
      {
        data,
        where: {
          id
        }
      },
      info
    );
  },

  createComment: async (_, { text, postID }, { prisma, request }, info) => {
    const userId = getUserId(request);
    const postPublished = await prisma.exists.Post({
      id: postID,
      published: true
    });

    if (!postPublished) {
      throw new Error("Post not published!!");
    }
    return prisma.mutation.createComment(
      {
        data: {
          text,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: postID
            }
          }
        }
      },
      info
    );
  },

  deleteComment: async (parent, { id }, { prisma, request }, info) => {
    const userId = getUserId(request);
    const commentExist = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });
    if (!commentExist) {
      throw new Error("Unable to delete Comment!!");
    }
    return prisma.mutation.deleteComment(
      {
        where: {
          id
        }
      },
      info
    );
  },

  updateComment: async (parent, { id, data }, { prisma, request }, info) => {
    const userId = getUserId(request);
    const commentExist = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });
    if (!commentExist) {
      throw new Error("Unable to update comment!!");
    }
    return prisma.mutation.updateComment(
      {
        data,
        where: {
          id
        }
      },
      info
    );
  }
};

export default Mutation;
