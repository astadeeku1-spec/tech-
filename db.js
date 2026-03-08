const { MongoClient } = require("mongodb");
const dns = require('dns');
// Override DNS servers to bypass the local Windows querySrv bug
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = process.env.MONGO_URI;

let client;
let db;

async function connectDB() {
    if (!db) {
        let cleanUri = uri ? uri.trim() : "";
        if (cleanUri.startsWith('"') && cleanUri.endsWith('"')) {
            cleanUri = cleanUri.substring(1, cleanUri.length - 1);
        }
        if (cleanUri.startsWith("'") && cleanUri.endsWith("'")) {
            cleanUri = cleanUri.substring(1, cleanUri.length - 1);
        }
        console.log("Mongo URI available:", !!cleanUri);
        client = new MongoClient(cleanUri);

        await client.connect();

        db = client.db("techdb");

        console.log("✅ MongoDB Connected Successfully to techdb");
    }

    return db;
}

module.exports = connectDB;