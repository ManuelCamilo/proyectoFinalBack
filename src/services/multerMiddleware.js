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

        cb(null, './src/public');
    },
    filename: (_req ,file ,cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})


function uploadFiles(fieldname) {
    return function (req, res, next) {
        upload.array(fieldname)(req,res, (err) => {
            if (err) {
                console.error(`Error al cargar el archivo ${fieldname}: ${err.message}`)
                return res.status(400).json({error: `Error al cargar los archivos ${fieldname}`})
            }
            next ();
        });
    };
}

export {uploadFiles}