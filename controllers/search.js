const { request, response } = require("express");
const { ObjectId } = require ('mongoose').Types;

const { User, Product, Category} = require('../models');

const allowCollection = [
    'categories',
    'products',
    'roles',
    'users',
]


const search = ( req = request, res = response) => {
    const { collection, term } = req.params;

    if (!allowCollection.includes(collection)) return res.status(400).json({ msg: `The collection allow are: ${allowCollection}`});

    switch (collection) {
        case 'categories':
            searchCategories( term, res);
        break;

        case 'products':
            searchProducts(term, res);
        break;

        case 'users':
            searchUsers(term, res);
        break;
    }
}

const searchUsers = async ( term = '',  res = response ) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const user = await Category.findById(term);

        return res.json({
            results: (user) ? [user] : []
        });
    }

    // Se crea una expresion regular para familitar las busquedas
    const regex = new RegExp(term, 'i');

    const users = await Category.find({
        // Varias opciones de coincidencia para el nombre y el email
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true}]
    });

    return res.json({
        total: users.length,
        results: users
    });
}

const searchProducts = async ( term = '', res = response) => {

    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const product = await Product.findById(term).populate('category', 'name');

        return res.json({
            results: (product) ? [product] : []
        });
    }

    // Se crea una expresión regular para facilitar las búsquedas
    const regex = new RegExp(term, 'i');

    const products = await Product.find({ name: regex, state: true}).populate('category', 'name');

    return res.json({
        total: products.length,
        results: products
    });
}

const searchCategories = async( term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const user = await Category.findById(term);

        return res.json({
            results: (user) ? [user] : []
        });
    }

    // Se crea una expresion regular para familitar las busquedas
    const regex = new RegExp(term, 'i');

    const categories = await Category.find({ name: regex, state: true });

    return res.json({
        total: categories.length,
        results: categories
    });
}

module.exports = {
    search
}