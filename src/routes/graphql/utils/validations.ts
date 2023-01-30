
import { GraphQLSchema, parse,DocumentNode,Source } from "graphql";
import { validate } from "graphql/validation";
import * as depthLimit from "graphql-depth-limit";
import { FastifyInstance } from "fastify";
import { GraphQLError } from 'graphql/error/GraphQLError';

const DEPTH_LIMIT = 5;

export const validationDepth = (schema: GraphQLSchema, query: string, fastify: FastifyInstance): ReadonlyArray<GraphQLError> => {
    let documentAST: DocumentNode;
  
    try {
      documentAST = parse(new Source(query, 'GraphQL check'));
    } catch {
      throw fastify.httpErrors.badRequest();
    }
  
    const validationErrors = validate(schema, documentAST, [
      depthLimit(DEPTH_LIMIT)
    ]);
  
    return validationErrors;
  };