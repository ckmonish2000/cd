import {
	fetchAccessListForUrlInputType,
	permissionInputType,
	revokePermissionInputType,
} from "@schemas/permission.schema"
import {
	addUserToAccessList,
	fetchAccessListById,
	fetchAccessListForUrl,
	removeUserFromAccessList,
} from "@services/permission.service"
import {fetchShotcutById} from "@services/shortcut.service"
import {AppError} from "@utils/tryCatch"
import {Request, Response} from "express"

export const addUserToAccessListHandler = async (
	req: Request<unknown, unknown, permissionInputType>,
	res: Response
) => {
	const {shortlink, userId} = req.body
	const ownerId = req.session.user?.id

	const validateOwner = await fetchShotcutById(shortlink, ownerId)

	if (!validateOwner) {
		throw new AppError(
			"cd404",
			"Could not provide permission as the requested shotcut was not found",
			404
		)
	}

	const memberData = await addUserToAccessList(ownerId, userId, shortlink)

	res.status(201).json({
		id: memberData.id,
	})
}

export const revokeUserToAccessListHandler = async (
	req: Request<revokePermissionInputType>,
	res: Response
) => {
	const {accessListId} = req.params
	const ownerId = req.session.user?.id

	const validateOwner = await fetchAccessListById(accessListId)

	if (validateOwner?.shortcutUserId !== ownerId) {
		throw new AppError("cd403", "You do not have permission to proceed", 403)
	}

	const revokedMember = await removeUserFromAccessList(accessListId)

	res.status(200).json(revokedMember)
}

export const fetchAccessListForUrlHandler = async (
	req: Request<fetchAccessListForUrlInputType>,
	res: Response
) => {
	const {shortlink} = req.params
	const ownerId = req.session.user?.id

	const validateOwner = await fetchShotcutById(shortlink, ownerId)

	if (!validateOwner) {
		throw new AppError(
			"cd404",
			"Could not provide permission as the requested shotcut was not found",
			404
		)
	}

	const accessList = await fetchAccessListForUrl(ownerId, shortlink)

	res.status(200).json(accessList)
}
