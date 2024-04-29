import { z } from "zod";

import { User, type UserInput } from "./user";
import type { UserIdInput } from "./userId";
import { WithDBConnectFunction, WithResultResponse } from "@/types/repository";

export interface IUserRepository<T> {
  list: IUserRepository.Get<T>;
  create: IUserRepository.Create<T>;
  save: IUserRepository.Save<T>;
}
export namespace IUserRepository {
  export namespace Get {
    export type Params = {
      userId: UserIdInput;
    };
    export type Response = User | undefined;
  }
  export type Get<T> = WithDBConnectFunction<T, Get.Params, Get.Response>;

  export namespace Create {
    const prams = User.schema.omit({ id: true });
    export type Params = z.input<typeof prams>;
    export type Response =
      | {
          result: "success";
          savedUser: User;
        }
      | { result: "failure" };
  }
  export type Create<T> = WithDBConnectFunction<
    T,
    Create.Params,
    Create.Response
  >;

  export namespace Save {
    export type Params = UserInput;
    export type Response = WithResultResponse<User>;
  }
  export type Save<T> = WithDBConnectFunction<T, Save.Params, Save.Response>;
}
