import {Router} from "express"
import { renderServiceDetail, renderServices } from "../controllers/views.controller.js"

const router = Router();
router.get("/services", renderServices)
router.get("/services/:sid", renderServiceDetail)

export default router;