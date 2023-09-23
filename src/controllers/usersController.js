import UserService from "../services/usersService.js";
import userModel from "../model/user.model.js";
import emailConfig from "../config/emailConfig.js";
import dotenv from 'dotenv';
dotenv.config()

const usersService = new UserService()


const UsersController = {
  async formDocs(req, res) {
    try {
      const {user} = req.session;

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.render('accountInfo', { user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  async envDocs(req, res) {
    try {
      const user = await usersService.uploadDocuments(req.params.uid, req.files);
      res.status(200).json({ message: 'Documentos subidos correctamente', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async changeRole(req, res) {
    try {
      const user = await usersService.changeUserRole(req.params.uid);

      res.status(200).json({ message: 'Usuario actualizado a premium', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async usersList(req, res) {
    try {
      const users = await userModel.find({}, 'first_name last_name email role').lean().exec();
      res.render('usersList', {users});
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({error: 'Error interno del servidor'});
    }
  },

  async deleteIna(req, res) {
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
      res.status(200).json({ message: 'Usuarios inactivos eliminados correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async manualChangeRole(req, res) {
    try {
      const { userId } = req.params;
      const { newRole } = req.body

      // Actualiza el rol del usuario
      await userModel.findByIdAndUpdate(userId, { role: newRole });

      res.json({ success: true, message: 'Rol cambiado con éxito' });
    } catch (error) {
      console.error('Error al cambiar el rol:', error);
      res.json({ success: false, message: 'Error al cambiar el rol' });
    }  
  },

  async manualDeleteUser(req, res) {
    try {
      const {userId} = req.params;

      await userModel.findByIdAndDelete(userId);
      res.json({ success: true, message: "Usuario eliminado con éxito"});
    } catch(error) {
      console.error('Error al eliminar el usuario:', error);
      res.json({ success: false, message: 'Error al eliminar el usuario'})
    }
  },

};


export default UsersController;