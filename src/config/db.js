const { MongoClient } = require('mongodb');
const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
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