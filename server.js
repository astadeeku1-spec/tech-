const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

let db;

// Initialize Database
async function initDb() {
    db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            image TEXT NOT NULL,
            url TEXT NOT NULL
        )
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    `);

    // Add initial data if empty
    const count = await db.get('SELECT COUNT(*) as count FROM news');
    if (count.count === 0) {
        const initialNews = [
            {
                title: "Quantum Computing Reaches New Milestone in Error Correction",
                description: "Researchers have demonstrated a new method for quantum error correction that could pave the way for stable, large-scale quantum computers.",
                image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
                url: "https://www.nature.com/articles/s41586-022-05434-1"
            },
            {
                title: "AI-Powered Fusion Energy Breakout",
                description: "A new deep learning model has successfully predicted and prevented plasma instabilities in a fusion reactor, extending stable runtimes by 300%.",
                image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
                url: "https://www.technologyreview.com/2024/02/21/1088657/ai-nuclear-fusion-plasma-instabilities/"
            },
            {
                title: "Bio-Digital Storage: DNA Hard Drives",
                description: "Scientists have developed a commercial-grade DNA storage system capable of holding 1 petabyte of data in a space the size of a sugar cube.",
                image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=800&q=80",
                url: "https://www.scientificamerican.com/article/dna-data-storage-is-closer-than-you-think/"
            },
            {
                title: "6G Networking Hits 1 Terabit Per Second",
                description: "Early 6G prototypes have shattered world records, achieving wireless speeds that allow downloading 100 4K movies in a single second.",
                image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
                url: "https://www.techradar.com/news/6g-everything-you-need-to-know"
            },
            {
                title: "Solid-State Batteries Enter Mass Production",
                description: "The first generation of solid-state EV batteries has rolled off the line, promising 1,000km range and 10-minute charging cycles.",
                image: "https://images.unsplash.com/photo-1593941707882-a5bba1491017?auto=format&fit=crop&w=800&q=80",
                url: "https://www.bloomberg.com/news/articles/2024-01-04/toyota-solid-state-battery-breakthrough-could-rev-up-evs"
            },
            {
                title: "Neuralink 2.0: Telepathic Interface",
                description: "The next iteration of brain-computer interfaces now allows users to type up to 150 words per minute using thought alone with 99.9% precision.",
                image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80",
                url: "https://neuralink.com/"
            },
            {
                title: "Autonomous Air Taxis Approved for NYC",
                description: "Regulators have granted the first commercial license for pilotless VTOL aircraft to operate a shuttle service between JFK and Manhattan.",
                image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80",
                url: "https://www.theverge.com/2023/11/13/23958983/joby-aviation-electric-air-taxi-nyc-test-flight"
            },
            {
                title: "Generative AI Designs New Antibiotics",
                description: "In a medical first, an AI-designed compound has entered clinical trials for a drug-resistant bacteria that previously had no known cure.",
                image: "https://images.unsplash.com/photo-1532187863486-abf91ad1b162?auto=format&fit=crop&w=800&q=80",
                url: "https://www.bbc.com/news/health-65709834"
            },
            {
                title: "Self-Healing Smart Materials for Infrastructure",
                description: "Concrete infused with specialized bacteria that secretes limestone is being used to build bridge supports that automatically repair cracks.",
                image: "https://images.unsplash.com/photo-1590066074590-6f29fb499c89?auto=format&fit=crop&w=800&q=80",
                url: "https://www.sciencedaily.com/releases/2023/06/230628135832.htm"
            },
            {
                title: "Holographic Workspace Becomes Mainstream",
                description: "Light-field displays are replacing traditional monitors in enterprise environments, offering full 3D collaborative spaces without bulky glasses.",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
                url: "https://www.wired.com/story/holograms-are-the-future-of-the-office/"
            },
            {
                title: "Space-Based Solar Power Test Successful",
                description: "A satellite constellation has successfully beamed 50kW of power to a terrestrial rectenna, proving the viability of clean 24/7 space solar energy.",
                image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
                url: "https://www.space.com/space-solar-power-satellite-beams-energy-earth-first-time"
            }
        ];

        for (const item of initialNews) {
            await db.run(
                'INSERT INTO news (title, description, image, url) VALUES (?, ?, ?, ?)',
                [item.title, item.description, item.image, item.url]
            );
        }
    }
}

app.get('/api/news', async (req, res) => {
    try {
        const news = await db.all('SELECT * FROM news');
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/feedback', async (req, res) => {
    const { name, email, message, timestamp } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // 1. Store Locally First (Guaranteed persistence)
        await db.run(
            'INSERT INTO feedback (name, email, message, timestamp) VALUES (?, ?, ?, ?)',
            [name, email, message, timestamp]
        );

        let githubStatus = 'Not Attempted';
        let githubUrl = null;

        // 2. Attempt GitHub sync
        const token = process.env.GITHUB_TOKEN;
        if (token && token !== 'your_github_personal_access_token_here') {
            try {
                const feedbackData = JSON.stringify({ name, email, message, timestamp }, null, 2);
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

                const result = await response.json();
                if (response.ok) {
                    githubStatus = 'Success';
                    githubUrl = result.content.html_url;
                } else {
                    githubStatus = `Failed: ${result.message}`;
                }
            } catch (ghError) {
                console.error('GitHub Sync failed:', ghError);
                githubStatus = `Sync Error: ${ghError.message}`;
            }
        } else {
            githubStatus = 'Skipped (Missing GITHUB_TOKEN in .env)';
        }

        // Return success if at least stored locally
        res.json({
            message: 'Feedback received!',
            local: 'Stored in Database',
            github: githubStatus,
            githubUrl: githubUrl
        });

    } catch (error) {
        console.error('Feedback processing error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});
