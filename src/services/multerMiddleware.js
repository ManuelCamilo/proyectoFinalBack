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
        const fieldName = file.fieldname;
        const originalName = file.originalname;
        const newName = `${fieldName}_${originalName}`
        cb(null, newName)
    }
})
const upload = multer({storage: storage})



export {upload}