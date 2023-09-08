import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import { fakerES as faker } from '@faker-js/faker'
import jwt from 'jsonwebtoken'
import multer from 'multer'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname (__filename)


export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(), 
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.number.int(5000),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int(30),
        category: faker.commerce.department(),
        thumbnails: faker.image.urlPicsumPhotos(),
    }
}

export const generateToken1h = user => {
    const token1h = jwt.sign({ user }, PRIVATE_KEY, {expiresIn: '1h'})
    return token1h
}


export default __dirname

const storage = multer.diskStorage({
    destination: function (_req, file, cb) {
        let destinationFolder
        if (file.fieldname === 'profileImage') {
            destinationFolder = 'public/profiles';
        } else if (file.fieldname === 'productImage') {
            destinationFolder = 'public/products';
        } else if (file.fieldname === identificacion || file.fieldname === compruebaDocimilio || file.fieldname === compruebaCuenta) {
            destinationFolder = 'public/documents'
        }
        cb(null, destinationFolder);
    },
    filename: function(_req,file,cb) {
        cb(null, file.originalname)
    }
})
export const uploader = multer({storage: storage})
