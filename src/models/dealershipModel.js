const { ObjectId } = require("mongodb");
const faker = require("faker");
const VehicleSoldModel = require("./VehicleSoldModel");

class DealershipModel {
  constructor(database) {
    this.collectionUser = database.collection("users"); // Adjust the collection name
    this.collectionCar = database.collection("cars");
    this.collectionSold = database.collection("soldcars");
    this.collectionDealership = database.collection("dealerships");
    this.collectionDeal = database.collection("deals");
  }

  async getUserByEmail(email){
    const user = await this.collectionDealership.findOne({ email: email });
    return user;
  }

  async getAllDealerships() {
    return this.collection.find().toArray();
  }

  async getCarsSoldByDealership(id) {
    const dealerships = await this.collectionDealership.findOne({
      dealershipId: id,
    });
    if (dealerships) {
      const soldVehicles = dealerships.soldVehicles.map((data) => data);
      const vehicle = await this.collectionSold
        .find({ vehicleId: { $in: soldVehicles } })
        .toArray();
      const carId = [];
      vehicle.forEach((element) => {
        carId.push(element.carId);
      });
      const cars = await this.collectionCar
        .find({ carId: { $in: carId } })
        .toArray();
      return cars;
    }
  }

  async addCarsToDealership(dealerId, carId) {
    const dealership = await this.collectionDealership.findOne({
      dealershipId: dealerId,
    });

    if (dealership) {
      const updatedDealership = await this.collectionDealership.updateOne(
        { dealershipId: dealerId },
        {
          $push: { cars: carId }, // Add the new car's ID to the "cars" array without duplicates
        }
      );

      return "success"; // Returns the number of modified documents
    }

    return "failed"; // Indicates that the dealership was not found
  }

  async getDealsByDealership(dealerId) {
    console.log("getDealsByDealership", dealerId);
    const dealer = await this.collectionDealership.findOne({
      dealershipId: dealerId,
    });
    console.log(dealer);
    if (dealer) {
      console.log("dealer is found");
      const dealerDeals = dealer.deals.map((deals) => deals);
      console.log("deal", dealerDeals);
      const deals = await this.collectionDeal
        .find({ dealId: { $in: dealerDeals } })
        .toArray();
      return deals;
    } else {
      return { success: false };
    }
  }

  async addDealsToDealership(dealerId, carObject) {
    const dealership = await this.collectionDealership.findOne({
      dealershipId: dealerId,
    });
    if (dealership) {
      // Create a new deal document
      const newDeal = {
        dealId: faker.random.uuid(),
        carId: carObject.carId,
        dealInfo: {
          price: faker.random.number({ min: 10000, max: 50000 }),
          discount: faker.random.number({ min: 5, max: 25 }),
          startDate: faker.date.future(),
          endDate: faker.date.future(),
        },
      };

      // Insert the new deal and associate it with the dealership
      await this.collectionDeal.insertOne(newDeal);
      await this.collectionDealership.updateOne(
        { dealershipId: dealerId },
        { $push: { deals: newDeal.dealId } }
      );
      const updatedDeal = await this.collectionDealership.findOne({
        dealershipId: dealerId,
      });
      return { success: true, updatedDeal: updatedDeal }; // Successfully added deal to dealership
    } else {
      return false; // Dealership not found
    }
  }

  async getAllVehiclesSoldByDealership(dealerId) {
    const dealership = await this.collectionDealership.findOne({
      dealershipId: dealerId,
    });
    if (dealership) {
      const soldVehiclesIds = dealership.soldVehicles.map((ids) => ids);

      const soldVehicles = await this.collectionSold
        .find({ vehicleId: { $in: soldVehiclesIds } })
        .toArray();
      const carId = soldVehicles.map((data) => data.carId);
      const cars = await this.collectionCar
        .find({ carId: { $in: carId } })
        .toArray();
      return { success: true, cars: cars };
    }
    return { success: false };
  }

  async addVehicleToSoldList(dealerId, soldCar) {
    const dealer = await this.collectionDealership.findOne({
      dealershipId: dealerId,
    });
    if (dealer) {
      const createSoldVehicle = await this.collectionSold.insertOne(soldCar);

      const addVehicleToUser = await this.collectionUser.updateOne(
        {email: soldCar.vehicleInfo.buyerEmail},
        {$push:{vehicleInfo:soldCar.carId}});

      const addVehicleIdToDealer = await this.collectionDealership.updateOne(
        { dealershipId: dealerId },
        { $push: { soldVehicles: soldCar.vehicleId } }
      );
      const updatedData = await this.collectionDealership.findOne({
        dealershipId: dealerId,
      });
      return   updatedData;
    }
  }
}

module.exports = DealershipModel;
