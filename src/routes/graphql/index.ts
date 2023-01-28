import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema } from 'graphql';
import { graphqlBodySchema } from './schema';
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
      if (!request.body.query) {
        throw fastify.httpErrors.badRequest();
      }
      const schema = new GraphQLSchema({
        query: await getQueryType(fastify),
       
      });

      return await graphql({ schema, source: request.body.query! });
    }
  );
};

export default plugin;
