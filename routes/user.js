const { Router } = require('express');
const { check } = require('express-validator');

const { validFields, validJWT, isAdminRole, shouldBeRole } = require('../middlewares')

const { userGet, userPost, userPatch, userPut, userDelete } = require('../controllers/user');
const { isRoleValid, emailExists, userExists } = require('../helpers/db-validators');

const router = Router();

router.get('/', userGet);

router.post('/', [
    check('email', 'The Email is not valid').isEmail(),
    check('name', 'The Name is required').not().isEmpty(),
    check('password', 'The password must be at least 6 characters long').isLength({min: 6}),
    check('email').custom(emailExists),
    check('role').custom(isRoleValid),
    validFields
], userPost);

router.put('/:id', [
    check('id', 'Not is valid Id').isMongoId(),
    check('id').custom(userExists),
    check('role').custom(isRoleValid),
    validFields
], userPut);

router.delete('/:id',[
    validJWT,
    // isAdminRole,
    shouldBeRole('SALES_ROLE', 'ADMIN_ROLE'),
    check('id', 'Not is valid Id').isMongoId(),
    check('id').custom(userExists),
    validFields
] , userDelete);
router.patch('/', userPatch);

module.exports = router;