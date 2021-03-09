const { response, request } = require("express");
const Category = require("../models/category");

// Obtener categorías, paginado, total - populate (propio de mongoose)
const getCategories = async( req = request, res = response) => {
    try {
        const { limit = 5 , from = 0, state = true } = req.query;

        const query = { state }

        const [ total, categories ] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query, 'name user')
                .skip(Number(from)) // desde donde se muestran los resultados
                .limit(Number(limit)) // Limite 5
                .populate({
                    path: 'user',
                    select: 'name role',
                })
        ]);

        res.status(200).json({
            total,
            categories
        })

    } catch (error) {
        showError(error);
    }
}


// Obtener categoría por Id - populate
const getCategoryById = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id)
            .populate({
                path: 'user',
                select: 'name role',
            });

        res.status(200).json({
            category
        });

    } catch (error) {
        showError(error);
    }
}


// Actualizar categoría
const updateCategory = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const name = req.body.name.toUpperCase();

        const data = {
            name,
            user: req.user.id
        }

        const category = await Category.findByIdAndUpdate(id, data, {new: true})
            .populate({
                path: 'user',
                select: 'name role',
            })

        res.status(201).json({
            category
        })

    } catch (error) {
        showError(error);
    }
}


// Borrar categoría, cambiar estado a false

const deleteCategory = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const data = {
            state: false,
            user: req.user.id
        }

        const category = await Category.findByIdAndUpdate(id, data, { new: true})
            .populate({
                path: 'user',
                select: 'name role',
            })

        res.status(201).json({
            category
        })

    } catch (error) {
        showError(error);
    }


}

// Add categoría
const addCategory = async ( req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    try {
        const data = {
            name,
            user: req.header.user._id
        }

        const category = new Category(data);

        // Save in database
        await category.save();

        res.status(201).json({
            category
        });

    } catch (error) {
        showError(error);
    }
}



const showError = (error) => {
    console.error(error);
    res.status(500).json({
        msg: "Error: Service is not available, contact with administrator"
    });
}



module.exports = {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}