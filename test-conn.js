const { MongoClient } = require('mongodb');

async function testConnection() {
    // using the resolved SRV hosts
    const uri = "mongodb://astadeeku1_db_user:watchieo777@ac-zncy1ft-shard-00-00.5waibth.mongodb.net:27017,ac-zncy1ft-shard-00-01.5waibth.mongodb.net:27017,ac-zncy1ft-shard-00-02.5waibth.mongodb.net:27017/?ssl=true&replicaSet=atlas-zncy1ft-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
    try {
        console.log("Connecting directly using standard cluster nodes (bypass SRV)...");
        const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
        await client.connect();
        console.log("Connected successfully!");

        await client.close();
    } catch (e) {
        console.error("Connection Failed:", e.message);
    }
}

testConnection();
