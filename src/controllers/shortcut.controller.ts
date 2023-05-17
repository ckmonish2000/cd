import { createShortcutInputType, deleteShortcutInputType, updateShortcutInputType } from "@schemas/shortcut.schema"
import { createShortcut, deleteShortcut, fetchAllUserShortcuts, fetchShotcutById, updateShortcut } from "@services/shortcut.service"
import { AppError } from "@utils/tryCatch"
import { Request, Response } from "express"

export const createShortcutHandler = async (req:Request<unknown,unknown,createShortcutInputType>,res:Response)=>{
	const {shortlink,url} = req.body
	const userId =""    

	const checkShortcut = await fetchShotcutById(shortlink,userId)

	if(checkShortcut){
		throw new AppError("cd409","Shortcut with this name already exists",409)
	}
    
	const newShortcut = await createShortcut(shortlink,url,userId)

	return res.status(200).json(newShortcut)
}

export const updateShortcutHandler = async(req:Request<unknown,unknown,updateShortcutInputType>,res:Response)=>{
	const {data,shortlink} = req.body
	const userId = ""

    
	const checkShortcut = await fetchShotcutById(shortlink,userId)

	if(!checkShortcut){
		throw new AppError("cd404","Shortcut with that name does not exist",404)
	}

	const updatedShortcut = await updateShortcut(shortlink,userId,data)

	return res.status(200).json(updatedShortcut)
}

export const deleteShortcutHandler = async (req:Request<deleteShortcutInputType>,res:Response)=>{
	const {shortlink} = req.params
	const userId = ""

	const deletedShortcut = await deleteShortcut(shortlink,userId)

	return res.status(200).json(deletedShortcut)
}

export const fetchAllUserShortcutsHandler = async (req:Request,res:Response)=>{
	const userId = ""
	const shortcuts = await fetchAllUserShortcuts(userId)
	return res.status(200).json(shortcuts)
}
