const validFields = require('../middlewares/valid-fields');
const validJWT = require('../middlewares/valid-jwt');
const validRoles = require('../middlewares/valid-roles');
const uploadFiles = require('../middlewares/upload-file')

module.exports = {
    ...validFields,
    ...validJWT,
    ...validRoles,
    ...uploadFiles
}
