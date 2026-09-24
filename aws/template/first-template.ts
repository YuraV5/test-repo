import { CreateTemplateCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../aws-client";

async function createTemplate() {
  const params = {
    Template: {
      TemplateName: "WelcomeTemplate", // Unique identifier for your template
      SubjectPart: "Welcome to our platform, {{name}}!",
      TextPart: "Hello {{name}},\n\nThank you for signing up. Your account ID is {{userId}}.",
      HtmlPart: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello, {{name}}!</h2>
          <p>Thank you for signing up. Your account ID is <strong>{{userId}}</strong>.</p>
        </div>
      `,
    },
  };  

  try {
    const command = new CreateTemplateCommand(params);
    await sesClient.send(command);
    console.log("Template created successfully!");
  } catch (err) {
    console.error("Error creating template:", err);
  }
}

createTemplate();