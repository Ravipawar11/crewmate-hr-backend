const validate = (requiredFields) => (req, res, next) => {
  const missing = requiredFields.filter(
    (field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === ''
  );

  if (missing.length) {
    return res.status(400).json({
      message: `Missing required fields: ${missing.join(', ')}`
    });
  }

  next();
};

module.exports = { validate };