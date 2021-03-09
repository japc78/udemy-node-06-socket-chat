const mongoose = require('mongoose');

const dbConnection = async() => {
    mongoose.connect(process.env.MONGODB_CONNECTION , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
        (error) => {
            if (error) throw error;
            console.log(`The connection to the database is ok`);
        }
    );

    // try {

    //     await mongoose.connect(process.env.MONGODB_CONNECTION, {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //         useFindAndModify: false,
    //         useCreateIndex: true
    //     });

    //     console.log('The connection to the database is ok');

    // } catch (error) {
    //     console.log(error);
    //     throw new Error('Error:  It is not possible to connect to the database');
    // }

}

module.exports = {
    dbConnection
}