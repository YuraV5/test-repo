import express, { type Response } from "express";
import { sendEmailService } from "./aws/ses-sendemail";
import { sendWelcomeEmail } from "./aws/send-templated-email";
import { testSendRawEmailWithAttachments } from "./aws/sen-rawemail";
import { getTemplateByName, getTemplateNames } from "./aws/template/get-tempaltes";
import { MOCK_TEMPLATE_DATA, renderTemplateWithData } from "./aws/template/handlebars";

const app = express();
const PORT = process.env.PORT || 3003;


// Middleware to parse incoming JSON payloads
app.use(express.json());

// Service routes
app.get("/health", (req, res: Response<{ status: string; timestamp: Date }>) => {
  res.json({ status: "UP", timestamp: new Date() });
});

app.get('/send-email', async (req: express.Request, res: express.Response) => {
  try {
    const result = await sendEmailService(
      "1vakyura1@gmail.com", 
      "Test letter with Node.js 222", 
      "<h1>Hello!</h1><p>This is a test email sent via <b>Node.js + AWS SES</b>!</p> Hello"
    );

    res.json({ 
      success: true, 
      message: 'Email sent successfully', 
      messageId: result.MessageId 
    });
  } catch (error: any) {
    console.error("Error sending email:", error);

    res.status(500).json({ 
      success: false,
      message: 'Failed to send email', 
      errorType: error.name || 'UnknownError',
      errorMessage: error.message 
    });
  }
});

app.get('/send-templated-email', async (req: express.Request, res: express.Response) => {
  const [recipientEmail, name, userId] = ["1vakyura1@gmail.com", "John Doe", "user123"];

  try {
    const result = await sendWelcomeEmail(
      recipientEmail as string,
      name as string,
      userId as string
    );

    res.json({
      success: true,
      message: 'Templated email sent successfully',
      messageId: result.MessageId
    });
  } catch (error: any) {
    console.error("Error sending templated email:", error);

    res.status(500).json({
      success: false,
      message: 'Failed to send templated email',
      errorType: error.name || 'UnknownError',
      errorMessage: error.message
    });
  }
});

app.get('/send-raw-email', async (req: express.Request, res: express.Response) => {
  try {
    const result = await testSendRawEmailWithAttachments();

    res.json({
      success: true,
      message: 'Raw email with attachments sent successfully',
      messageId: result.MessageId
    });
  } catch (error: any) {
    console.error("Error sending raw email:", error);

    res.status(500).json({
      success: false,
      message: 'Failed to send raw email with attachments',
      errorType: error.name || 'UnknownError',
      errorMessage: error.message
    });
  } });

  app.get('/templates', async (req: express.Request, res: express.Response) => {
    try {
      const templateNames = await getTemplateNames();
      res.json({
        success: true,
        templates: templateNames
      });
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch templates',
        errorType: error.name || 'UnknownError',
        errorMessage: error.message
      });
    }
  });

  app.get('/templates/:templateName', async (req: express.Request, res: express.Response) => {
  const { templateName } = req.params as { templateName: string };

  try {
    const templateDetails = await getTemplateByName(templateName);

    const rendered = renderTemplateWithData(templateDetails, MOCK_TEMPLATE_DATA);

    console.log('\n================ РЕНДЕР ШАБЛОНУ ================');
    console.log(`Назва шаблону: ${templateName}`);
    console.log(`Тема: ${rendered.subject}`);
    console.log('--- HTML ВМІСТ ---');
    console.log(rendered.html);
    console.log('================================================\n');

    res.json({
      success: true,
      template: templateDetails,
      preview: rendered,
      mockDataUsed: MOCK_TEMPLATE_DATA
    });

  } catch (error: any) {
    console.error(`Error fetching template "${templateName}":`, error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch template "${templateName}"`,
      errorType: error.name || 'UnknownError',
      errorMessage: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Service listening at http://localhost:${PORT}`);
});
