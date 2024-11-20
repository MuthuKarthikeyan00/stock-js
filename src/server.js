const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const { Sequelize } = require('sequelize');
const removeNullPrototype = require('./helpers/removeNullPrototype');
const Routers = require('./Routers');

dotenv.config();
const app = express();
const upload = multer();

const sequelize = new Sequelize('stocks', 'admin', 'admin', {
  host: 'localhost',
  dialect: 'postgres', 
});


app.use(async (req, res, next) => {
  try {
    await sequelize.authenticate(); 
    console.log('Database connected successfully.');
    next();
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    res.status(500).send('Database connection error');
  }
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.static(path.join(__dirname,"..", 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(upload.none()); 

// app.use(removeNullPrototype.removeNullPrototype())

app.use(Routers.init());
const PORT = process.env.PORT || 7100;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});