const { MongoClient } = require('mongodb');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function run() {
    const uri = "mongodb+srv://astadeeku1_db_user:watchieo777@cluster0.5waibth.mongodb.net/?appName=Cluster0";
    console.log("Testing SRV with DNS override...");
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    try {
        await client.connect();
        console.log("Connected successfully to SRV!");
        await client.close();
    } catch (e) {
        console.error("FAIL:", e);
    }
}
run();
