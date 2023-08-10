const { ObjectId } = require("mongodb");
const UserModel = require("../models/UserModel");
const connectDB = require("../config/db");
const { errorHandlers } = require("../utils/errorHandlers");

const getAllCars = async (req, res, next) => {
  try {
    const db = await connectDB();
    const userModel = new UserModel(db);

    const cars = await userModel.getAllCars();
    res.json(cars);
  } catch (error) {
    errorHandlers(error, res);
  }
};
const getOwnedVehicles = async (req, res, next) => {
  try {
    const db = await connectDB();
    const userModel = new UserModel(db);
    const userCars = await userModel.getOwnedVehicles(req.params.userId); // Modify this line to get cars for the user
    res.json(userCars);
  } catch (error) {
    errorHandlers(error, res);
  }
};

const getUserBy_Id = async (req, res, next) => {
  try {
    const db = await connectDB();
    const userModel = new UserModel(db);
    const user = await userModel.getUserBy_Id(req.params.id);
    res.json(user);
  } catch (error) {
    errorHandlers(error, res);
  }
};

const getCarsInDealership = async (req, res, next) => {
  try {
    const db = await connectDB();
    const userModel = new UserModel(db);

    const cars = await userModel.getCarsInDealership(req.params.dealershipId);
    res.json(cars);
  } catch (error) {
    errorHandlers(error, res);
  }
};

const getDealershipsWithCar = async (req, res, next) => {
  try {
    const db = await connectDB();
    const userModel = new UserModel(db);

    const dealerships = await userModel.getDealershipsWithCar(req.params.carId);
    res.json(dealerships);
  } catch (error) {
    errorHandlers(error, res);
  }
};

const getVehiclesOwnedByUser = async (req, res, next) => {
  try {
    const db = await connectDB();
    const userModel = new UserModel(db);

    const vehicles = await userModel.getVehiclesOwnedByUser(req.params.userId);
    res.json(vehicles);
  } catch (error) {
    errorHandlers(error, res);
  }
};

const getDealershipsWithinRange = async (req, res, next) => {
  try {
    // Use maps API to get dealerships within a certain range based on user location
    // Replace this with your actual implementation
    // const dealerships = /* Implement maps API call */;
    // res.json(dealerships);
  } catch (error) {
    errorHandlers(error, res);
  }
};

const getDealsOnCar = async (req, res, next) => {
  try {
    const db = await connectDB();
    const userModel = new UserModel(db);

    const deals = await userModel.getDealsOnCar(req.params.carId);
    res.json(deals);
  } catch (error) {
    errorHandlers(error, res);
  }
};

const getDealsFromDealership = async (req, res, next) => {
  try {
    const db = await connectDB();
    const userModel = new UserModel(db);

    const deals = await userModel.getDealsFromDealership(
      req.params.dealershipId
    );
    res.json(deals);
  } catch (error) {
    errorHandlers(error, res);
  }
};

const buyCar = async (req, res, next) => {
  try {
    const db = await connectDB();
    const userModel = new UserModel(db);

    const purchaseResult = await userModel.buyCar(
      req.params.userId,
      req.params.dealId
    );

    if (purchaseResult.success === true) {
      res.json({
        success: true,
        message: "Car purchased successfully",
        user: purchaseResult,
      });
    } else if (purchaseResult.success === false) {
      if (purchaseResult.msg === "userAlreadyOwnsCar") {
        res
          .status(400)
          .json({ success: false, message: "User already owns the car" });
      } else if (purchaseResult.msg === "NoDealerFound") {
        res.status(404).json({ success: false, message: "No Dealer Found For This Car" });
      } else if (purchaseResult.msg === "NoUserFound") {
        res.status(404).json({ success: false, message: "User not found" });
      }
    }
  } catch (error) {
    errorHandlers(error, res);
  }

  //   if (purchaseResult === "userAlreadyOwnsCar") {
  //     res.status(400).json({ success: false, message: "User already owns the car" });
  //   } else if (purchaseResult) {
  //     res.json({ success: true, message: "Car purchased successfully", user: purchaseResult });
  //   }else if (purchaseResult==="NoDealerFound"){
  //     res.status(404).json({ success: false, message: "NoDealerFound"});
  //   } else {
  //     res.status(404).json({ success: false, message: "Deal not found" });
  //   }
  // } catch (error) {
  //   errorHandlers(error, res);
  // }
};

module.exports = {
  getAllCars,
  getCarsInDealership,
  getDealershipsWithCar,
  getVehiclesOwnedByUser,
  getDealershipsWithinRange,
  getDealsOnCar,
  getDealsFromDealership,
  buyCar,
  getUserBy_Id,
  getOwnedVehicles,
};
