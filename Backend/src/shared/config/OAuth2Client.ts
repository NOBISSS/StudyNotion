import{ google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();
const NODE_ENV = process.env.NODE_ENV || "development";
const GOOGLE_CLIENT_ID = NODE_ENV === "production" ? process.env.GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID_DEV;
const GOOGLE_CLIENT_SECRET = NODE_ENV === "production" ? process.env.GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET_DEV;

export const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "postmessage"
);