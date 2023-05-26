import bcrypt from "bcrypt"
import logger from "./logger"

export const hashPassword = async (
	password: string
): Promise<string | undefined> => {
	try {
		const salt = await bcrypt.genSalt(15)
		const hash = await bcrypt.hash(password, salt)
		return hash
	} catch (err: any) {
		logger.error("Error hashing password: " + err?.message)
		return undefined
	}
}

export const validatePassword = async (
	inputPassword: string,
	hashedPassword: string
): Promise<boolean> => {
	const check = bcrypt.compare(inputPassword, hashedPassword)
	return check
}
