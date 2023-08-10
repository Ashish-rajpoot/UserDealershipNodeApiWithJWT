const { ObjectId } = require('mongodb');

class DealModel {
  constructor(db) {
    this.collection = db.collection('deals'); // Adjust the collection name
  }

  async getAllDeals() {
    return await this.collection.find().toArray();
  }

}

module.exports = DealModel;
