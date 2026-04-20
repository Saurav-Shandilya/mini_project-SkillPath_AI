import User from '../models/User.js';
import Course from '../models/Course.js';
import Job from '../models/Job.js';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockConfig = {
    region: process.env.AWS_REGION || "us-east-1",
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    bedrockConfig.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
}

const client = new BedrockRuntimeClient(bedrockConfig);

export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        const resumeText = data.text;

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        const prompt = `You are an expert HR and ATS system analyzer. Analyze the following resume text:\n\n${resumeText}\n\n
        Based on this resume, provide:
        1. An ATS Score (0-100) reflecting how well this resume matches industry standards.
        2. A list of exactly 4-5 suggestions/details to increase the ATS score.
        3. A statistical analysis of problems and solutions related to formatting and content. Provide exactly 3 problem-solution pairs.
        4. A list of 3 suitable job roles based on their skills.
        5. A list of 3-5 recommended skills they can learn to increase job availability.
        
        Return ONLY a JSON object exactly matching this format:
        {
          "atsScore": Number,
          "suggestions": [String],
          "problemsAndSolutions": [{ "problem": String, "solution": String }],
          "suitableJobs": [String],
          "recommendedSkills": [String]
        }`;

        const formattedPrompt = `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\n${prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`;
        
        const command = new InvokeModelCommand({
            modelId: "meta.llama3-8b-instruct-v1:0",
            body: JSON.stringify({
                prompt: formattedPrompt,
                max_gen_len: 2048,
                temperature: 0.5,
                top_p: 0.9,
            }),
            contentType: "application/json",
            accept: "application/json",
        });

        const response = await client.send(command);
        const result = JSON.parse(new TextDecoder().decode(response.body));
        
        let analysisData;
        try {
            const text = result.generation.trim();
            const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
            const jsonString = jsonMatch ? jsonMatch[1].trim() : text.trim();
            const firstBracket = jsonString.search(/[\[\{]/);
            const lastBracket = Math.max(jsonString.lastIndexOf(']'), jsonString.lastIndexOf('}'));
            const cleanedJson = jsonString.substring(firstBracket, lastBracket + 1);
            analysisData = JSON.parse(cleanedJson);
        } catch (parseError) {
            console.error("Failed to parse AI response", result.generation);
            throw new Error("Invalid AI response format");
        }

        // Fetch jobs that might match their top skills or suggestions
        const jobKeywords = [...(analysisData.suitableJobs || []), ...(analysisData.recommendedSkills || [])]
            .join(' ')
            .replace(/[\W_]+/g, ' ')
            .split(' ');
            
        // Use regex for loose matching on reqs or role
        const regexes = jobKeywords.filter(k => k.length > 2).map(k => new RegExp(k, 'i'));
        let matchedJobs = [];
        if (regexes.length > 0) {
            matchedJobs = await Job.find({
                $or: [
                    { role: { $in: regexes } },
                    { reqs: { $in: regexes } }
                ]
            }).limit(5);
        }
        
        res.json({ analysis: analysisData, matchedJobs });

    } catch (error) {
        console.error("Resume Analysis Error:", error);
        res.status(500).json({ message: error.message });
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            console.error(`User not found for ID: ${req.user._id}`);
            return res.status(404).json({ message: 'User not found' });
        }

        // --- STREAK LOGIC ---
        const now = new Date();
        const lastLoginDate = new Date(user.lastLogin || user.createdAt || Date.now());
        
        // Normalize strict dates to discard hours/minutes calculation weirdness
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastLoginDay = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate());
        
        const diffTime = today - lastLoginDay;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 

        let streakUpdated = false;
        
        if (diffDays === 1) {
            // Logged in exactly yesterday: maintain and +1 streak
            user.streak = (user.streak || 0) + 1;
            user.lastLogin = now;
            streakUpdated = true;
        } else if (diffDays > 1) {
            // Missed a day: reset streak
            user.streak = 1;
            user.lastLogin = now;
            streakUpdated = true;
        } else if (user.streak === 0 || !user.lastLogin) {
            // Never tracked a streak before, initialize it to 1
            user.streak = 1;
            user.lastLogin = now;
            streakUpdated = true;
        }

        if (streakUpdated) {
            await user.save();
        }
        // --- END STREAK LOGIC ---

        console.log(`Fetching stats for user: ${req.user._id}`);
        const courses = await Course.find({ userId: req.user._id, isEnrolled: true });
        console.log(`Found ${courses.length} enrolled courses for stat calculation`);

        // Calculate real stats
        const totalCourses = courses.length;
        const completedCourses = courses.filter(c =>
            c.structure.every(m => m.status === 'completed')
        ).length;

        // Sum learning hours (estimated)
        let totalHours = 0;
        courses.forEach(c => {
            c.structure.forEach(m => {
                if (m.status === 'completed') {
                    const hours = parseInt(m.estimatedTime) || 0;
                    totalHours += hours;
                }
            });
        });

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                xp: user.xp,
                streak: user.streak,
                badges: user.badges || []
            },
            stats: {
                totalCourses,
                completedCourses,
                totalHours,
                xp: user.xp || 0,
                streak: user.streak || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                token: req.token // reused from middleware if possible or just handle in frontend
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
