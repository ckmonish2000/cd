import { redirectInputInputType } from "@schemas/redirect.schema"
import { fetchShortcutForUser } from "@services/redirect.service"
import { AppError } from "@utils/tryCatch"
import { Request, Response } from "express"

export const redirectToShortcut = async (req:Request<redirectInputInputType>,res:Response)=>{
	const userId = req.session.user?.id
	const {shortcut} = req.params

	const redirectionData = await fetchShortcutForUser(shortcut,userId)

	if(!redirectionData){
		throw new AppError("cd404","Could not find the shortcut, Either create or request permission for the shotcut",404)
	}

	res.status(302).redirect(redirectionData.url)
}