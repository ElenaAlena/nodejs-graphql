import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql, GraphQLSchema } from "graphql";
import { graphqlBodySchema } from "./schema";
import { getMutationType } from "./schema/resolvers/mutation";
import { getQueryType } from "./schema/resolvers/query";
import { createDataLoaders } from "./utils/dataLoaders";
import { validationDepth } from "./utils/validations";


const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      if (!(request.body as any).query) {
        throw fastify.httpErrors.badRequest();
      }
      const schema: GraphQLSchema = new GraphQLSchema({
        query: await getQueryType(fastify),
        mutation: await getMutationType(fastify),
      });


      const validationErrors = validationDepth(schema, (request.body as any).query, fastify);

      if (validationErrors.length > 0) {
        reply.send({data: null, errors: validationErrors});
        return;
      }

      return await graphql({
        schema,
        source: (request.body as any).query!,
        variableValues: (request.body as any).variables,
        contextValue: {
          fastify,
          dataLoader: createDataLoaders(fastify),
        },
      });
    }
  );
};

export default plugin;
