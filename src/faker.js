const faker = require("faker");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const MONGODB_URI =
  "mongodb+srv://ashish142:ashish142@cluster0.3abiu.mongodb.net/cardealership";

  const generateDummyUsers = (count, allSoldIds) => {
    const users = [];
  
    for (let i = 0; i < count; i++) {
      users.push({
        email: faker.internet.email(),
        userId: faker.random.uuid(),
        location: faker.address.city(),
        userInfo: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        },
        password: "password",
        role: "user",
        vehicleInfo: faker.random.arrayElements(allSoldIds),
      });
    }
    return users;
  };
  
  
  

  // ... rest of the code ...
  
  // Usage
  
  
const generateDummyDealerships = (count, carIds, dealIds, soldVehicleIds) => {
  const dealerships = [];
  for (let i = 0; i < count; i++) {
    dealerships.push({
      email: faker.internet.email(),
      dealershipId: faker.random.uuid(),
      name: faker.company.companyName(),
      location: faker.address.city(),
      password: "password",
      role: "dealership",
      dealershipInfo: {
        description: faker.lorem.sentence(),
      },
      cars: faker.random.arrayElements(
        carIds,
        faker.random.number({ min: 1, max: 5 })
      ),
      deals: faker.random.arrayElements(
        dealIds,
        faker.random.number({ min: 1, max: 5 })
      ),
      soldVehicles: faker.random.arrayElements(
        soldVehicleIds,
        faker.random.number({ min: 1, max: 5 })
      ),
    });
  }
  return dealerships;
};

const generateDummyDeals = (count, carIds) => {
  const deals = [];
  for (let i = 0; i < count; i++) {
    deals.push({
      dealId: faker.random.uuid(),
      carId: faker.random.arrayElement(carIds),
      dealInfo: {
        price: faker.random.number({ min: 10000, max: 50000 }),
        discount: faker.random.number({ min: 5, max: 25 }),
        startDate: faker.date.future(),
        endDate: faker.date.future(),
      },
    });
  }
  return deals;
};

const generateDummySoldVehicles = (count, carIds) => {
  const soldVehicles = [];
  for (let i = 0; i < count; i++) {
    soldVehicles.push({
      vehicleId: faker.random.uuid(),
      carId: faker.random.arrayElement(carIds),
      vehicleInfo: {
        salePrice: faker.random.number({ min: 8000, max: 45000 }),
        saleDate: faker.date.past(),
        buyerName: faker.name.findName(),
        buyerEmail: faker.internet.email(),
      },
    });
  }
  return soldVehicles;
};

const generateDummyCars = (count) => {
  const cars = [];
  for (let i = 0; i < count; i++) {
    cars.push({
      carId: faker.random.uuid(),
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
    });
  }
  return cars;
};

const insertDummyData = async () => {
  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const usersCollection = db.collection("users");
    const dealershipsCollection = db.collection("dealerships");
    const dealsCollection = db.collection("deals");
    const carsCollection = db.collection("cars");
    const soldcarsCollection = db.collection("soldcars");

    const dummyCars = generateDummyCars(100);
    const carsId = dummyCars.map((car) => {
      return car.carId;
    });

    const dummyDeals = generateDummyDeals(25, carsId);
    const dealId = dummyDeals.map((deals) => {
      return deals.dealId;
    });

    const dummySoldVehicles = generateDummySoldVehicles(15, carsId);
    const soldId = dummySoldVehicles.map((sold) => {
      return sold.vehicleId;
    });

    
    const dummyUsers = generateDummyUsers(10, dummySoldVehicles.map((sold) => sold.vehicleId));
    const dummyDealers = generateDummyDealerships(10, carsId, dealId, soldId);

    await soldcarsCollection.insertMany(dummySoldVehicles);
    await carsCollection.insertMany(dummyCars);
    await dealsCollection.insertMany(dummyDeals);
    await dealershipsCollection.insertMany(dummyDealers);
    const result = await usersCollection.insertMany(dummyUsers);
    console.log("Dummy data inserted successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.close();
  }
};

insertDummyData();
