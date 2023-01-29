import { FastifyInstance } from "fastify";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";

export const getAllProfiles = async (
  fastify: FastifyInstance
): Promise<ProfileEntity[]> => {
  const profiles = await fastify.db.profiles.findMany();
  if (!profiles) throw fastify.httpErrors.notFound();
  return profiles;
};

export const getProfile = async (
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

export const createProfile = async (
  input: any,
  fastify: FastifyInstance
): Promise<ProfileEntity> => {
  const user = await fastify.db.users.findOne({
    key: "id",
    equals: input.userId,
  });
  const memberType = await fastify.db.memberTypes.findOne({
    key: "id",
    equals: input.memberTypeId,
  });
  const profile = await fastify.db.profiles.findOne({
    key: "userId",
    equals: input.userId,
  });
  if (!memberType || !user || profile) throw fastify.httpErrors.badRequest();
  const newProfile = await fastify.db.profiles.create(input);
  if (!newProfile) throw fastify.httpErrors.badRequest();
  return newProfile;
};

export const updateProfile = async (
  id: string,
  input: any,
  fastify: FastifyInstance
): Promise<ProfileEntity> => {
  try {
    const profile = await fastify.db.profiles.change(id, input);
    if (!profile) throw fastify.httpErrors.notFound();
    return profile;
  } catch {
    throw fastify.httpErrors.badRequest();
  }
};
