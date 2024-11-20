function removeNullPrototype(req, res, next) {
  req.body = Object.assign({}, req.body); // Remove optional chaining here
  next();
}

module.exports = {
  removeNullPrototype,
};
