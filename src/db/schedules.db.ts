import { Schedule } from "../models.ts";
import { pgClient } from "./db.ts"

export async function getDueSchedules(): Promise<Schedule[]> {
    const query = `
    select *
    from scheduling.schedules s
    where (now() at time zone 'utc' > s.run_datetime and s.last_run_datetime is null) or
    (now() at time zone 'utc' > coalesce(s.last_run_datetime, to_timestamp(0)) + (s.run_interval_minutes::text || ' minutes')::interval);
    `;

    const results = await pgClient.queryObject<Schedule>(query);
    return results.rows;
}

export async function updateScheduleLastRun(id: string) {
    // truncates the date to the minute, so that it will always be in the past when the cron schedule runs just* after the minute
    const query = `
    update scheduling.schedules
    set last_run_datetime = date_trunc('minute', now() at time zone 'utc')
    where id = '${id}';
    `;

    const results = await pgClient.queryObject<Schedule>(query);
    return results.rows;
}