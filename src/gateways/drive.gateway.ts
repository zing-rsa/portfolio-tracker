import { google } from  "npm:googleapis";

const credentialFilename = "credentials.json";
const scopes = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({keyFile: credentialFilename, scopes: scopes});
const drive = google.drive({ version: "v3", auth });

export async function uploadCsvFile(filename: string, data: string) {

    const res = await drive.files.list({
        pageSize: 10,
        fields: "nextPageToken, files(id, name)",
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