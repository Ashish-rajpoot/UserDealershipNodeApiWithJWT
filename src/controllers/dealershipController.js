const { ObjectId } = require("mongodb");
const DealershipModel = require("../models/dealershipModel");
const connectDB = require("../config/db");
const { errorHandlers } = require("../utils/errorHandlers");
const CarModel = require("../models/CarModel");
const faker = require("faker");
const VehicleSoldModel = require("../models/VehicleSoldModel");
const DealModel = require("../models/dealModel");
const UserModel = require("../models/UserModel");

const getAllCars = async (req, res, next) => {
  try {
    const db = await connectDB();
    const carModel = new CarModel(db);

    const cars = await carModel.getAllCars();
    res.json(cars);
  } catch (error) {
    errorHandlers(error, res);
  }
};

const getCarsSoldByDealership = async (req, res, next) => {
  try {
    const db = await connectDB();
    const dealershipModel = new DealershipModel(db);

    const soldVehicles = await dealershipModel.getCarsSoldByDealership(
      req.params.dealershipId
    );
    res.json(soldVehicles);
  } catch (error) {
    errorHandlers(error, res);
  }
};

const addCarsToDealership = async (req, res, next) => {
  const db = await connectDB();
  const dealershipModel = new DealershipModel(db);
  const carModel = new CarModel(db);

  const newCarDetails = {
    carId: faker.datatype.uuid(),
    type: faker.random.arrayElement([
      "Sedan",
      "SUV",
      "Truck",
      "Coupe",
      "Convertible",
    ]),
    name: faker.vehicle.vehicle(),
    model: faker.vehicle.model(),
    carInfo: {
      color: faker.commerce.color(),
      year: faker.date.past().getFullYear(),
    },
  };
  const dealerId = req.params.dealershipId; // Specify the relevant dealership ID
  const carId = await carModel.createCar(newCarDetails);
  if (carId) {
    const modifiedCount = await dealershipModel.addCarsToDealership(
      dealerId,
      carId
    );
    if (modifiedCount === "success") {
      return res.status(200).json({
        success: true,
        msg: "Car added to the dealership successfully.",
      });
    } else {
      console.log("Failed to add car to the dealership.");
    }
  } else {
    console.log("Failed to add car.");
  }
};

const getDealsByDealership = async (req, res, next) => {
  try {
    const db = await connectDB();
    const dealershipModel = new DealershipModel(db);

    const deals = await dealershipModel.getDealsByDealership(
      req.params.dealershipId
    );
      return res.status(200).json({ deals });
  } catch (error) {
    errorHandlers(error, res);
  }
};

const addDealsToDealership = async (req, res, next) => {
  try {
    const db = await connectDB();
    const dealershipModel = new DealershipModel(db);
    const carModel = new CarModel(db);

    const randomcar = faker.random.arrayElement(await carModel.getAllCars());
    const addedDeals = await dealershipModel.addDealsToDealership(
      req.params.dealershipId,
      randomcar
    );
    if (addedDeals) {
      res.status(200).json({ updatedData: addedDeals.updatedDeal });
    }
  } catch (error) {
    errorHandlers(error, res);
  }
};

const getAllVehiclesSoldByDealership = async (req, res, next) => {
  try {
    const db = await connectDB();
    const dealershipModel = new DealershipModel(db);

    const soldVehicles = await dealershipModel.getAllVehiclesSoldByDealership(
      req.params.dealershipId
    );
    return res.status(200).json({ cars: soldVehicles.cars });
  } catch (error) {
    errorHandlers(error, res);
  }
};

const addVehicleToSoldList = async (req, res, next) => {
  try {
    const db = await connectDB();
    const dealershipModel = new DealershipModel(db);
    const dealModel = new DealModel(db);
    const userModel = new UserModel(db);

    const randomDeal = faker.random.arrayElement(
      await dealershipModel.getDealsByDealership(req.params.dealershipId)
    );
    const randomUser = faker.random.arrayElement(await userModel.getAllUsers());
    const soldCar = {
      vehicleId: faker.random.uuid(),
      carId: randomDeal.carId,
      vehicleInfo: {
        salePrice: faker.random.number({ min: 8000, max: 45000 }),
        saleDate: faker.date.past(),
        buyerName: randomUser.userId,
        buyerEmail: randomUser.email,
      },
    };
    const addedVehicle = await dealershipModel.addVehicleToSoldList(
      req.params.dealershipId,
      soldCar
    );
    return res.json(addedVehicle);
  } catch (error) {
    errorHandlers(error, res);
  }
};

module.exports = {
  getAllCars,
  getCarsSoldByDealership,
  addCarsToDealership,
  getDealsByDealership,
  addDealsToDealership,
  getAllVehiclesSoldByDealership,
  addVehicleToSoldList,
};
