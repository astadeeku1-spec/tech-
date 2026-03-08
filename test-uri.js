const { MongoClient } = require("mongodb");
const uri = "mongodb://techadmin:watchieo777@ac-sskzygs-shard-00-01.21ouk3y.mongodb.net:27017,ac-sskzygs-shard-00-00.21ouk3y.mongodb.net:27017,ac-sskzygs-shard-00-02.21ouk3y.mongodb.net:27017/sample_mflix?authSource=admin&replicaSet=atlas-oiipca-shard-0&ssl=true";
const client = new MongoClient(uri);
async function run() {
    try {
        await client.connect();
        console.log("Connected successfully!");
        const db = client.db("sample_mflix");
        const count = await db.collection("movies").countDocuments();
        console.log("Movie count:", count);
    } catch (e) {
        console.error("Failed:", e.message);
    } finally {
        await client.close();
    }
}
run();
