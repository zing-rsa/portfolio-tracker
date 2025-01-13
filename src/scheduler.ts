import * as ScheduleService from "./services/schedule.service.ts";
import * as PricesService from "./services/prices.service.ts";
import * as DataService from "./services/data.service.ts";

export function start() {
    console.log("--------------------");
    Deno.cron("Scheduler ping", { minute: { every: 1 } }, handleSchedules);
    console.log("Starting scheduler");
}

async function handleSchedules() {
    console.log("handling schedules")
    const dueSchedules = await ScheduleService.getDueSchedules();

    for (const schedule of dueSchedules) {
        const func = functionMapper(schedule.function_name);
        if (!func) throw new Error("Scheduled function is not mapped");

        try {
            await func();
        } catch (e) {
            console.error("Error while executing scheduled function: ", e);
        }
        await ScheduleService.updateScheduleLastRun(schedule.id);

    }
}

function functionMapper(functionName: string): Function | undefined {
    return {
        "updateTop20Prices": PricesService.updateTop20Prices,
        "saveStateToDrive": DataService.saveStateToDrive,
    }[functionName];
}
