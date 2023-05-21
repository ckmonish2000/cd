import { addUserToAccessListHandler, fetchAccessListForUrlHandler, revokeUserToAccessListHandler } from "@controllers/permission.controller"
import authorizationMiddleware from "@middleware/authorizationMiddleware"
import validateResource from "@middleware/validateResource"
import { fetchAccessListForUrlInputSchema } from "@schemas/permission.schema"
import { revokePermissionInputSchema } from "@schemas/permission.schema"
import { createPermissionInputSchema } from "@schemas/permission.schema"
import { tryCatch } from "@utils/tryCatch"
import {Router} from "express"

const router = Router()

router.post("/api/permission",authorizationMiddleware,validateResource(createPermissionInputSchema),tryCatch(addUserToAccessListHandler))
router.delete("/api/permission/:accessListId",authorizationMiddleware,validateResource(revokePermissionInputSchema),tryCatch(revokeUserToAccessListHandler))
router.get("/api/permission/:shortlink",authorizationMiddleware,validateResource(fetchAccessListForUrlInputSchema),tryCatch(fetchAccessListForUrlHandler))

export default router