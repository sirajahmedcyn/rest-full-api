const mongoose = require('mongoose');
const app = require('./index');

const PORT = 3000;
const DB_URI = 'mongodb+srv://Rest-Full-Api:zCW8LBCJh5jOYyTuFWn6AfL@cluster0.2fo7kxe.mongodb.net/User';
const startServer = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(DB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();