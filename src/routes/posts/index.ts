import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createPostBodySchema, changePostBodySchema } from "./schema";
import type { PostEntity } from "../../utils/DB/entities/DBPosts";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<PostEntity[]> {
    const posts = await fastify.db.posts.findMany();
    if (!posts) throw fastify.httpErrors.notFound();
    return posts;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await fastify.db.posts.findOne({
        key: "id",
        equals: (request as any).params.id,
      });
      if (!post) throw fastify.httpErrors.notFound();
      return post;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createPostBodySchema,
      },
      preValidation: ({ body }, reply, done) => {
        const { content, title, userId } = body as any;
        if (
          (content &&
            typeof content !==
              createPostBodySchema?.properties?.content?.type) ||
          (title &&
            typeof title !== createPostBodySchema?.properties?.title?.type) ||
          (userId &&
            typeof userId !== createPostBodySchema?.properties?.userId?.type)
        )
          throw fastify.httpErrors.badRequest();
        done(undefined);
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: (request as any).body.userId,
      });
      if (!user) throw fastify.httpErrors.badRequest();
      const post = await fastify.db.posts.create((request as any).body);
      if (!post) throw fastify.httpErrors.HttpError;
      return post;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const postForDel = await fastify.db.posts.delete(request.params.id);
        if (!postForDel) throw fastify.httpErrors.notFound();
        return postForDel;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
      preValidation: ({ body }, reply, done) => {
        const { content, title } = body as any;
        if (
          (content &&
            typeof content !==
              createPostBodySchema?.properties?.content?.type) ||
          (title &&
            typeof title !== createPostBodySchema?.properties?.title?.type)
        )
          throw fastify.httpErrors.badRequest();
        done(undefined);
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const post = await fastify.db.posts.change(
          request.params.id,
          request.body
        );
        if (!post) throw fastify.httpErrors.notFound();
        return post;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );
};

export default plugin;
