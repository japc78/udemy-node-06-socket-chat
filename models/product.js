
const { Schema, model } = require('mongoose');


const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],
        unique: true
    },

    state: {
        type: Boolean,
        default: true,
        required: [true, 'The state is required']
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'The category id is required']
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'The user id is required']
    },

    precio: {
        type: Number,
        default: 0
    },

    description: { type: String },
    available: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
    }
})

ProductSchema.methods.toJSON = function () {
    const { __v, state, ...data } = this.toObject();
    return data;
}

module.exports = model('Product', ProductSchema);