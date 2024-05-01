import type { DrizzleD1Database } from "drizzle-orm/d1";

import type { IUserRepository } from "@/domain/user/IUserRepository";

import { usersSchema } from "../schema";
import { User } from "@/domain/user/user";

const create: IUserRepository.Create<DrizzleD1Database> = async (input, db) => {
  try {
    const res = await db.batch([
      db.insert(usersSchema).values(input).returning({
        id: usersSchema.id,
        displayId: usersSchema.displayId,
        name: usersSchema.name,
        email: usersSchema.email,
      }),
    ]);

    const createdUser = res[0][0];

    return {
      result: "success",
      data: User.buildSingle({
        id: createdUser.id,
        displayId: createdUser.displayId,
        name: createdUser.name,
        email: createdUser.email,
      }),
    };
  } catch (e) {
    return {
      result: "failure",
    };
  }
};

export const UserRepository = {
  create,
} as const;
