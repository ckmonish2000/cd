import {TypeOf, object, string} from "zod"

export const createPermissionInputSchema = object({
	body: object({
		userId: string({
			required_error: "User Id is Required",
		}).uuid({
			message: "Enter a valid UUID",
		}),
		shortlink: string({
			required_error: "Url Id is Required",
		}).min(2, {
			message: "must be atleast 2 char long",
		}),
	}),
})

export const revokePermissionInputSchema = object({
	params: object({
		accessListId: string({
			required_error: "Access list id is required",
		}),
	}),
})

export const fetchAccessListForUrlInputSchema = object({
	params: object({
		shortlink: string({
			required_error: "Url Id is Required",
		}).min(2, {
			message: "must be atleast 2 char long",
		}),
	}),
})

export type permissionInputType = TypeOf<
	typeof createPermissionInputSchema
>["body"]
export type revokePermissionInputType = TypeOf<
	typeof revokePermissionInputSchema
>["params"]
export type fetchAccessListForUrlInputType = TypeOf<
	typeof fetchAccessListForUrlInputSchema
>["params"]
