import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateReport(topic: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // ✅ use your actual model

  const chat = model.startChat();

  const instructions = `
Format the content in Markdown using proper headings (#, ##, ###) and paragraphs. 
Use an academic tone. Keep it detailed and professional.
`;

  const sections = [
    {
      title: 'Executive Summary and Introduction',
      prompt: `Write an executive summary and introduction about "${topic}". Include background, objectives, and scope.`
    },
    {
      title: 'Literature Review',
      prompt: `Write a literature review about "${topic}". Include current research, related works, and theories.`
    },
    {
      title: 'Methodology',
      prompt: `Describe the research methodology for "${topic}". Include design, data collection, and analysis techniques.`
    },
    {
      title: 'Results and Analysis',
      prompt: `Provide results and analysis for a project on "${topic}". Include key findings and interpretations.`
    },
    {
      title: 'Discussion and Implications',
      prompt: `Write a discussion section for "${topic}". Cover limitations, practical implications, and future scope.`
    }
  ];

  let fullReport = `# Project Report: ${topic}\n\n`;

  try {
    for (const section of sections) {
      const res = await chat.sendMessage(`${section.prompt}\n${instructions}`);
      const response = await res.response;
      const text = await response.text();

      fullReport += `## ${section.title}\n\n${text}\n\n`;
    }

    return fullReport;
  } catch (error) {
    console.error("❌ Error generating report:", error);
    throw error;
  }
}
