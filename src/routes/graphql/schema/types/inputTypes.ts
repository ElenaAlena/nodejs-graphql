import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLID } from 'graphql';

export const addUserInputType = new GraphQLInputObjectType({
  name: 'AddUserInput',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const addProfileInputType = new GraphQLInputObjectType({
  name: 'AddProfileInput',
  fields: {
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const addPostInputType = new GraphQLInputObjectType({
  name: 'AddPostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

export const updateUserInputType = new GraphQLInputObjectType({
  name: 'UpdateUserInput',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

export const updateProfileInputType = new GraphQLInputObjectType({
  name: 'UpdateProfileInput',
  fields: {
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  },
});

export const updatePostInputType = new GraphQLInputObjectType({
  name: 'UpdatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

export const updateMemberTypeInputType = new GraphQLInputObjectType({
  name: 'UpdateMemberTypeInput',
  fields: {
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});