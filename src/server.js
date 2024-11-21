const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const db = require('./models');

const removeNullPrototype = require('./helpers/removeNullPrototype');
const Routers = require('./Routers');


dotenv.config();
const app = express();
const upload = multer();

db.sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
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