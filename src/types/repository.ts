export type WithDBConnectFunction<
  T,
  Params = undefined,
  Response = undefined
> = (params: Params, db: T) => Promise<Response>;

export type WithResultResponse<T> =
  | {
      result: "success";
      data: T;
    }
  | { result: "failure" };
