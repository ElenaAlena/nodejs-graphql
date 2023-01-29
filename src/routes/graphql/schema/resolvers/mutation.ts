import { FastifyInstance } from "fastify";
import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { updateMemberType } from "../../api/memberTypeApi";
import { createPost, updatePost } from "../../api/postApi";
import { createProfile, updateProfile } from "../../api/profilesApi";
import {
  addUser,
  subscribeTo,
  unsubscribeFrom,
  updateUser,
} from "../../api/userApi";
import {
  GraphQLMemberType,
  GraphQLPostType,
  GraphQLProfileType,
  GraphQLUserType,
} from "../types/commonTypes";
import {
  addPostInputType,
  addProfileInputType,
  addUserInputType,
  updateMemberTypeInputType,
  updatePostInputType,
  updateProfileInputType,
  updateUserInputType,
} from "../types/inputTypes";

export const getMutationType = async (
  fastify: FastifyInstance
): Promise<GraphQLObjectType> =>
  new GraphQLObjectType({
    name: "Mutation",
    fields: {
      createUser: {
        type: new GraphQLNonNull(GraphQLUserType),
        args: { input: { type: new GraphQLNonNull(addUserInputType) } },
        resolve: async (parent, { input }) => addUser(input, fastify),
      },

      createProfile: {
        type: new GraphQLNonNull(GraphQLProfileType),
        args: { input: { type: new GraphQLNonNull(addProfileInputType) } },
        resolve: async (parent, { input }) => createProfile(input, fastify),
      },

      createPost: {
        type: new GraphQLNonNull(GraphQLPostType),
        args: { input: { type: new GraphQLNonNull(addPostInputType) } },
        resolve: async (parent, { input }) => createPost(input, fastify),
      },

      updateUser: {
        type: new GraphQLNonNull(GraphQLUserType),
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          input: { type: new GraphQLNonNull(updateUserInputType) },
        },
        resolve: async (parent, { id, input }) =>
          updateUser(id, input, fastify),
      },

      updateProfile: {
        type: new GraphQLNonNull(GraphQLProfileType),
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          input: { type: new GraphQLNonNull(updateProfileInputType) },
        },
        resolve: async (parent, { id, input }) =>
          updateProfile(id, input, fastify),
      },

      updatePost: {
        type: new GraphQLNonNull(GraphQLPostType),
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          input: { type: new GraphQLNonNull(updatePostInputType) },
        },
        resolve: async (parent, { id, input }) =>
          updatePost(id, input, fastify),
      },

      updateMemberType: {
        type: new GraphQLNonNull(GraphQLMemberType),
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          input: { type: new GraphQLNonNull(updateMemberTypeInputType) },
        },
        resolve: async (parent, { id, input }) =>
          updateMemberType(id, input, fastify),
      },

      subscribeTo: {
        type: new GraphQLNonNull(GraphQLUserType),
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          subscribeToUserId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (parent, { id, subscribeToUserId }) =>
          subscribeTo(id, subscribeToUserId, fastify),
      },

      unsubscribeFrom: {
        type: new GraphQLNonNull(GraphQLUserType),
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          unsubscribeFromUserId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (parent, { id, unsubscribeFromUserId }) =>
          unsubscribeFrom(id, unsubscribeFromUserId, fastify),
      },
    },
  });
