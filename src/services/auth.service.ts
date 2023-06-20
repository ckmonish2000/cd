import { User } from "@prisma/client"
import { hashPassword } from "@utils/auth"
import { prisma } from "@root/db"
import { databaseResponseTimeHistogram } from "@utils/metrics"

export const createNewUser = async (
	email: string,
	password: string
): Promise<User> => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "createNewUser"
	}

	try {
		const hashedpassword = await hashPassword(password)

		const newUser = await prisma.user.create({
			data: {
				email: email,
				password: String(hashedpassword),
			},
		})

		merticsTimer({ ...metricsLable, success: "true" })
		return newUser
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}

export const checkUserWithEmail = async (
	email: string
): Promise<User | null> => {
	const merticsTimer = databaseResponseTimeHistogram.startTimer()
	const metricsLable = {
		operation: "checkUserWithEmail"
	}

	try {
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		})

		merticsTimer({ ...metricsLable, success: "true" })
		return user
	} catch (err) {
		merticsTimer({ ...metricsLable, success: "false" })
		throw err
	}
}
