import {TypeOf, object, string} from "zod"

/**
 * @openapi
 * components:
 *  schemas:
 *   CreatePermissionSchema:
 *    type: object
 *    required:
 *     - userId
 *     - shortlink
 *    properties:
 *     userId:
 *      type: string
 *      description: uuid
 *     shortlink:
 *      type: string
 *      default: google
 */
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

/**
 * @openapi
 * components:
 *  schemas:
 *   RevokePermissionSchema:
 *    type: string
 *    properties:
 *     accessListId:
 *      type: string
 *      description: uuid
 */
export const revokePermissionInputSchema = object({
	params: object({
		accessListId: string({
			required_error: "Access list id is required",
		}),
	}),
})

/**
 * @openapi
 * components:
 *  schemas:
 *   AccessListForUrlSchema:
 *    type: string
 *    required:
 *     - shortlink
 *    properties:
 *     shortlink:
 *      type: string
 *      default: google
 */
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
