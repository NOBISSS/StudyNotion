import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();
const NODE_ENV = process.env.NODE_ENV || "development";
const GOOGLE_CLIENT_ID = NODE_ENV === "production" ? process.env.GOOGLE_CLIENT_ID_PROD : process.env.GOOGLE_CLIENT_ID_DEVELOPMENT;
const GOOGLE_CLIENT_SECRET = NODE_ENV === "production" ? process.env.GOOGLE_CLIENT_SECRET_PROD : process.env.GOOGLE_CLIENT_SECRET_DEVELOPMENT;
export const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "postmessage");
//# sourceMappingURL=OAuth2Client.js.map