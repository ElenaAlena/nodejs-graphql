import { FastifyInstance } from "fastify";
import { UserEntity } from "../DB/entities/DBUsers";

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
