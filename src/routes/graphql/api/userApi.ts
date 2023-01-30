import { FastifyInstance } from "fastify";
import { MemberTypeEntity } from "../../../utils/DB/entities/DBMemberTypes";
import { PostEntity } from "../../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";
import { ContextType } from "../schema/types/contextType";

export const getAllUsers = async (
  user: any,
  args: unknown,
  { dataLoader }: ContextType
): Promise<UserEntity[]> => {
  return dataLoader.getUserLoader.load('call');
};

export const getUser = async (
  id: string,
  fastify: FastifyInstance
): Promise<UserEntity> => {
  const user = await fastify.db.users.findOne({
    key: "id",
    equals: id,
  });
  if (!user) throw fastify.httpErrors.notFound();
  return user;
};

export const getUserPosts = async (
  user: any,
  args: unknown,
  { dataLoader }: ContextType
): Promise<PostEntity[]> => {
  return dataLoader.getUserPostsLoader.load(user.id);
};

export const getUserProfiles = async (
  user: any,
  args: unknown,
  { dataLoader }: ContextType
): Promise<any> => {
  return dataLoader.getUserProfilesLoader.load(user.id);
};

export const getUserProfile = async (
  user: any,
  args: unknown,
  { dataLoader }: ContextType
): Promise<ProfileEntity> => {
  const [profile] = await dataLoader.getUserProfilesLoader.load(user.id);
  return profile || null;
};

export const getUserMemberTypes = async (
  user: any,
  args: unknown,
  { dataLoader }: ContextType
): Promise<any> => {
  const [profile] = await dataLoader.getUserProfilesLoader.load(user.id);

  return dataLoader.getUserMemberTypesLoader.load(
    profile ? profile.memberTypeId : ""
  );
};

export const getUserMemberType = async (
  user: any,
  args: unknown,
  { dataLoader }: ContextType
): Promise<MemberTypeEntity> => {
  const [profile] = await dataLoader.getUserProfilesLoader.load(user.id);
  const [memberType] = await dataLoader.getUserMemberTypesLoader.load(
    profile?.memberTypeId || ""
  );
  return memberType || null;
};

export const getUserSubscribedTo = async (
  user: any,
  args: unknown,
  { dataLoader }: ContextType
): Promise<UserEntity[]> => {
  const users = await dataLoader.getUserLoader.load("call");

  return users.filter((item) => item.subscribedToUserIds.includes(user.id));
};

export const getSubscribedToUser = async (
  user: any,
  args: unknown,
  { dataLoader }: ContextType
): Promise<UserEntity[]> => {
  const users = await dataLoader.getUserLoader.load("call");

  return users.filter((item) => user.subscribedToUserIds.includes(item.id));
};

export const addUser = async (
  input: any,
  fastify: FastifyInstance
): Promise<UserEntity> => {
  const newUser = await fastify.db.users.create(input);
  if (!newUser) throw fastify.httpErrors.notFound();
  return newUser;
};

export const updateUser = async (
  id: string,
  input: any,
  fastify: FastifyInstance
): Promise<UserEntity> => {
  try {
    const user = await fastify.db.users.change(id, input);
    if (!user) throw fastify.httpErrors.notFound();
    return user;
  } catch {
    throw fastify.httpErrors.badRequest();
  }
};

export const subscribeTo = async (
  id: string,
  subscribeToUserId: string,
  fastify: FastifyInstance
): Promise<UserEntity> => {
  const user = await fastify.db.users.findOne({
    key: "id",
    equals: subscribeToUserId,
  });

  const subscriber = await fastify.db.users.findOne({
    key: "id",
    equals: id,
  });

  if (!user || !subscriber || user.subscribedToUserIds.includes(subscriber.id))
    throw fastify.httpErrors.badRequest();

  const subscribedToUserIdsAray: string[] = [
    ...user.subscribedToUserIds,
    subscriber.id,
  ];
  try {
    await fastify.db.users.change(user.id, {
      subscribedToUserIds: subscribedToUserIdsAray,
    });
    return { ...user, subscribedToUserIds: subscribedToUserIdsAray };
  } catch {
    throw fastify.httpErrors.badRequest();
  }
};

export const unsubscribeFrom = async (
  id: string,
  unsubscribeFromUserId: string,
  fastify: FastifyInstance
): Promise<UserEntity> => {
  const user = await fastify.db.users.findOne({
    key: "id",
    equals: id,
  });
  const subscriber = await fastify.db.users.findOne({
    key: "id",
    equals: unsubscribeFromUserId,
  });
  if (!user || !subscriber || !user.subscribedToUserIds.includes(subscriber.id))
    throw fastify.httpErrors.badRequest();

  const subscribers = user.subscribedToUserIds.filter((id) => id !== id);

  try {
    await fastify.db.users.change(user.id, {
      subscribedToUserIds: subscribers,
    });

    return { ...user, subscribedToUserIds: subscribers };
  } catch {
    throw fastify.httpErrors.badRequest();
  }
};
