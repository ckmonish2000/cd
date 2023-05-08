import { Request,Response } from "express"
import { createUserInputType } from "@schemas/user.schema"

export async function createUserHandler(req:Request<unknown,unknown,createUserInputType>,res:Response){
	const body = req.body
	res.send(body)
}