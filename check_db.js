const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

(async () => {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    const rows = await db.all('SELECT id, title FROM news LIMIT 5');
    console.log('--- Current SQL Database Content (First 5 Items) ---');
    console.table(rows);
    await db.close();
})();
