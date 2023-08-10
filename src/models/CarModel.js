const { ObjectId } = require('mongodb');

class CarModel {
  constructor(db) {
    this.collection = db.collection('cars'); // Adjust the collection name
  }

  async getAllCars() {
    return await this.collection.find().toArray();
  }
  
  async createCar(carDetails) {
    const newCar = {
      carId: carDetails.carId,
      type: carDetails.type,
      name: carDetails.name,
      model: carDetails.model,
      carInfo: {
        color: carDetails.carInfo.color,
        year: carDetails.carInfo.year,
      },
    };
  
    const result = await this.collection.insertOne(newCar);
    return carDetails.carId; // Return the newly inserted car's ID
  }


}

module.exports = CarModel;
