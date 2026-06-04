const dotenv = require('dotenv');
dotenv.config();

const PROVIDER = process.env.AI_PROVIDER || 'groq';

// ── PROVIDER SETUP ──
let callAI;

if (PROVIDER === 'groq') {
  const Groq = require('groq-sdk');
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  callAI = async (messages, options = {}) => {
    const res = await groq.chat.completions.create({
      model:       process.env.AI_MODEL_GROQ
                   || 'llama-3.3-70b-versatile',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens:  options.maxTokens   ?? 1000,
    });
    return res.choices[0]?.message?.content || '';
  };

} else if (PROVIDER === 'openai') {
  const OpenAI = require('openai');
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  callAI = async (messages, options = {}) => {
    const res = await openai.chat.completions.create({
      model:       process.env.AI_MODEL_OPENAI
                   || 'gpt-4o-mini',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens:  options.maxTokens   ?? 1000,
    });
    return res.choices[0]?.message?.content || '';
  };

} else if (PROVIDER === 'anthropic') {
  const Anthropic = require('@anthropic-ai/sdk');
  const client    = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  callAI = async (messages, options = {}) => {
    const res = await client.messages.create({
      model:      'claude-3-5-haiku-20241022',
      max_tokens:  options.maxTokens ?? 1000,
      messages
    });
    return res.content[0]?.text || '';
  };
}

// ════════════════════════════════════════
//   PROMPTS — never change when switching
// ════════════════════════════════════════

// ── 1. HABIT SUGGESTIONS ──
exports.getHabitSuggestions = async (userGoal, existingHabits = []) => {
  const existingNames = existingHabits.map((h) => h.name).join(', ');

  const messages = [
    {
      role: 'system',
      content: `You are HabitFlow's AI coach — an expert in behavioral 
psychology, habit formation, and personal development. You help users 
build effective habit systems based on their goals.

Your responses must be valid JSON only. No markdown, no explanation, 
no preamble. Just the JSON object.

Rules for habit suggestions:
- Suggest 5-7 specific, actionable habits
- Each habit should be measurable and clear
- Consider habit stacking (morning/evening routines)
- Base suggestions on proven behavioral science
- Avoid suggesting habits the user already tracks`
    },
    {
      role: 'user',
      content: `My goal: "${userGoal}"
${existingNames ? `I already track: ${existingNames}` : ''}

Suggest habits to help me achieve this goal.

Respond with this exact JSON structure:
{
  "habits": [
    {
      "name": "habit name",
      "icon": "single emoji",
      "frequency": "daily" or "weekly" or "custom",
      "weeklyTarget": number 1-7,
      "dailyTarget": number 1-10,
      "reminderTime": "HH:MM" or null,
      "reason": "brief science-backed reason why this helps",
      "difficulty": "easy" or "medium" or "hard"
    }
  ],
  "planSummary": "2-3 sentence overview of this habit plan",
  "firstWeekTip": "specific tip for the first week"
}`
    }
  ];

  try {
    const raw     = await callAI(messages, {
      temperature: 0.7,
      maxTokens:   1200
    });
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[AI] Habit suggestions error:', err.message);
    throw new Error('Failed to generate habit suggestions');
  }
};

// ── 2. SMART INSIGHTS ──
exports.getSmartInsights = async (user, habitStats) => {
  const messages = [
    {
      role: 'system',
      content: `You are HabitFlow's analytics AI. You analyze habit 
tracking data and provide personalized, actionable insights.

Your responses must be valid JSON only. No markdown, no explanation.

Be specific, encouraging, and data-driven. Reference actual numbers 
from the data. Sound like a knowledgeable coach, not a robot.`
    },
    {
      role: 'user',
      content: `Analyze this habit data for ${user.name}:

${JSON.stringify(habitStats, null, 2)}

Provide insights in this exact JSON structure:
{
  "overallScore": number 0-100,
  "trend": "improving" or "declining" or "stable",
  "insights": [
    {
      "type": "strength" or "weakness" or "pattern" or "tip",
      "title": "short insight title",
      "description": "2-3 sentence insight with specific data",
      "actionable": "one specific action to take"
    }
  ],
  "bestTimeOfDay": "morning" or "afternoon" or "evening",
  "bestDayOfWeek": "Monday" etc,
  "worstDayOfWeek": "Monday" etc,
  "prediction": "what will happen if current trend continues",
  "weeklyChallenge": "one specific challenge for this week"
}`
    }
  ];

  try {
    const raw     = await callAI(messages, {
      temperature: 0.6,
      maxTokens:   1500
    });
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[AI] Smart insights error:', err.message);
    throw new Error('Failed to generate insights');
  }
};

