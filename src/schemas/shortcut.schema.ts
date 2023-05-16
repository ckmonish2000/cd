import {object,string,TypeOf} from "zod"

export const createShortcutSchema = object({
	body:object({
		shortlink:string({required_error:"You have to provide a name to your links."}),
		url:string({required_error:"URL is required"}).url({message:"Please enter a valid url"})
	})
})

export const updateShortcutSchema = Object({
	body:object({
		id:string({required_error:"ID cant be empty"}).uuid(),
		shortlink:string({required_error:"You have to provide a name to your links."}),
		url:string({required_error:"URL is required"}).url({message:"Please enter a valid url"})
	})
})

export const deleteShortcutSchema = object({
	params:object({
		shortcutId:string({required_error:"Please enter a valid shortcut ID"}).uuid()
	})
})

export const shortcutExpanderSchema = object({
	params:object({
		shortcut:string({required_error:"Shortcut name can not be empty"})
	})
})

export type createShortcutInputType = TypeOf<typeof createShortcutSchema>["body"]
export type updateShortcutInputType = TypeOf<typeof updateShortcutSchema>["body"]
export type deleteShortcutInputType = TypeOf<typeof deleteShortcutSchema>["params"]
export type shortcutExpanderInputType = TypeOf<typeof shortcutExpanderSchema>["params"]