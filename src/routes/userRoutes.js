const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {isUser , isDealership , authenticateUser} = require('../middleware/authmiddleware');


// Endpoint to view all cars
router.get('/cars',authenticateUser,isUser, userController.getAllCars);

// Endpoint to view all cars in a dealership
router.get('/dealerships/:dealershipId/cars',authenticateUser,isUser, userController.getCarsInDealership);

// Endpoint to view dealerships with a certain car
router.get('/cars/:carId/dealerships',authenticateUser,isUser, userController.getDealershipsWithCar);

// Endpoint to view all vehicles owned by a user
router.get('/users/:userId/vehicles', userController.getOwnedVehicles);

// Endpoint to view deals on a certain car
router.get('/cars/:carId/deals', authenticateUser,isUser,userController.getDealsOnCar);

// Endpoint to view deals from a certain dealership
router.get('/dealerships/:dealershipId/deals',authenticateUser,isUser, userController.getDealsFromDealership);

// Endpoint to buy a car after a deal is made
router.post('/users/:userId/deals/:dealId/buy',authenticateUser,isUser, userController.buyCar);

module.exports = router;
