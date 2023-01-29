import { FastifyInstance } from "fastify";
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
} from "graphql";
import {
  getAllMemberTypes,
  getMemberType,
} from "../../api/memberTypeApi";
import { getAllPosts, getPost } from "../../api/postApi";
import { getAllProfiles, getProfile } from "../../api/profilesApi";
import { getAllUsers, getUser } from "../../api/userApi";
import {
  GraphQLMemberType,
  GraphQLPostType,
  GraphQLProfileType,
  GraphQLUserType,
} from "../types/commonTypes";

export const getQueryType = async (
  fastify: FastifyInstance
): Promise<GraphQLObjectType> =>
  new GraphQLObjectType({
    name: "Query",
    fields: {
      
      memberTypes: {
        type: new GraphQLNonNull(
          new GraphQLList(new GraphQLNonNull(GraphQLMemberType))
        ),
        resolve:  async () => getAllMemberTypes(fastify),
      },

      memberType: {
        type: new GraphQLNonNull(GraphQLMemberType),
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        resolve: async (parent, { id }) => getMemberType(id, fastify),
      },

      posts: {
        type: new GraphQLNonNull(
          new GraphQLList(new GraphQLNonNull(GraphQLPostType))
        ),
        resolve: async () => getAllPosts(fastify),
      },

      post: {
        type: new GraphQLNonNull(GraphQLPostType),
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        resolve: async (parent, { id }) => getPost(id, fastify),
      },

      profiles: {
        type: new GraphQLNonNull(
          new GraphQLList(new GraphQLNonNull(GraphQLProfileType))
        ),
        resolve:  async () => getAllProfiles(fastify),
      },

      profile: {
        type: new GraphQLNonNull(GraphQLProfileType),
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        resolve: async (parent, { id }) => getProfile(id, fastify),
      },

      users: {
        type: new GraphQLList(new GraphQLNonNull(GraphQLUserType)),
        resolve: async () => getAllUsers(fastify),
      },

      user: {
        type: new GraphQLNonNull(GraphQLUserType),
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        resolve: async (parent, { id }) => getUser(id, fastify),
      },
    },
  });
