import { FastifyInstance } from "fastify";
import { MemberTypeEntity } from "../../../utils/DB/entities/DBMemberTypes";

export const getAllMemberTypes = async (
  fastify: FastifyInstance
): Promise<MemberTypeEntity[]> => {
  const memberTypes = await fastify.db.memberTypes.findMany();
  if (!memberTypes) throw fastify.httpErrors.notFound();
  return memberTypes;
};

export const getMemberType = async (
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

export const updateMemberType = async (
  id: string,
  input: any,
  fastify: FastifyInstance
): Promise<MemberTypeEntity> => {
  try {
    return await fastify.db.memberTypes.change(id, input);
  } catch (error) {
    throw fastify.httpErrors.badRequest(error as string);
  }
};
