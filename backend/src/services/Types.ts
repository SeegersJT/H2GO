import { FlattenMaps, Require_id } from "mongoose";

export type Lean<T> = Require_id<FlattenMaps<T>>;
