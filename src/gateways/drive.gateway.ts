import { google } from  "npm:googleapis";

const scopes = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({credentials: {
        type: "service_account",
        project_id: Deno.env.get("GOOGLE_PROJECT_ID")!,
        private_key: Deno.env.get("GOOGLE_PRIV_KEY")!.replace(/\\n/g, '\n'),
        private_key_id: Deno.env.get("GOOGLE_PRIV_KEY_ID")!,
        client_email: Deno.env.get("GOOGLE_CLIENT_EMAIL")!,
        client_id: Deno.env.get("GOOGLE_CLIENT_ID")!,
        universe_domain: "googleapis.com"
 }, scopes: scopes});
const drive = google.drive({ version: "v3", auth });

export async function uploadCsvFile(filename: string, data: string) {

    const res = await drive.files.list({
        pageSize: 10,
        fields: "nextPageToken, files(id, name)",
        orderBy: "createdTime"
    });

    if (!res?.data?.files?.length)
        throw new Error("Listing google drive files returned unexpected result")
    
    const folderId = res.data.files.find(f => f.name == 'crypto')?.id;
    
    if (!folderId) 
        throw new Error("Failed to determine google drive folder Id to upload to");

    await drive.files.create({
        requestBody: {
            name: filename,
            mimeType: 'text/csv',
            parents: [ folderId ]
        },
        media: {
            mimeType: 'text/csv',
            body: data
        }
    });
}