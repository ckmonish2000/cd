import {object,string,TypeOf} from "zod"

export const createShortcutSchema = object({
	body:object({
		shortlink:string({required_error:"You have to provide a name to your links."}).min(2,{message:"shortcut should atleas be 2 char long"}),
		url:string({required_error:"URL is required"}).url({message:"Please enter a valid url"})
	})
})

export const updateShortcutSchema = object({
	body:object({
		shortlink:string({required_error:"You have to provide a name to your links."}).min(2,{message:"shortcut should atleas be 2 char long"}),
		data:object({
			url:string().url({message:"Please enter a valid url"}).optional(),
			shortlink:string().min(2,{message:"shortcut should atleas be 2 char long"}).optional(),
		})
	})
})

export const deleteShortcutSchema = object({
	params:object({
		shortlink:string({required_error:"Please enter a valid shortcut ID"}).min(2,{message:"shortcut should atleas be 2 char long"})
	})
})


export type createShortcutInputType = TypeOf<typeof createShortcutSchema>["body"]
export type updateShortcutInputType = TypeOf<typeof updateShortcutSchema>["body"]
export type deleteShortcutInputType = TypeOf<typeof deleteShortcutSchema>["params"]