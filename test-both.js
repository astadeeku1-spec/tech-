const { MongoClient } = require('mongodb');

async function test(name, uri) {
    console.log(`Testing ${name}...`);
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    try {
        await client.connect();
        console.log(`✅ ${name} connected!`);
        await client.close();
        return true;
    } catch (e) {
        console.log(`❌ ${name} failed: ${e.message}`);
        return false;
    }
}

async function run() {
    const uri1 = "mongodb://techadmin:watchieo777@ac-sskzygs-shard-00-01.21ouk3y.mongodb.net:27017,ac-sskzygs-shard-00-00.21ouk3y.mongodb.net:27017,ac-sskzygs-shard-00-02.21ouk3y.mongodb.net:27017/sample_mflix?authSource=admin&replicaSet=atlas-oiipca-shard-0&retryWrites=true&w=majority&ssl=true";
    const uri2 = "mongodb://techadmin:watchieo777@atlas-sql-69a64c4825cb0ad50f016ad6-jrhgut.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin";

    await test("Cluster0", uri1);
    await test("Atlas SQL", uri2);
}

run();
