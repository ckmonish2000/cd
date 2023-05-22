import { TypeOf, object, string } from "zod"

export const fetchAnalyticsInputSchema = object({
	params:object({
		shortcut:string({required_error:"You have to provide a name to your links."}).min(2,{message:"shortcut should atleas be 2 char long"}),
	})
})

export type fetchAnalyticsInputType = TypeOf<typeof fetchAnalyticsInputSchema>["params"]