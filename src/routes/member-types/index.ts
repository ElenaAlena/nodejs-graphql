import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { changeMemberTypeBodySchema } from "./schema";
import type { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    const memberTypes = await fastify.db.memberTypes.findMany();
    if (!memberTypes) throw fastify.httpErrors.notFound();
    return memberTypes;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const memberType = await fastify.db.memberTypes.findOne({
        key: "id",
        equals: (request as any).params.id,
      });
      if (!memberType) throw fastify.httpErrors.notFound();
      return memberType;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
      preValidation: ({ body }, reply, done) => {
        const { discount, monthPostsLimit } = body as any;
        if (
          (discount &&
            typeof discount !==
              changeMemberTypeBodySchema?.properties?.discount?.type) ||
          (monthPostsLimit &&
            typeof monthPostsLimit !==
              changeMemberTypeBodySchema?.properties?.monthPostsLimit?.type)
        )
          throw fastify.httpErrors.badRequest("Param type is wrong");
          
        done(undefined);
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      try {
        return await fastify.db.memberTypes.change(
          (request as any).params.id,
          (request as any).body
        );
      } catch (error) {
        throw fastify.httpErrors.badRequest(error as string);
      }
    }
  );
};

export default plugin;
