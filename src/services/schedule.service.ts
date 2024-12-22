import { ScheduleDb } from "../db/mod.ts"

export async function getDueSchedules() {
    return await ScheduleDb.getDueSchedules();
}

export async function updateScheduleLastRun(id: string) {
    await ScheduleDb.updateScheduleLastRun(id);
}