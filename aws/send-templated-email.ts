import { SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./aws-client";

export async function sendWelcomeEmail(recipientEmail: string = "1vakyura1@gmail.com", userName: string, userId: string) {
  const params = {
    Source: "1vakyura1@gmail.com", // Must be a verified identity in your region
    Destination: {
      ToAddresses: [recipientEmail], // Must be verified if in Sandbox mode
    },
    Template: "WelcomeTemplate", // Name of the template created in Step 1
    TemplateData: JSON.stringify({
      name: userName,
      userId: userId,
    }),
  };

  try {
    const command = new SendTemplatedEmailCommand(params);
    const result = await sesClient.send(command);
    console.log("Templated email sent! Message ID:", result.MessageId);
    return result;
  } catch (err) {
    console.error("Error sending templated email:", err);
    throw err;
  }
}