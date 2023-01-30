import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLList, GraphQLNonNull } from "graphql/type";
import { getUserMemberTypes, getUserPosts, getUserProfiles } from "../../api/userApi";

const GraphQLMemberType = new GraphQLObjectType({
  name: "Member",
  fields: () => ({
    id: { type: GraphQLString },
    discount: { type: new GraphQLNonNull(GraphQLInt) },
    monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const GraphQLPostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLString },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const GraphQLProfileType = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: { type: GraphQLString },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const GraphQLUserType: GraphQLObjectType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUserIds: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLPostType))),
      resolve: getUserPosts,
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLProfileType))),
      resolve: getUserProfiles,
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLMemberType))),
      resolve: getUserMemberTypes,
    },
    /*profile: {
      type: new GraphQLNonNull(GraphQLProfileType),
      resolve: getUserProfile,
    },
    memberType: {
      type: new GraphQLNonNull(GraphQLMemberType),
      resolve: getUserMemberType,
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLUserType))),
      resolve: getUserSubscribedTo,
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLUserType))),
      resolve: getSubscribedToUser,
    },*/
  }),
});

export {
  GraphQLMemberType,
  GraphQLPostType,
  GraphQLProfileType,
  GraphQLUserType,
};
