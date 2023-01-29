import { FastifyInstance } from "fastify";
import { PostEntity } from "../../../utils/DB/entities/DBPosts";

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

export const createPost = async (
  input: any,
  fastify: FastifyInstance
): Promise<PostEntity> => {
  const user = await fastify.db.users.findOne({
    key: "id",
    equals: input.userId,
  });
  if (!user) throw fastify.httpErrors.badRequest();
  const post = await fastify.db.posts.create(input);
  if (!post) throw fastify.httpErrors.HttpError;
  return post;
};

export const updatePost = async (
  id: string,
  input: any,
  fastify: FastifyInstance
): Promise<PostEntity> => {
  try {
    const post = await fastify.db.posts.change(id, input);
    if (!post) throw fastify.httpErrors.notFound();
    return post;
  } catch {
    throw fastify.httpErrors.badRequest();
  }
};
