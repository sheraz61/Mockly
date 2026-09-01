import mongoose from 'mongoose';
import Interview from '../models/Interview.model.js';
import { generateQuestions, evaluateCompleteInterview } from '../utils/gemini.js';

// START INTERVIEW
export const startInterview = async (req, res) => {
  try {
    const { technology, difficulty } = req.body;
    const userId = req.user.id;
    // Validation
    if (!technology || !difficulty) {
      return res.status(400).json({
        message: "Technology and difficulty are required",
        success: false
      });
    }
    // Check if user has active interview
    const activeInterview = await Interview.findOne({
      userId,
      status: 'active'
    });
    if (activeInterview) {
      return res.status(400).json({
        message: "You already have an active interview. Complete it first.",
        success: false
      });
    }
    // Generate 5 questions using Gemini
    console.log('Generating questions...');
    const questionTexts = await generateQuestions(technology, difficulty);
    // Create new interview
    const interview = new Interview({
      userId,
      technology,
      difficulty,
      questions: questionTexts.map(q => ({ 
        question: q,
        answer: ""
      }))
    });
    await interview.save();
    
    res.status(200).json({
      success: true,
      message: "Interview started successfully",
      data: {
        interviewId: interview._id,
        question: interview.questions[0].question,
        questionNumber: 1,
        totalQuestions: interview.questions.length,
        technology: interview.technology,
        difficulty: interview.difficulty
      }
    });
    
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ 
      message: "Failed to start interview: " + error.message, 
      success: false 
    });
  }
};

// SUBMIT ANSWER
export const submitAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const { id } = req.params;
    const userId = req.user.id;
    
    // Validation
    if (!answer || !answer.trim()) {
      return res.status(400).json({
        message: "Answer is required",
        success: false
      });
    }
    
    // Find interview
    const interview = await Interview.findOne({
      _id: id,
      userId: userId,
      status: 'active'
    });
    if (!interview) {
      return res.status(404).json({
        message: "Active interview not found",
        success: false
      });
    }
    const currentIndex = interview.currentQuestionIndex;
    
    // Check if current question index is valid
    if (currentIndex >= interview.questions.length) {
      return res.status(400).json({
        message: "Interview already completed",
        success: false
      });
    }
    
    // Save answer for current question
    interview.questions[currentIndex].answer = answer.trim();
    
    // Move to next question
    interview.currentQuestionIndex += 1;
    
    // Check if interview completed
    if (interview.currentQuestionIndex >= interview.questions.length) {
      interview.status = 'completed';
      await interview.save();
      
      return res.status(200).json({
        success: true,
        completed: true,
        message: "Interview completed successfully! Processing your results...",
        data: {
          id: interview._id,
          totalQuestions: interview.questions.length
        }
      });
    }
    // Save progress and return next question
    await interview.save();
    const nextQuestion = interview.questions[interview.currentQuestionIndex];
    res.status(200).json({
      success: true,
      completed: false,
      message: "Answer submitted successfully",
      data: {
        nextQuestion: nextQuestion.question,
        questionNumber: interview.currentQuestionIndex + 1,
        totalQuestions: interview.questions.length
      }
    });
    
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ 
      message: "Failed to submit answer: " + error.message, 
      success: false 
    });
  }
};

// GET RESULTS
export const getResults = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user.id;
    // Find completed interview
    const interview = await Interview.findOne({
      _id: interviewId,
      userId: userId,
      status: 'completed'
    });
    
    if (!interview) {
      return res.status(404).json({
        message: "Completed interview not found",
        success: false
      });
    }
    // If already evaluated, return cached results
    if (interview.overallScore !== undefined && interview.feedback) {
      return res.status(200).json({
        success: true,
        message: "Results ready",
        data: {
          interviewId: interview._id,
          technology: interview.technology,
          difficulty: interview.difficulty,
          overallScore: interview.overallScore,
          feedback: interview.feedback,
          totalQuestions: interview.questions.length,
          completedAt: interview.updatedAt,
        }
      });
    }
    // Evaluate with Gemini AI
    console.log('Evaluating interview with AI...');
    try {
      const evaluation = await evaluateCompleteInterview(
        interview.questions,
        interview.technology,
        interview.difficulty
      );
      
      // Save evaluation results
      interview.overallScore = evaluation.score;
      interview.feedback = evaluation.feedback;
      await interview.save();
      
      res.status(200).json({
        success: true,
        message: "Interview evaluated successfully",
        data: {
          interviewId: interview._id,
          technology: interview.technology,
          difficulty: interview.difficulty,
          overallScore: evaluation.score,
          feedback: evaluation.feedback,
          percentage: Math.round((evaluation.score / 10) * 100),
          totalQuestions: interview.questions.length,
          completedAt: interview.updatedAt,
         
        }
      });
      
    } catch (aiError) {
      console.error('AI Evaluation failed, using fallback:', aiError.message);
      
      // Fallback evaluation
      const fallbackEvaluation = basicEvaluation(interview.questions, interview.technology, interview.difficulty);
      
      interview.overallScore = fallbackEvaluation.score;
      interview.feedback = fallbackEvaluation.feedback;
      await interview.save();
      
      res.status(200).json({
        success: true,
        message: "Interview evaluated successfully (fallback evaluation)",
        data: {
          interviewId: interview._id,
          technology: interview.technology,
          difficulty: interview.difficulty,
          overallScore: fallbackEvaluation.score,
          feedback: fallbackEvaluation.feedback,
          percentage: Math.round((fallbackEvaluation.score / 10) * 100),
          totalQuestions: interview.questions.length,
          completedAt: interview.updatedAt,
        }
      });
    }
    
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ 
      message: "Failed to get results: " + error.message, 
      success: false 
    });
  }
};

