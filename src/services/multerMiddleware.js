import multer from "multer";

const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
        let destinationFolder
        if (file.fieldname === 'profileImage') {
            destinationFolder = './src/public/profiles';
        } else if (file.fieldname === 'productImage') {
            destinationFolder = './src/public/products';
        } else if (file.fieldname === 'identificacion' || file.fieldname === 'domicilio' || file.fieldname === 'compruebaCuenta') {
            destinationFolder = './src/public/documents'
        }

        cb(null, destinationFolder);
    },
    filename: (_req ,file ,cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})



export {upload}