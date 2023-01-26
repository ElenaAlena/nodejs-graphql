import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    const users = await fastify.db.users.findMany();
    if (!users) throw fastify.httpErrors.notFound();
    return users;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!user) throw fastify.httpErrors.notFound();
      return user;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
      preValidation: ({ body }, reply, done) => {
        const { email, firstName, lastName } = body as any;

        if (
          !email ||
          !firstName ||
          !lastName ||
          typeof email !== createUserBodySchema?.properties?.email?.type ||
          typeof firstName !==
            createUserBodySchema?.properties?.firstName?.type ||
          typeof lastName !== createUserBodySchema?.properties?.lastName?.type
        )
          throw fastify.httpErrors.badRequest();
        done(undefined);
      },
    },
    async function ({ body }, reply): Promise<UserEntity> {
      const newUser = await fastify.db.users.create(body);
      if (!newUser) throw fastify.httpErrors.notFound();
      return newUser;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const { id } = request.params;
        const userToDel = await fastify.db.users.delete(id);
        if (!userToDel) throw fastify.httpErrors.notFound();

        const allUsers = await fastify.db.users.findMany({
          key: "subscribedToUserIds",
          inArray: id,
        });

        for await (const user of allUsers) {
          const userUpdatedSubscriptions = user.subscribedToUserIds.filter(
            (userId) => userId !== id
          );
          await fastify.db.users.change(user.id, {
            subscribedToUserIds: userUpdatedSubscriptions,
          });
        }

        const profile = await fastify.db.profiles.findOne({
          key: "userId",
          equals: id,
        });
        if (profile) await fastify.db.profiles.delete(profile.id);

        const posts = await fastify.db.posts.findMany({
          key: "userId",
          equals: id,
        });
        for await (const post of posts) {
          await fastify.db.posts.delete(post.id);
        }

        return userToDel;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
      preValidation: ({ body }, reply, done) => {
        const { userId } = body as any;
        if (
          !userId ||
          typeof userId !== subscribeBodySchema?.properties?.userId?.type
        )
          throw fastify.httpErrors.badRequest();
        done(undefined);
      },
    },
    async function ({ params, body }, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: body.userId,
      });

      const subscriber = await fastify.db.users.findOne({
        key: "id",
        equals: params.id,
      });

      if (
        !user ||
        !subscriber ||
        user.subscribedToUserIds.includes(subscriber.id)
      )
        throw fastify.httpErrors.badRequest();

      try {
        await fastify.db.users.change(user.id, {
          subscribedToUserIds: [...user.subscribedToUserIds, subscriber.id],
        });
        return user;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
      preValidation: ({ body }, reply, done) => {
        const { userId } = body as any;
        if (
          !userId ||
          typeof userId !== subscribeBodySchema?.properties?.userId?.type
        )
          throw fastify.httpErrors.badRequest();
        done(undefined);
      },
    },
    async function ({ params, body }, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: body.userId,
      });
      const subscriber = await fastify.db.users.findOne({
        key: "id",
        equals: params.id,
      });
      if (
        !user ||
        !subscriber ||
        !user.subscribedToUserIds.includes(subscriber.id)
      )
        throw fastify.httpErrors.badRequest();

      const subscribers = user.subscribedToUserIds.filter(
        (id) => id !== params.id
      );

      try {
        await fastify.db.users.change(user.id, {
          subscribedToUserIds: subscribers,
        });

        return user;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
      preValidation: ({ body }, reply, done) => {
        const { firstName, lastName, email } = body as any;

        if (
          (firstName &&
            typeof firstName !==
              changeUserBodySchema?.properties?.firstName?.type) ||
          (lastName &&
            typeof lastName !==
              changeUserBodySchema?.properties?.lastName?.type) ||
          (email &&
            typeof email !== changeUserBodySchema?.properties?.email?.type)
        )
          throw fastify.httpErrors.badRequest();
        done(undefined);
      },
    },
    async function ({ params, body }, reply): Promise<UserEntity> {
      try {
        const user = await fastify.db.users.change(params.id, body);
        if (!user) throw fastify.httpErrors.notFound();
        return user;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );
};

export default plugin;
