import userModel from "../model/user.model.js";

class UserManager {
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
          const fileArray = files[fieldName];

          fileArray.forEach((file) => {
            user.documents.push({ name: file.originalname, reference: file.path });
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

  async getUsersList() {
    try {
      const users = await userModel.find({}, 'first_name last_name email role').lean().exec();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async deleteInactiveUsers() {
    try {
      const currentDate = new Date();
      const inactivityPeriod = 2 * 24 * 60 * 60 * 1000;

      const inactivityLimit = new Date(currentDate - inactivityPeriod);

      const inactiveUsers = await userModel.find({
        last_connection: { $lt: inactivityLimit },
      }).lean();

      const deletionResult = await userModel.deleteMany({
        last_connection: { $lt: inactivityLimit },
      });

      for (const user of inactiveUsers) {
        console.log(`Enviando correo electrónico a ${user.email}...`);
        const email = {
          body: {
            name: user.first_name,
            intro: 'Lamentamos informarte que tu cuenta ha sido eliminada debido a inactividad.',
            outro: 'Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nosotros.',
          },
        };

        const emailHTML = emailConfig.mailGenerator.generate(email);

        const mailOptions = {
          from: process.env.GMAIL_USER, 
          to: user.email,
          subject: 'Cuenta eliminada por inactividad',
          html: emailHTML,
        };
        await emailConfig.transporter.sendMail(mailOptions);
      }

    } catch (error) {
      throw error;
    }
  }

  async manualChangeRole(uid, newRole) {
    try {
      await userModel.findByIdAndUpdate(uid, { role: newRole });
    } catch (error) {
      throw error;
    }
  }

  async manualDeleteUser(uid) {
    try {
      await userModel.findByIdAndDelete(uid);
    } catch (error) {
      throw error;
    }
  }

}

export default UserManager;
