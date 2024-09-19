import * as schema from "../src/schema"
import { InferSelectModel } from "drizzle-orm"

export type IUser = InferSelectModel<typeof schema.users>
export type ICredentials = InferSelectModel<typeof schema.credentials>
export type IUserWithCredentials = IUser & { credentials: ICredentials }