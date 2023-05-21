import { Request, Response } from "express"

export type CustomHandlerType = (req: Request<any, any, any>, res: Response) =>(
    void | 
    Promise<void> |
    Promise<Response<any, Record<string, any>>>
    )