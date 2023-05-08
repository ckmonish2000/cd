import {object,string,TypeOf} from "zod"

export const createUserSchema = object({
	body:object({
		username:string({required_error:"username is a required field"}),
		email:string({required_error:"Email is a required field"}).email({message:"Not a valid email address"}),
		password:string({required_error:"password is a required field"}).min(8,{message:"password should atleast be 8 charachters  long"}),
		confirmPassword:string({required_error:"password is a required field"}),
	}).refine((data)=>{return data.password === data.confirmPassword},{message:"Both password and confirm password must be same"})
})

export type createUserInputType = TypeOf<typeof createUserSchema>["body"]