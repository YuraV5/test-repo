import { SendRawEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./aws-client";

export async function testSendRawEmailWithAttachments() {
  const boundary = "----=_Part_" + Date.now().toString(16);
  
  const from = "1vakyura1@gmail.com"; 
  const to = "1vakyura1@gmail.com";     
  const subject = "Тест: Лист з двома вкладеннями";

  const file1Name = "hello.txt";
  const file1ContentBase64 = Buffer.from("Hello").toString("base64");

  const file2Name = "info.txt";
  const file2ContentBase64 = Buffer.from("Hello from second file!").toString("base64");

  const rawMessage = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    ``,
    // --- ТЕКСТ ЛИСТА ---
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 8bit`,
    ``,
    `<p>Це тестовий лист з двома текстовими base64 вкладеннями.</p>`,
    ``,
    // --- Attachment 1 (hello.txt) ---
    `--${boundary}`,
    `Content-Type: text/plain; name="${file1Name}"`,
    `Content-Description: ${file1Name}`,
    `Content-Disposition: attachment; filename="${file1Name}"`,
    `Content-Transfer-Encoding: base64`,
    ``,
    file1ContentBase64,
    ``,
    // --- Attachment 2 (info.txt) ---
    `--${boundary}`,
    `Content-Type: text/plain; name="${file2Name}"`,
    `Content-Description: ${file2Name}`,
    `Content-Disposition: attachment; filename="${file2Name}"`,
    `Content-Transfer-Encoding: base64`,
    ``,
    file2ContentBase64,
    ``,
    // --- End of message ---
    `--${boundary}--`
  ].join("\r\n");

  try {
    const command = new SendRawEmailCommand({
      RawMessage: {
        Data: Buffer.from(rawMessage),
      },
    });

    const response = await sesClient.send(command);
    console.log("Успішно надіслано! Message ID:", response.MessageId);
    return response;
  } catch (error) {
    console.error("Помилка під час надсилання:", error);
    throw error;
  }
}