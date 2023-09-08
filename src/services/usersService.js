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

      files.forEach((files) => {
      user.documents.push({ name: files.originalname, reference: files.path });
      });

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


      const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];

      const hasRequiredDocuments = requiredDocuments.every((doc) =>
        user.documents.some((document) => document.name === doc)
      );

      if (!hasRequiredDocuments) {
      throw new Error('Falta cargar documentos requeridos');
      }

      user.role = 'premium';

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
