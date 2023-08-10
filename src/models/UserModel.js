const { ObjectId } = require("mongodb");

class UserModel {
  constructor(database) {
    this.collection = database.collection("users");
    this.collectionCar = database.collection("cars");
    this.collectionSold = database.collection("soldcars");
    this.collectionDealership = database.collection("dealerships");
    this.collectionDeal = database.collection("deals");
  }

  async getUserByEmail(email) {
    const user = await this.collection.findOne({ email: email });
    return user;
  }

  async getAllCars() {
    return await this.collectionCar.find().toArray();
  }
  async getAllUsers() {
    return await this.collection.find().toArray();
  }

  async getOwnedVehicles(id) {
    const user = await this.collection.findOne({ userId: id });
    if (user) {
      const soldId = user.vehicleInfo.map((vehicle) => vehicle);
      const soldCar = await this.collectionSold
        .find({ vehicleId: { $in: soldId } })
        .toArray();
      if (soldCar.length > 0) {
        const carId = soldCar.map((data) => data.carId);
        console.log(carId);
        const cars = await this.collectionCar
          .find({ carId: { $in: carId } })
          .toArray();
        return cars;
      }
      return [];
    }
    return [];
  }

  async getCarsInDealership(dealershipId) {
    const dealership = await this.collectionDealership.findOne({
      dealershipId: dealershipId,
    });
    if (dealership) {
      const carId = dealership.cars.map((data) => data);
      if (carId) {
        console.log(carId);
        const cars = await this.collectionCar
          .find({ carId: { $in: carId } })
          .toArray();
        return cars;
      }
      return [];
    }
    return [];
  }

  async getDealershipsWithCar(carId) {
    return this.collectionDealership.find({ cars: carId }).toArray();
  }

  async getDealsFromDealership(dealershipId) {
    const dealer = await this.collectionDealership.findOne({
      dealershipId: dealershipId,
    });
    if (dealer) {
      const dealId = dealer.deals.map((dealId) => dealId);
      const deals = await this.collectionDeal
        .find({ dealId: { $in: dealId } })
        .toArray();
      return deals;
    }
    return [];
  }

  async buyCar(userId, dealId) {
    const user = await this.collection.findOne({ userId: userId });
    if (user) {
      const deal = await this.collectionDealership
        .find({
          deals: dealId,
        })
        .toArray();
      if (deal.length>0) {
        const dealershipIndex = deal.findIndex((d) =>
          d.deals.some((dealItem) => dealItem === dealId)
        );
        console.log(deal);
        if (dealershipIndex !== -1) {
          const dealership = deal[dealershipIndex];
          const dealIndex = dealership.deals.findIndex(
            (deal) => deal === dealId
          );

          if (dealIndex !== -1) {
            const dealId = dealership.deals[dealIndex];

            const deal = await this.collectionDeal.findOne({ dealId: dealId });
            // Check if the user already owns the car
            const userOwnsCar = user.vehicleInfo.some(
              (vehicle) => vehicle === deal.carId
            );
            if (!userOwnsCar) {
              // Update user's owned vehicles
              const status = await this.collection.updateOne(
                { userId: userId },
                { $push: { vehicleInfo: deal.carId } }
              );

              //Delete deal from collection after updating
              await this.collectionDeal.deleteOne({ dealId: dealId });

              // Return the updated user object
              const updatedUser = await this.collection.findOne({
                userId: userId,
              });
              return {success:true, data: updatedUser};
            } else {
              // User already owns the car
              return {success:false,msg:"userAlreadyOwnsCar"}
            }
          }
        }
      } else {
        return {success:false,msg:"NoDealerFound"}
        
      }
    } else {
      return {success:false,msg:"NoUserFound"}
    }
    return null;
  }

  async getDealsOnCar(carId) {
    const car = await this.collectionCar.findOne({ carId: carId });
    console.log(car);
    if (car) {
      const dealsOnCar = await this.collectionDeal
        .find({ carId: carId })
        .toArray();
      return dealsOnCar;
    }
    return false;
  }
}

module.exports = UserModel;
