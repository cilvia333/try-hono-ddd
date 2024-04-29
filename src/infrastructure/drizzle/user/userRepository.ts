import type { DrizzleD1Database } from "drizzle-orm/d1";

import type { IUserRepository } from "@/domain/user/IUserRepository";
import type { UserId } from "@/domain/user/userId";

import { usersSchema } from "../schema";

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
      savedUser: {
        id: createdUser.id as UserId,
        displayId: createdUser.displayId,
        name: createdUser.name,
        email: createdUser.email,
      },
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
