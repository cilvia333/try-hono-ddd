import { Book } from "./Book";
import { BookId } from "./BookId/BookId";
import type {
  WithDBConnectFunction,
  WithResultResponse,
} from "@/types/repository";

export interface IBookRepository<T> {
  save: IBookRepository.Save<T>;
  delete: IBookRepository.Delete<T>;
  find: IBookRepository.Find<T>;
}
export namespace IBookRepository {
  export namespace Save {
    export type Params = Book;
    export type Response = WithResultResponse<undefined>;
  }
  export type Save<T> = WithDBConnectFunction<T, Save.Params, Save.Response>;

  export namespace Delete {
    export type Params = BookId;
    export type Response = WithResultResponse<undefined>;
  }
  export type Delete<T> = WithDBConnectFunction<
    T,
    Delete.Params,
    Delete.Response
  >;

  export namespace Find {
    export type Params = BookId;
    export type Response = WithResultResponse<Book | null>;
  }
  export type Find<T> = WithDBConnectFunction<T, Find.Params, Find.Response>;
}
