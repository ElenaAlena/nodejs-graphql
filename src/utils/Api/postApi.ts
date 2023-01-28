import { FastifyInstance } from "fastify";
import { PostEntity } from "../DB/entities/DBPosts";

export const getAllPosts = async (
  fastify: FastifyInstance
): Promise<PostEntity[]> => {
  const posts = await fastify.db.posts.findMany();
  if (!posts) throw fastify.httpErrors.notFound();
  return posts;
};

export const getPost = async (
  id: string,
  fastify: FastifyInstance
): Promise<PostEntity> => {
  const post = await fastify.db.posts.findOne({
    key: "id",
    equals: id,
  });
  if (!post) throw fastify.httpErrors.notFound();
  return post;
};
