import {object, string, TypeOf} from "zod"

/**
 * @openapi
 * components:
 *  schemas:
 *   RegisterUserSchema:
 *    type: object
 *    required:
 *     - email
 *     - password
 *     - confirmPassword
 *    properties:
 *     email:
 *      type: string
 *      default: ckmonish3000@gmail.com
 *     password:
 *      type: string
 *      default: admin@123
 *     confirmPassword:
 *      type: string
 *      default: admin@123
 */
export const registerUserSchema = object({
	body: object({
		email: string({
			required_error: "Email is a required field",
		}).email({
			message: "Not a valid email address",
		}),
		password: string({
			required_error: "password is a required field",
		}).min(8, {
			message: "password should atleast be 8 charachters long",
		}),
		confirmPassword: string({
			required_error: "confirm password is a required field",
		}),
	}).refine(
		(data) => {
			return data.password === data.confirmPassword
		},
		{
			message: "Both password and confirm password must be same",
		}
	),
})


/**
 * @openapi
 * components:
 *  schemas:
 *   UserLoginSchema:
 *    type: object
 *    required: 
 *     - email
 *     - password
 *    properties:
 *     email:
 *      type: string
 *      default: ckmonish3000@gmail.com
 *     password:
 *      type: string
 *      default: admin@123 
 */
export const userLoginSchema = object({
	body: object({
		email: string({
			required_error: "Email can not be empty",
		}).email({
			message: "Not a valid email address",
		}),
		password: string({
			required_error: "Please enter a valid password",
		}).min(8, {
			message: "password should atleast be 8 charachters  long",
		}),
	}),
})

export type registerUserInputType = TypeOf<typeof registerUserSchema>["body"]
export type userLoginInputType = TypeOf<typeof userLoginSchema>["body"]
