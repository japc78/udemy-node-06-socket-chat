const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../db/config');
const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth : '/api/auth',
            categories : '/api/categories',
            products : '/api/products',
            search : '/api/search',
            user : '/api/user',
            uploads : '/api/uploads',
        }
        this.dbConnection();
        this.middleWares();
        this.routes();
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.user, require('../routes/user'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    async dbConnection() {
        await dbConnection();
    }


    middleWares() {
        // Cors
        this.app.use( cors());

        // Get and parse of Body
        this.app.use( express.json());

        // Public path
        this.app.use(express.static('public'));


        // FileUpload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true,
        }));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
        })
    }
}

module.exports = Server;