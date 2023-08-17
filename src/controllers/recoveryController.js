import userModel from '../model/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import emailConfig from '../config/emailConfig.js';
dotenv.config()

const recoveryController = {
  showRecoveryForm(request, response) {
    response.render('recovery/recoveryForm'); 
  },

  async sendRecoveryEmail(request, response) {
    const email = request.body.email;
    const user = await userModel.findOne({ email });
    if (!user) {
      return response.render('recovery/recoveryForm', { error: 'El correo electrónico no está registrado' });
    }

    const token = jwt.sign({ email }, process.env.PRIVATE_KEY, { expiresIn: '1h' });

    const recoveryLink = `${process.env.URL}/api/recover-password/reset/${token}`;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Recuperación de Contraseña',
      html: `Haga clic en el siguiente enlace para restablecer su contraseña. <a href="${recoveryLink}">Click aquí</a>`,
    };

    await emailConfig.transporter.sendMail(mailOptions);

    response.redirect('/api/recover-password/success'); 
  },

  showResetForm(request, response) {
    const { token } = request.params;
    response.render('recovery/resetForm', { token });  
  },

  async resetPassword(request, response) {
    const { token } = request.params;
    const { newPassword } = request.body;

    try {
      const decodedToken = jwt.verify(token, 'secretKey');

      // Verificar si el token expiró
      const tokenExpiration = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > tokenExpiration) {
        return response.redirect('/recover-password/error');  // Token expiró, redireccionar a la página de error o renderizar la vista...
      }

      // Actualizar la contraseña en la base de datos con la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userModel.updateOne({ email: decodedToken.email }, { password: hashedPassword });

      response.redirect('/recover-password/success');  // Redireccionar a la página de éxito o renderizar la vista..
    } catch (error) {
      response.redirect('/recover-password/error');  // Si el token no es válido, redireccionar a la página de error o renderizar la vista...
    }
  },

  async resetSuccess(request, response) {
    response.render('recovery/success')
  },
};

export default recoveryController;