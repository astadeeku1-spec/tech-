const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function viewFeedback() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    console.log('\n--- Tech Trends Feedback Log ---\n');
    const feedback = await db.all('SELECT * FROM feedback ORDER BY timestamp DESC');

    if (feedback.length === 0) {
        console.log('No feedback entries found yet.');
    } else {
        feedback.forEach((entry, index) => {
            console.log(`[${index + 1}] From: ${entry.name} (${entry.email})`);
            console.log(`Timestamp: ${entry.timestamp}`);
            console.log(`Message: ${entry.message}`);
            console.log('--------------------------------\n');
        });
    }
}

viewFeedback().catch(err => console.error('Error reading database:', err));
