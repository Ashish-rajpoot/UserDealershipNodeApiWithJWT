const express = require('express');
const router = express.Router();
const dealershipController = require('../controllers/dealershipController');
const {isUser , isDealership , authenticateUser} = require('../middleware/authmiddleware');

// Get all cars
router.get('/cars',authenticateUser,isDealership, dealershipController.getAllCars);

// Get cars sold by a dealership
router.get('/dealerships/:dealershipId/sold-cars',authenticateUser,isDealership, dealershipController.getCarsSoldByDealership);

// Add cars to a dealership
router.post('/dealerships/:dealershipId/add-cars',authenticateUser,isDealership, dealershipController.addCarsToDealership);

// Get deals provided by a dealership
router.get('/dealerships/:dealershipId/deals',authenticateUser,isDealership, dealershipController.getDealsByDealership);

// Add deals to a dealership
router.post('/dealerships/:dealershipId/add-deals',authenticateUser,isDealership, dealershipController.addDealsToDealership);

// Get all vehicles sold by a dealership
router.get('/dealerships/:dealershipId/sold-vehicles',authenticateUser,isDealership, dealershipController.getAllVehiclesSoldByDealership);

// Add a vehicle to the list of sold vehicles
router.post('/dealerships/:dealershipId/add-vehicle-to-sold-list', dealershipController.addVehicleToSoldList);

module.exports = router;
