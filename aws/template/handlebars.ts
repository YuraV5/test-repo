import Handlebars from 'handlebars';

// Фейкові дані для підстановки в шаблон
export const MOCK_TEMPLATE_DATA = {
  name: 'Олексій',
  userId: 'usr_998234',
  companyName: 'My Awesome App',
  supportEmail: 'support@example.com'
};

export interface ITemplateDetails {
  templateName?: string;
  subject?: string;
  html?: string;
  text?: string;
}

export interface IRenderedTemplate {
  subject: string;
  html: string;
  text: string;
}

export const renderTemplateWithData = (
  template: ITemplateDetails, 
  data: Record<string, any>
): IRenderedTemplate => {
  // Фолбек на порожній рядок '', якщо значення undefined
  const compileSubject = Handlebars.compile(template.subject || '');
  const compileHtml = Handlebars.compile(template.html || '');
  const compileText = Handlebars.compile(template.text || '');

  return {
    subject: compileSubject(data),
    html: compileHtml(data),
    text: compileText(data)
  };
};