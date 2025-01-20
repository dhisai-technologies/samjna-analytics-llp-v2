import { BlobServiceClient } from "@azure/storage-blob";
import { Notifier } from "@lib/utils/tools";
import nodemailer from "nodemailer";
import { config } from "./config";
import { db } from "./db";

export const notifier = new Notifier(db);
export const blobServiceClient = new BlobServiceClient(
  `https://${config.AZURE_ACCOUNT_NAME}.blob.core.windows.net/?${config.AZURE_SAS_TOKEN}`,
);
export const containerClient = blobServiceClient.getContainerClient(config.AZURE_CONTAINER_NAME);
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.NODEMAILER_USER,
    pass: config.NODEMAILER_PASS,
  },
});
