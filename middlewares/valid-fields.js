const { validationResult } = require('express-validator');

const validFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    // Para ir pasando entre comprobaciones
    next();
}

module.exports = {
    validFields
}