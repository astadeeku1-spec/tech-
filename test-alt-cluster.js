const { MongoClient } = require('mongodb');

async function run() {
    const uri = "mongodb://astadeeku1_db_user:watchieo777@ac-sskzygs-shard-00-01.21ouk3y.mongodb.net:27017,ac-sskzygs-shard-00-00.21ouk3y.mongodb.net:27017,ac-sskzygs-shard-00-02.21ouk3y.mongodb.net:27017/sample_mflix?authSource=admin&replicaSet=atlas-oiipca-shard-0&retryWrites=true&w=majority&ssl=true";
    console.log("Testing ac-sskzygs with astadeeku1_db_user...");
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    try {
        await client.connect();
        console.log("Connected successfully to ac-sskzygs!");
        await client.close();
    } catch (e) {
        console.error("FAIL:", e.message);
    }
}
run();
