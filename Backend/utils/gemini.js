import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// We define a model instance strictly for JSON output
const jsonModel = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash',
  generationConfig: {
    responseMimeType: "application/json",
  }
});

// Generate questions
export const generateQuestions = async (tech, level) => {
  try {
    const prompt = `Generate 5 ${level} level ${tech} interview questions. 
The questions should be 1-2 lines long each.
Return the output strictly as a JSON array of strings.
Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]`;
    
    const result = await jsonModel.generateContent(prompt);
    const text = result.response.text();
    
    // Because we used responseMimeType: "application/json", it will reliably parse
    const questionsArray = JSON.parse(text);
    
    // Ensure we only return 5 strings
    return questionsArray.slice(0, 5);
  } catch (error) {
    console.error('Generate questions error:', error);
    throw error;
  }
}

// Evaluate complete interview
export const evaluateCompleteInterview = async (questions, technology, difficulty) => {
  try {
    // Prepare questions and answers for evaluation
    const qaText = questions.map((q, index) => 
      `Q${index + 1}: ${q.question}\nAnswer: ${q.answer || 'No answer provided'}`
    ).join('\n\n');
    
    const prompt = `
You are an expert technical interviewer evaluating a ${difficulty} level ${technology} developer interview.

Here are the interview questions and the candidate's answers:

${qaText}

Please provide:
1. An overall score out of 10 (strictly considering ${difficulty} level expectations)
2. Overall feedback in 2-3 lines covering strengths and specific areas for improvement

Respond ONLY with a JSON object containing 'score' (number) and 'feedback' (string).`;

    const result = await jsonModel.generateContent(prompt);
    const text = result.response.text();
    
    // Because we used responseMimeType: "application/json", it will reliably parse
    const evaluation = JSON.parse(text);
    
    // Ensure score is within bounds
    evaluation.score = Math.min(Math.max(Number(evaluation.score) || 0, 0), 10);
    
    return evaluation;
    
  } catch (error) {
    console.error('Complete interview evaluation error:', error);
    throw error;
  }
}
