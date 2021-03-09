const dbValidators = require('./db-validators');
const googleVerify = require('./google-verify');
const jwtGenerator = require('./jwt-generator');
const uploadFile = require('./upload-file');


module.exports = {
    ...dbValidators,
    ...googleVerify,
    ...jwtGenerator,
    ...uploadFile
}
