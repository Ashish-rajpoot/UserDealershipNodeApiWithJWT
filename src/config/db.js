const { MongoClient } = require('mongodb');
const MONGODB_URI="mongodb+srv://ashish142:ashish142@cluster0.3abiu.mongodb.net/cardealership"
const connectDB = async () => {
  try {
    // const client = new MongoClient(process.env.MONGODB_URI, {
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log('MongoDB Connected');
    
    return client.db();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
};


module.exports = connectDB;