import userModel from "../model/user.model.js";

class UserService {
  async getUserById(uid) {
    try {
      const user = await userModel.findOne({ _id: uid });
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
        return user;
      } catch (error) {
        throw error;
      }
  }

  async uploadDocuments(uid, files) {
    try {
      const user = await userModel.findOne({ _id: uid });
      if (!user) {
      throw new Error('Usuario no encontrado');
      }

      for (const fieldName in files) {
        if (Object.prototype.hasOwnProperty.call(files, fieldName)) {
          const fileArray = files[fieldName]

          fileArray.forEach((file) => {
            user.documents.push({ name: file.originalname, reference: file.path});
          });
        }
      }

      user.status = 'activo';

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async changeUserRole(uid) {
    try {
      const user = await userModel.findOne({ _id: uid });
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const isPremium = user.role === 'premium';
      if (isPremium) {
        user.role = 'user';
      } else {
        const requiredFields = ['identificacion', 'domicilio', 'compruebaCuenta'];
  
        const hasRequiredFields = requiredFields.every((fieldName) => {
          const fieldDocuments = user.documents.filter((document) =>
            document.reference.toLowerCase().includes(fieldName.toLowerCase())
          );
          return fieldDocuments.length > 0;
        });
  
        if (!hasRequiredFields) {
        throw new Error('Falta cargar documentos requeridos');
        }

        user.role = 'premium';

      }
      
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
