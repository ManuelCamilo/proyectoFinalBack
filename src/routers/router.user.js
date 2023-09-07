import { Router } from "express";
import multer from "multer";
import userModel from "../model/user.model.js";

const router = Router()

const storage = multer.diskStorage({
    destination:(request, file, cb) => {
        let destinationFolder;
        if (file.fieldname === 'profileImage') {
            destinationFolder = 'profiles';
        } else if (file.fieldname === 'productImage') {
            destinationFolder = 'products';
        } else {
            destinationFolder = 'documents';
        }
        cb(null, `uploads/${destinationFolder}`);
    },
    filename: (request, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer ({ storage });

router.get('/premium/:uid', async (request, response) => {
    try {
        const {uid} = request.params

        const user = await userModel.findOne({ uid })

        if(!user) {
            return response.status(404).json({message: 'Usuario no encontrado'});
        }
        response.render('accountInfo', {user});
    } catch (err) {
        console.error(err);
        response.status(500).json({message: 'Error interno del servidor'});
    }
})

router.post(':uid/documents', upload.array('documents'), async (request, response) => {
    try {
        const {uid} = request.params;
        const {files} = request;

        const user = await userModel.findOne({uid});

        if (!user) {
            return response.status(404).json({message: 'Usuario no encontrado'});
        }
        user.documents = files.map(file => ({
            name: file.originalname,
            reference: file.path,
        }));

        user.status = 'activo'

        await user.save();
        response.status(200).json({message: 'Documentos subidos correctamente', user});
    } catch (err) {
        console.error(err);
        response.status(500).json({message: 'Error interno del servidor'});
    }
})

router.put('/premium/:uid', async (request, response) => {
    try {
        const {uid} = request.params;

        const user = await userModel.findOne({uid});
        if (!user) {
            return response.status(404).json({ message: 'Usuario no encontrado.'});
        }
        const requiredDocuments = ['Identificación', 'comprobacionDomicilio', 'comprobacionEstado'];
        const uploadedDocumentNames = user.documents.map(document => document.name);

        const hasRequiredDocuments = requiredDocuments.every(requiredDocument => {
            return uploadedDocumentNames.includes(requiredDocument);
        });

        if (hasRequiredDocuments) {
            user.role = 'premium';
            await user.save();
            response.status(200).json({message: 'Usuario actualizado a premium', user})
        } else {
            response.status(400).json({message: 'El usuario debe cargar todos los documentos para cambiar su role a premium!'})
        }
    }   catch (err) {
        console.error(err);
        response.status(500).json({message: 'Error interno del servidor'});
    }
})

export default router;