const { Router, response } = require('express');
const { check } = require('express-validator');
const { addCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categories');

const { validJWT, validFields, shouldBeRole, isAdminRole } = require('../middlewares');

const { categoryExitsById, categoryNameExits } = require('../helpers/db-validators');

const router = Router();

// Obtener todas las categorías
router.get('/', getCategories);

// Obtener una categoría por Id.
router.get('/:id',[
    check('id', 'Not is valid id').isMongoId(),
    check('id').custom(categoryExitsById),
    validFields
], getCategoryById);

// Crear categoría, cualquier usuario con token valido.
router.post('/',  [
    validJWT,
    shouldBeRole('SALES_ROLE', 'ADMIN_ROLE'),
    check('name', 'The name is required').notEmpty(),
    check('name').custom(categoryNameExits),
    validFields
 ], addCategory);

// Actualizar categoría por ID.
router.put('/:id', [
    validJWT,
    shouldBeRole('SALES_ROLE', 'ADMIN_ROLE'),
    check('id', 'Not is valid id').isMongoId(),
    check('id').custom(categoryExitsById),
    check('name', 'The name is required').notEmpty(),
    check('name').custom(categoryNameExits),
    validFields
], updateCategory);

// Eliminar/desactivar categoría.
router.delete('/:id', [
    validJWT,
    isAdminRole,
    check('id', 'Not is valid id').isMongoId(),
    check('id').custom(categoryExitsById),
    validFields
], deleteCategory);

module.exports = router;