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
      res.status(200).json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({error: 'Error interno del servidor'});
    }
  },

  async deleteIna(req, res) {
    try {
      console.log('Iniciando la función deleteIna...');
      const currentDate = new Date();
      const inactivityPeriod = 1 * 60 * 1000;

      const inactivityLimit = new Date(currentDate - inactivityPeriod);

      const inactiveUsers = await userModel.find({
        last_connection: { $lt: inactivityLimit },
      }).lean();
  
      console.log(`Usuarios inactivos a eliminar: ${inactiveUsers.length}`);

      const deletionResult = await userModel.deleteMany({
      last_connection: { $lt: inactivityLimit },
      });

      console.log(`Usuarios eliminados: ${deletionResult.deletedCount}`);

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
        console.log(`Correo electrónico enviado a ${user.email}`);
      }
      console.log('Función deleteIna completada con éxito.');
      res.status(200).json({ message: 'Usuarios inactivos eliminados correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};


export default UsersController;