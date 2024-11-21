function removeNullPrototype(req, res, next) {
  req.body = Object.assign({}, req.body); 
  next();
}

module.exports = {
  removeNullPrototype,
};
