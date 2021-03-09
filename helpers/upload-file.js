const path = require('path');
const { v4: uuidv4 } = require('uuid');

const validExtension = ['png','jpg', 'jpeg', 'gif', 'webp'];

const uploadFile = ( files, extensions = validExtension,  folder = '') => {
    return new Promise( (resolve, reject ) => {
        const { file } = files;
        const fileNameSplit = file.name.split('.');
        const extension = fileNameSplit[ fileNameSplit.length - 1];

        // Extension validator

        if (!extensions.includes(extension))
            return reject(`The extension: .${extension}, is not allowed`);

        console.log(extension);

        const fileNameFinal = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', folder, fileNameFinal);

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(fileNameFinal);
        });
    });
}

module.exports = {
    uploadFile
}