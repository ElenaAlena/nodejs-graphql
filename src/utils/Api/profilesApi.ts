import { FastifyInstance } from "fastify";
import { ProfileEntity } from "../DB/entities/DBProfiles";

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
