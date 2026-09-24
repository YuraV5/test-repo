import { 
  ListTemplatesCommand, 
  GetTemplateCommand 
} from "@aws-sdk/client-ses";

import { sesClient } from "../aws-client";

/**
 * Повертає масив імен усіх доступних шаблонів в SES
 * @returns {Promise<string[]>} Масив імен шаблонів, наприклад: ["WelcomeTemplate", "ResetPassword"]
 */
export const getTemplateNames = async () => {
  try {
    const command = new ListTemplatesCommand({});
    const response = await sesClient.send(command);
    
    // SES повертає масив об'єктів { Name, CreatedTimestamp }, витягуємо тільки імена
    return response.TemplatesMetadata?.map(t => t.Name) || [];
  } catch (error) {
    console.error("Помилка отримання списку шаблонів:", error);
    throw error;
  }
};

/**
 * Повертає деталі конкретного шаблону за його ім'ям
 * @param {string} templateName - Назва шаблону
 * @returns {Promise<{templateName: string, subject: string, html: string, text: string}>}
 */
export const getTemplateByName = async (templateName: string) => {
  try {
    const command = new GetTemplateCommand({ TemplateName: templateName });
    const response = await sesClient.send(command);
    
    const template = response.Template;
    return {
      templateName: template?.TemplateName,
      subject: template?.SubjectPart,
      html: template?.HtmlPart,
      text: template?.TextPart,
    };
  } catch (error) {
    console.error(`Помилка отримання шаблону "${templateName}":`, error);
    throw error;
  }
};