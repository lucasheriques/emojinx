/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.2.1.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as crons from "../crons";
import type * as games_delete from "../games/delete";
import type * as games_gameplay from "../games/gameplay";
import type * as games_get from "../games/get";
import type * as games_helpers from "../games/helpers";
import type * as games_players from "../games/players";
import type * as helpers_emojis from "../helpers/emojis";
import type * as helpers_players from "../helpers/players";
import type * as presence from "../presence";
import type * as types from "../types";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  crons: typeof crons;
  "games/delete": typeof games_delete;
  "games/gameplay": typeof games_gameplay;
  "games/get": typeof games_get;
  "games/helpers": typeof games_helpers;
  "games/players": typeof games_players;
  "helpers/emojis": typeof helpers_emojis;
  "helpers/players": typeof helpers_players;
  presence: typeof presence;
  types: typeof types;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
