import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createProfileBodySchema, changeProfileBodySchema } from "./schema";
import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<ProfileEntity[]> {
    const profiles = await fastify.db.profiles.findMany();
    if (!profiles) throw fastify.httpErrors.notFound();
    return profiles;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!profile) throw fastify.httpErrors.notFound();
      return profile;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createProfileBodySchema,
      },
      preValidation: ({ body }, reply, done) => {
        const {
          avatar,
          sex,
          birthday,
          country,
          street,
          city,
          userId,
          memberTypeId,
        } = body as any;

        if (
          !avatar ||
          !sex ||
          !birthday ||
          !country ||
          !street ||
          !city ||
          !userId ||
          !memberTypeId ||
          typeof avatar !== createProfileBodySchema?.properties?.avatar?.type ||
          typeof sex !== createProfileBodySchema?.properties?.sex?.type ||
          typeof birthday !==
            createProfileBodySchema?.properties?.birthday?.type ||
          typeof country !==
            createProfileBodySchema?.properties?.country?.type ||
          typeof street !== createProfileBodySchema?.properties?.street?.type ||
          typeof city !== createProfileBodySchema?.properties?.city?.type ||
          typeof userId !== createProfileBodySchema?.properties?.userId?.type ||
          typeof memberTypeId !==
            createProfileBodySchema?.properties?.memberTypeId?.type
        )
          throw fastify.httpErrors.badRequest();
        done(undefined);
      },
    },
    async function ({ body }, reply): Promise<ProfileEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: body.userId,
      });
      const memberType = await fastify.db.memberTypes.findOne({
        key: "id",
        equals: body.memberTypeId,
      });
      const profile = await fastify.db.profiles.findOne({
        key: "userId",
        equals: body.userId,
      });
      if (!memberType || !user || profile)
        throw fastify.httpErrors.badRequest();
      const newProfile = await fastify.db.profiles.create(body);
      if (!newProfile) throw fastify.httpErrors.badRequest();
      return newProfile;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const profile = await fastify.db.profiles.delete(request.params.id);
        if (!profile) throw fastify.httpErrors.notFound();
        return profile;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
      preValidation: ({ body }, reply, done) => {
        const { avatar, sex, birthday, country, street, city, memberTypeId } =
          body as any;

        if (
          (avatar &&
            typeof avatar !==
              createProfileBodySchema?.properties?.avatar?.type) ||
          (sex &&
            typeof sex !== createProfileBodySchema?.properties?.sex?.type) ||
          (birthday &&
            typeof birthday !==
              createProfileBodySchema?.properties?.birthday?.type) ||
          (country &&
            typeof country !==
              createProfileBodySchema?.properties?.country?.type) ||
          (street &&
            typeof street !==
              createProfileBodySchema?.properties?.street?.type) ||
          (city &&
            typeof city !== createProfileBodySchema?.properties?.city?.type) ||
          (memberTypeId &&
            typeof memberTypeId !==
              createProfileBodySchema?.properties?.memberTypeId?.type)
        )
          throw fastify.httpErrors.badRequest();
        done(undefined);
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const profile = await fastify.db.profiles.change(
          request.params.id,
          request.body
        );
        if (!profile) throw fastify.httpErrors.notFound();
        return profile;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );
};

export default plugin;