// GET INTERVIEW HISTORY
export const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const interviews = await Interview.find({ 
      userId: userId,
      status: 'completed',
      overallScore: { $exists: true }
    })
    .select('technology difficulty overallScore createdAt')
    .sort({ createdAt: -1 })
    .limit(20); // Latest 20 interviews
    
    res.status(200).json({ 
      success: true,
      message: "Interview history fetched successfully",
      data: {
        interviews: interviews.map(interview => ({
          id: interview._id,
          technology: interview.technology,
          difficulty: interview.difficulty,
          score: interview.overallScore,
          percentage: Math.round((interview.overallScore / 10) * 100),
          completedAt: interview.createdAt
        })),
        totalInterviews: interviews.length
      }
    });
    
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ 
      message: "Failed to fetch history: " + error.message, 
      success: false 
    });
  }
};

// GET ANALYTICS
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    // 1. Performance Over Time (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const performanceTrend = await Interview.aggregate([
      { 
        $match: { 
          userId: userObjectId,
          status: 'completed',
          overallScore: { $exists: true },
          createdAt: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          averageScore: { $avg: "$overallScore" },
          interviewsCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 2. Strengths by Technology
    const techStrengths = await Interview.aggregate([
      { 
        $match: { 
          userId: userObjectId,
          status: 'completed',
          overallScore: { $exists: true }
        } 
      },
      {
        $group: {
          _id: "$technology",
          averageScore: { $avg: "$overallScore" },
          interviewsCount: { $sum: 1 }
        }
      },
      { $sort: { averageScore: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: {
        performanceTrend: performanceTrend.map(item => ({
          date: item._id,
          score: Math.round(item.averageScore * 10) / 10,
          count: item.interviewsCount
        })),
        techStrengths: techStrengths.map(item => ({
          technology: item._id || 'General',
          score: Math.round(item.averageScore * 10) / 10,
          count: item.interviewsCount
        }))
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      message: "Failed to fetch analytics: " + error.message, 
      success: false 
    });
  }
};

// Fallback basic evaluation function
function basicEvaluation(questions, technology, difficulty) {
  let totalScore = 0;
  let answeredCount = 0;
  
  questions.forEach(q => {
    if (q.answer && q.answer.trim()) {
      answeredCount++;
      const answerLength = q.answer.trim().length;
      
      // Length-based scoring
      if (answerLength > 20) totalScore += 2;
      if (answerLength > 50) totalScore += 2;
      if (answerLength > 100) totalScore += 1;
      
      // Technical keywords
      const keywords = ['function', 'variable', 'object', 'method', 'component', 'state', 'event', 'data', 'API'];
      const keywordCount = keywords.filter(keyword => 
        q.answer.toLowerCase().includes(keyword)
      ).length;
      totalScore += Math.min(keywordCount, 3);
    }
  });
  
  const averageScore = answeredCount > 0 ? 
    Math.min((totalScore / (answeredCount * 8)) * 10, 10) : 0;
  
  let feedback;
  if (averageScore >= 8) {
    feedback = `Excellent ${difficulty} level ${technology} performance! Strong technical knowledge demonstrated with comprehensive answers. Shows readiness for the role.`;
  } else if (averageScore >= 6) {
    feedback = `Good ${difficulty} level performance in ${technology}. Solid understanding shown but some areas could benefit from more detailed explanations.`;
  } else if (averageScore >= 4) {
    feedback = `Fair ${difficulty} level ${technology} interview. Basic understanding demonstrated but recommend strengthening core concepts and providing more examples.`;
  } else {
    feedback = `Basic performance in ${difficulty} level ${technology} interview. Focus on fundamental concepts and practice explaining technical topics in more detail.`;
  }
  
  return {
    score: Math.round(averageScore * 10) / 10,
    feedback
  };
}