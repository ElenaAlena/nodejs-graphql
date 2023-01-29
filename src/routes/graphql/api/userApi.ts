import { FastifyInstance } from "fastify";
import { MemberTypeEntity } from "../../../utils/DB/entities/DBMemberTypes";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";

export const getAllUsers = async (
  fastify: FastifyInstance
): Promise<UserEntity[]> => {
  const users = await fastify.db.users.findMany();
  if (!users) throw fastify.httpErrors.notFound();
  return users;
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
  ids: string[],
  fastify: FastifyInstance
): Promise<any> => {
  const posts = await fastify.db.posts.findMany();
  return ids.map((id) => posts.filter((post) => post.userId === id));
};

export const getUserProfiles = async (
  ids: string[],
  fastify: FastifyInstance
): Promise<any> => {
  const profiles = await fastify.db.profiles.findMany();
  return ids.map((id) => profiles.filter((profile) => profile.userId === id));
};

export const getUserProfile = async (
  id: string,
  fastify: FastifyInstance
): Promise<ProfileEntity> => {
  const profile = await fastify.db.profiles.findOne({
    key: "id",
    equals: id,
  });
  if (!profile) throw fastify.httpErrors.notFound();
  return profile;
};

export const getUserMemberTypes = async (
  ids: string[],
  fastify: FastifyInstance
): Promise<any> => {
  const memberTypes = await fastify.db.memberTypes.findMany();
  return ids.map((id) =>
    memberTypes.filter((memberType) => memberType.id === id)
  );
};

export const getUserMemberType = async (
  id: string,
  fastify: FastifyInstance
): Promise<MemberTypeEntity> => {
  const memberType = await fastify.db.memberTypes.findOne({
    key: "id",
    equals: id,
  });
  if (!memberType) throw fastify.httpErrors.notFound();
  return memberType;
};

export const getUserSubscribedTo = async (
  id: string,
  fastify: FastifyInstance
): Promise<any> => {
  const users = await getAllUsers(fastify);

  return users.filter((user) => user.subscribedToUserIds.includes(id));
};

export const getSubscribedToUser = async (
  id: string,
  fastify: FastifyInstance
): Promise<any> => {
  const users = await getAllUsers(fastify);
  const current = await getUser(id, fastify);

  return users.filter((someUser) =>
    current.subscribedToUserIds.includes(someUser.id)
  );
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

  try {
    await fastify.db.users.change(user.id, {
      subscribedToUserIds: [...user.subscribedToUserIds, subscriber.id],
    });
    return user;
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
    equals: unsubscribeFromUserId,
  });
  const subscriber = await fastify.db.users.findOne({
    key: "id",
    equals: id,
  });
  if (!user || !subscriber || !user.subscribedToUserIds.includes(subscriber.id))
    throw fastify.httpErrors.badRequest();

  const subscribers = user.subscribedToUserIds.filter((id) => id !== id);

  try {
    await fastify.db.users.change(user.id, {
      subscribedToUserIds: subscribers,
    });

    return user;
  } catch {
    throw fastify.httpErrors.badRequest();
  }
};
