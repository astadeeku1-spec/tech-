const { MongoClient } = require('mongodb');

async function testConnection() {
    const uri = "mongodb://astadeeku1_db_user:watchieo777@ac-zncy1ft-shard-00-00.5waibth.mongodb.net:27017,ac-zncy1ft-shard-00-01.5waibth.mongodb.net:27017,ac-zncy1ft-shard-00-02.5waibth.mongodb.net:27017/?ssl=true&replicaSet=atlas-11l61u-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
    try {
        console.log("Connecting directly using standard cluster nodes (bypass SRV)...");
        const client = new MongoClient(uri);
        await client.connect();
        console.log("Connected successfully!");

        // Let's create a database and a collection to satisfy the "must contain at least one database"
        const db = client.db("techdb");
        const collection = db.collection("movies");

        // Insert a dummy document if empty
        const count = await collection.countDocuments();
        console.log("Documents in techdb.movies:", count);
        if (count === 0) {
            console.log("Inserting a sample movie...");
            await collection.insertOne({
                title: "Quantum Computing Breakthrough",
                description: "Scientists achieve new milestone in quantum supremacy.",
                image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
                url: "#"
            });
            console.log("Sample document inserted.");
        }

        await client.close();
    } catch (e) {
        console.error("Connection Failed:", e);
    }
}

testConnection();
