import {object, string, TypeOf} from "zod"

/**
 * @openapi
 * components:
 *  schemas:
 *   CreateShortcutSchema:
 *    type: object
 *    required: 
 *     - shortlink
 *     - url
 *    properties:
 *     shortlink:
 *      type: string
 *      default: google
 *     url:
 *      type: string
 *      default: https://www.google.com
 */
export const createShortcutSchema = object({
	body: object({
		shortlink: string({
			required_error: "You have to provide a name to your links.",
		}).min(2, {
			message: "shortcut should atleas be 2 char long",
		}),
		url: string({
			required_error: "URL is required",
		}).url({
			message: "Please enter a valid url",
		}),
	}),
})



/**
 * @openapi
 * components:
 *  schemas:
 *   UpdateShortcutSchema:
 *    type: object
 *    required: 
 *     - shortlink
 *     - data
 *    properties:
 *     shortlink:
 *      type: string
 *      default: google
 *     data:
 *      type: object
 *      properties:
 *       url:
 *        type: string
 *        required: true
 *        default: https://www.google.com 
 *       shortlink:
 *        type: string
 *        required: true
 *        default: google
 */

export const updateShortcutSchema = object({
	body: object({
		shortlink: string({
			required_error: "You have to provide a name to your links.",
		}).min(2, {
			message: "shortcut should atleas be 2 char long",
		}),
		data: object({
			url: string()
				.url({
					message: "Please enter a valid url",
				})
				.optional(),
			shortlink: string()
				.min(2, {
					message: "shortcut should atleas be 2 char long",
				})
				.optional(),
		}),
	}),
})


/**
 * @openapi
 * components:
 *  schemas:
 *   DeleteShortcutSchema:
 *    type: string
 *    required:
 *     - shortlink
 *    properties:
 *     shortlink:
 *      type: string
 *      default: google
 */
export const deleteShortcutSchema = object({
	params: object({
		shortlink: string({
			required_error: "Please enter a valid shortcut ID",
		}).min(2, {
			message: "shortcut should atleas be 2 char long",
		}),
	}),
})

export type createShortcutInputType = TypeOf<
	typeof createShortcutSchema
>["body"]
export type updateShortcutInputType = TypeOf<
	typeof updateShortcutSchema
>["body"]
export type deleteShortcutInputType = TypeOf<
	typeof deleteShortcutSchema
>["params"]
