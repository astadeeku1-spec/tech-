const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/.env' });
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(__dirname));

let db;

async function initDb() {
    console.log("initDb started");
    try {
        console.log("Connecting to Database...");
        db = await connectDB();
        console.log("✅ Database initialized (MongoDB)");
        console.log("DB NAME:", db.databaseName);
        const moviesCollection = db.collection("movies");
        const count = await moviesCollection.countDocuments();
        if (count === 0) console.log("ℹ️ Movies collection is empty.");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        console.log("⚠️ Server will continue, but data might be missing.");
    }
}

// NEWS API
app.get('/api/news', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: "Database not connected" });
        }
        const movies = await db.collection("movies").find({}).limit(10).toArray();

        const news = movies.map(movie => ({
            title: movie.title || "Untitled",
            description: movie.description || "No description available.",
            image: movie.image || "https://images.unsplash.com/photo-1485846234645-a62644f84728",
            url: movie.url || "#"
        }));

        res.json(news);
    } catch (error) {
        console.error("❌ API Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// FEEDBACK API
app.post('/api/feedback', async (req, res) => {
    console.log("Feedback API hit:", req.body);
    const { name, email, message, timestamp } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        let mongoResultId = null;
        let localStatus = 'Skipped (DB Not Initialized)';
        
        // 1️⃣ Store in MongoDB
        if (db) {
            try {
                const feedbackCollection = db.collection("feedback");
                const mongoResult = await feedbackCollection.insertOne({
                    name,
                    email,
                    message,
                    timestamp: timestamp || new Date()
                });
                console.log("MongoDB feedback saved:", mongoResult.insertedId);
                mongoResultId = mongoResult.insertedId;
                localStatus = 'Stored in MongoDB';
            } catch (mongoErr) {
                console.error("MongoDB insertion failed:", mongoErr.message);
                localStatus = `DB Error: ${mongoErr.message}`;
            }
        } else {
            return res.status(500).json({ error: "Database not connected" });
        }

        let githubStatus = 'Not Attempted';
        let githubUrl = null;

        // 2️⃣ Store in GitHub as backup
        const token = process.env.GITHUB_TOKEN;
        if (token && token !== 'your_github_personal_access_token_here') {
            try {
                const feedbackData = JSON.stringify({
                    name,
                    email,
                    message,
                    timestamp: timestamp || new Date()
                }, null, 2);
                const fileName = `feedback-${Date.now()}.json`;

                const owner = 'astadeeku1-spec';
                const repo = 'tech-';
                const path = `feedback/${fileName}`;

                const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `Add feedback from ${name}`,
                        content: Buffer.from(feedbackData).toString('base64'),
                        branch: 'main'
                    })
                });

                const githubResult = await response.json();
                if (response.ok) {
                    githubStatus = 'Success';
                    githubUrl = githubResult.content?.html_url;
                    console.log("GitHub feedback saved:", githubUrl);
                } else {
                    console.error("GitHub error:", githubResult);
                    githubStatus = `Failed: ${githubResult.message}`;
                }
            } catch (ghError) {
                console.error('GitHub Sync failed:', ghError);
                githubStatus = `Sync Error: ${ghError.message}`;
            }
        } else {
            githubStatus = 'Skipped (Missing GITHUB_TOKEN)';
        }

        // Return success if at least one submission method worked
        if (localStatus === 'Stored in MongoDB' || githubStatus === 'Success') {
            res.json({
                message: 'Feedback received!',
                local: localStatus,
                github: githubStatus,
                githubUrl: githubUrl,
                mongoId: mongoResultId
            });
        } else {
            res.status(500).json({
                error: 'Submission failed on all channels',
                details: { local: localStatus, github: githubStatus }
            });
        }

    } catch (error) {
        console.error("❌ Feedback storage error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// START SERVER
initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("failed to start server:", err);
});

