import { FastifyInstance } from "fastify";
import * as DataLoader from "dataloader";
import { PostEntity } from "../../../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../../../utils/DB/entities/DBProfiles";
import { MemberTypeEntity } from "../../../../utils/DB/entities/DBMemberTypes";
import { UserEntity } from "../../../../utils/DB/entities/DBUsers";

export interface ContextType {
  fastify: FastifyInstance;
  dataLoader: {
    getUserPostsLoader: DataLoader<string, PostEntity[], string>;
    getUserProfilesLoader: DataLoader<string, ProfileEntity[], string>;
    getUserMemberTypesLoader: DataLoader<string, MemberTypeEntity[], string>;
    getUserLoader: DataLoader<string, UserEntity[], string>;
  };
}
