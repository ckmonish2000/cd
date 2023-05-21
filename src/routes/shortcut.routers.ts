import {Router} from "express"
import validateResource from "@middleware/validateResource"
import { createShortcutSchema,updateShortcutSchema } from "@schemas/shortcut.schema"
import { createShortcutHandler, deleteShortcutHandler, fetchAllUserShortcutsHandler, updateShortcutHandler } from "@controllers/shortcut.controller"
import { deleteShortcutSchema } from "@schemas/shortcut.schema"
import authorizationMiddleware from "@middleware/authorizationMiddleware"
import { tryCatch } from "@utils/tryCatch"

const router = Router()

router.post("/api/shortcut",authorizationMiddleware,validateResource(createShortcutSchema),tryCatch(createShortcutHandler))
router.put("/api/shortcut",authorizationMiddleware,validateResource(updateShortcutSchema),tryCatch(updateShortcutHandler))
router.delete("/api/shortcut/:shortlink",authorizationMiddleware,validateResource(deleteShortcutSchema),tryCatch(deleteShortcutHandler))
router.get("/api/shortcut",authorizationMiddleware,tryCatch(fetchAllUserShortcutsHandler))

export default router