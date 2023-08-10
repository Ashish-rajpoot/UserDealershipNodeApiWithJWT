const { ObjectId } = require('mongodb');

class VehicleSoldModel {
  constructor(db) {
    this.collection = db.collection('soldcars'); // Adjust the collection name
  }

  async getAllVehicleSold() {

    return await this.collection.find().toArray();
  }

  async createVehicleSold(vehicleSoldData) {
    const result = await this.collection.insertOne(vehicleSoldData);
    return result.insertedId;
  }

  async deleteVehicleSold(vehicleSoldId) {
    const result = await this.collection.deleteOne({ vehicleId:vehicleSoldId});
    return result.deletedCount;
  }

  async getAllVehicleSold() {
    return this.collection.find().toArray();
  }
}

module.exports = VehicleSoldModel;
