import { Router } from "oak/router"
import * as DataService from "../../services/data.service.ts"

const router = new Router({ prefix: "/data"});

router.post("/export_csv", async (ctx) => {
    const res = await DataService.exportToCsv();

    ctx.response.body = res;
    ctx.response.status = 200;
})

router.post("/import_csv", async (ctx) => {
    const body = await ctx.request.body;

    const form: FormData = await body.formData()
    const file: File = form.get("file") as File;
    const bytes = await file.bytes()
    const csv = new TextDecoder().decode(bytes)

    await DataService.importFromCsv(csv, true);
    
    ctx.response.status = 200;
})

router.post("/save_state", async (ctx) => {
    
    await DataService.saveStateToDrive();
    
    ctx.response.status = 200;
})


export default router;