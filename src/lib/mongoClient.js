import { MongoClient } from "mongodb";

export const mongoClient = async() => {
    try {
        const uri = process.env.MONGODB_URI
        const client = new MongoClient(uri);
        const db = client.db('test');
        return db
    } catch (error) {
        console.log(error);
    }
}