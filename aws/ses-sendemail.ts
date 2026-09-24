import { SendEmailCommand } from "@aws-sdk/client-ses";
import {sesClient} from "./aws-client";

export async function sendEmailService(to: string, subject: string, htmlContent: string) {
  const params = {
    Source: "1vakyura1@gmail.com",
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: {
        Html: { Data: htmlContent, Charset: "UTF-8" },
      },
    },
  };

  const command = new SendEmailCommand(params);
  return await sesClient.send(command);
}