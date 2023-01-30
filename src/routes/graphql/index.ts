import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema } from 'graphql';
import { graphqlBodySchema } from './schema';
import { getMutationType } from './schema/resolvers/mutation';
import { getQueryType } from './schema/resolvers/query';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      if (!(request.body as any).query) {
        throw fastify.httpErrors.badRequest();
      }
      const schema = new GraphQLSchema({
        query: await getQueryType(fastify),
        mutation: await getMutationType(fastify),
      });

      return await graphql({ schema, source: (request.body as any).query! });
    }
  );
};

export default plugin;
