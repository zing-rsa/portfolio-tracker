import { Router } from "oak/router"
import * as DataService from "../../services/data.service.ts"

const router = new Router({ prefix: "/data"});

router.post("/run_export", async (ctx) => {
    await DataService.exportToCsv();
})

router.post("/import_from_csv", async (ctx) => {
    const body = await ctx.request.body;

    const form: FormData = await body.formData()
    const file: File = form.get("file") as File;
    const bytes = await file.bytes()
    const csv = new TextDecoder().decode(bytes)

    await DataService.importFromCsv(csv, true);
})

export default router;