import {TypeOf, object, string} from "zod"

/**
 * @openapi
 * components:
 *  schemas:
 *   RedirectSchema:
 *    required:
 *     - shortcut
 *   properties:
 *    shortcut:
 *     type: string
 *     default: google
 */
export const redirectInputSchema = object({
	params: object({
		shortcut: string({
			required_error: "Shortcut name can not be empty",
		}).min(2, {
			message: "shortcut should atleas be 2 char long",
		}),
	}),
})

export type redirectInputInputType = TypeOf<
	typeof redirectInputSchema
>["params"]
