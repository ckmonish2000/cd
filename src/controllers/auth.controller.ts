import {Request, Response} from "express"
import {registerUserInputType, userLoginInputType} from "@schemas/auth.schema"
import {checkUserWithEmail, createNewUser} from "@services/auth.service"
import logger from "@utils/logger"
import {AppError, tryCatch} from "@utils/tryCatch"
import {validatePassword} from "@utils/auth"
import {cache} from "@root/db"

export const registerUserHandler = async (
	req: Request<unknown, unknown, registerUserInputType>,
	res: Response
) => {
	const {email, password} = req.body
	const registered = await createNewUser(email, password)
	res.status(201).json({
		id: registered?.id,
	})
}

export const userLoginHandler = async (
	req: Request<unknown, unknown, userLoginInputType>,
	res: Response
) => {
	const {email, password} = req.body

	if (req.session.user?.id) {
		res.status(200).send("You are already logged in")
	}

	const user = await checkUserWithEmail(email)

	if (!user) {
		throw new AppError("cd404", "Please consider registering first", 404)
	}

	const isValidPassword = await validatePassword(password, user.password)

	if (!isValidPassword) {
		throw new AppError("cd401", "Invalid email or password", 401)
	}

	req.session.user = {
		id: user.id,
		email: user.email,
	}

	res.status(200).send("Welcome To CD")
}

export const userLogoutHandler = (req: Request, res: Response) => {
	req.session.destroy((err) => {
		if (err) {
			logger.error(err)
		} else {
			res.send("visit again")
		}
	})
}