// ── 3. TASK PRIORITIZER ──
exports.prioritizeTasks = async (tasks, userContext = '') => {
  const messages = [
    {
      role: 'system',
      content: `You are HabitFlow's productivity AI. You help users 
prioritize their tasks using the Eisenhower Matrix (urgent/important) 
and other productivity frameworks.

Your responses must be valid JSON only. No markdown, no explanation.

Prioritization rules:
- Consider deadlines, impact, and effort
- Apply Eisenhower Matrix: Do First, Schedule, Delegate, Eliminate
- Group related tasks when possible
- Be decisive — give clear priority scores`
    },
    {
      role: 'user',
      content: `Prioritize these tasks for me:
${tasks.map((t, i) =>
  `${i + 1}. "${t.title}" — Priority: ${t.priority}, Due: ${t.dueDate || 'no date'}`
).join('\n')}

${userContext ? `Context: ${userContext}` : ''}

Respond with this exact JSON structure:
{
  "prioritized": [
    {
      "taskId": "original task index (0-based)",
      "title": "task title",
      "eisenhowerQuadrant": "do_first" or "schedule" or "delegate" or "eliminate",
      "priorityScore": number 1-10,
      "suggestedTime": "morning" or "afternoon" or "evening",
      "estimatedMinutes": number,
      "reason": "one sentence why this priority"
    }
  ],
  "focusTask": "the single most important task to do right now",
  "productivityTip": "specific tip based on this task list"
}`
    }
  ];

  try {
    const raw     = await callAI(messages, {
      temperature: 0.4,
      maxTokens:   1200
    });
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[AI] Task prioritizer error:', err.message);
    throw new Error('Failed to prioritize tasks');
  }
};

// ── 4. DAILY COACH MESSAGE ──
exports.getDailyCoachMessage = async (user, yesterdayStats) => {
  const messages = [
    {
      role: 'system',
      content: `You are HabitFlow's daily coach — warm, motivating, 
and data-driven. You send personalized morning messages to help users 
stay on track with their habits.

Your responses must be valid JSON only. No markdown, no explanation.

Tone: encouraging but honest. Reference yesterday's actual data. 
Keep messages concise and actionable. Sound human, not robotic.`
    },
    {
      role: 'user',
      content: `Generate a morning coach message for ${user.name}.

Yesterday's data:
- Score: ${yesterdayStats.score}%
- Completed: ${yesterdayStats.completed}/${yesterdayStats.total} habits
- Current streak: ${yesterdayStats.streak} days
- Best habit: ${yesterdayStats.bestHabit || 'none'}
- Missed habit: ${yesterdayStats.missedHabit || 'none'}

Respond with this exact JSON structure:
{
  "greeting": "personalized greeting using their name",
  "message": "2-3 sentence motivational message referencing their data",
  "focusHabit": "which habit to focus on today and why",
  "dailyQuote": "relevant motivational quote",
  "energyLevel": "high" or "medium" or "low",
  "emoji": "single relevant emoji"
}`
    }
  ];

  try {
    const raw     = await callAI(messages, {
      temperature: 0.8,
      maxTokens:   600
    });
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[AI] Coach message error:', err.message);
    throw new Error('Failed to generate coach message');
  }
};

// ── 5. HABIT CORRELATION ANALYSIS ──
exports.getHabitCorrelations = async (logs, habits) => {
  const messages = [
    {
      role: 'system',
      content: `You are a behavioral data scientist analyzing habit 
correlations. Find meaningful patterns between habits.

Your responses must be valid JSON only. No markdown, no explanation.`
    },
    {
      role: 'user',
      content: `Analyze correlations between these habits:

Habits: ${habits.map((h) => h.name).join(', ')}

Log summary (last 30 days):
${JSON.stringify(logs, null, 2)}

Respond with this exact JSON structure:
{
  "correlations": [
    {
      "habit1": "habit name",
      "habit2": "habit name",
      "relationship": "positive" or "negative" or "neutral",
      "strength": "strong" or "moderate" or "weak",
      "insight": "one sentence explaining the correlation"
    }
  ],
  "bestCombo": "best habit combination and why",
  "recommendation": "one specific recommendation based on patterns"
}`
    }
  ];

  try {
    const raw     = await callAI(messages, {
      temperature: 0.5,
      maxTokens:   1000
    });
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[AI] Correlation error:', err.message);
    throw new Error('Failed to analyze correlations');
  }
};