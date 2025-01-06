import { Router } from "oak/router"
import * as DataService from "../../services/data.service.ts"

const router = new Router({ prefix: "/data"});

router.post("/run_export", async (ctx) => {
    await DataService.exportToCsv();
})

export default router;