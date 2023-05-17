import { TypeOf, object, string } from "zod"

export const redirectInputSchema = object({
	params:object({
		shortcut:string({required_error:"Shortcut name can not be empty"})
	})
})

export type redirectInputInputType = TypeOf<typeof redirectInputSchema>["params"]