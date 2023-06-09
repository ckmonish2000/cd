import bcrypt from "bcrypt"
import logger from "./logger"

/**
 * 
 * @param password 
 * @returns {Promise<string|undefined>}
 */
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

/**
 * 
 * @param inputPassword 
 * @param hashedPassword 
 * @returns {Promise<boolean>}
 */
export const validatePassword = async (
	inputPassword: string,
	hashedPassword: string
): Promise<boolean> => {
	const check = bcrypt.compare(inputPassword, hashedPassword)
	return check
}
