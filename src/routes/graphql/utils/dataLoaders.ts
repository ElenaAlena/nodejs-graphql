import DataLoader = require("dataloader");
import { FastifyInstance } from "fastify";
import { groupBy } from "lodash";
import { MemberTypeEntity } from "../../../utils/DB/entities/DBMemberTypes";
import { PostEntity } from "../../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";

export const createDataLoaders = (fastify: FastifyInstance) => ({
  getUserPostsLoader: new DataLoader(
    async (ids: readonly string[]): Promise<PostEntity[][]> => {
      const posts = await fastify.db.posts.findMany({
        key: "userId",
        equalsAnyOf: ids as string[],
      });
      const groupeById = groupBy(posts, "userId");

      return ids.map((userId) => groupeById[userId] ?? []);
    }
  ),
  getUserProfilesLoader: new DataLoader(
    async (ids: readonly string[]): Promise<ProfileEntity[][]> => {
      const profiles = await fastify.db.profiles.findMany({
        key: "userId",
        equalsAnyOf: ids as string[],
      });
      const groupeById = groupBy(profiles, "userId");
      return ids.map((userId) => groupeById[userId] ?? []);
    }
  ),
  getUserMemberTypesLoader: new DataLoader(
    async (ids: readonly string[]): Promise<MemberTypeEntity[][]> => {
      const memberTypes: MemberTypeEntity[] =
        await fastify.db.memberTypes.findMany({
          key: "id",
          equalsAnyOf: ids as string[],
        });
      return ids.map((id) =>
        memberTypes.filter((memberType) => memberType.id === id)
      );
    }
  ),
  getUserLoader: new DataLoader(
    async (ids: readonly string[]): Promise<UserEntity[][]> => {
      const users = await fastify.db.users.findMany();
      return ids.map(() => users);
    }
  ),
});
