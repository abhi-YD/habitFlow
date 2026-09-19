require('dotenv').config({path: './server/.env'});
const mongoose = require('mongoose');
const User = require('./server/models/User');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({});
  console.log('User plan in DB:', user?.plan);
  console.log('User email:', user?.email);
  mongoose.disconnect();
}
test();
