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
      return response.render('recovery/recoveryForm', { error: 'El correo electrónico no está registrado', emailNotRegistered: true });
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

    response.render('recovery/success'); 
  },

  showResetForm(request, response) {
    const { token } = request.params;
    response.render('recovery/resetForm', { token });  
  },

  async resetPassword(request, response) {
    const { token } = request.params;
    const { newPassword, confirmNewPassword } = request.body;

    if (newPassword !== confirmNewPassword) {
      return response.render('recovery/resetForm', { token, passwordInc: true})
    }

    try {
      const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);

      // Verificamos token
      const expirationTimeInSeconds = decodedToken.exp;
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      if (currentTimeInSeconds > expirationTimeInSeconds) {
        return response.render('recovery/failure');  // Token expiró, renderizar la vista...
      }

      const user = await userModel.findOne({ email: decodedToken.email});
      const isPasswordMatch = await bcrypt.compare(newPassword, user.password);

      if (isPasswordMatch) {
        return response.render('recovery/resetForm', {token, newPasswordMatch:true})
      }

      // Actualizar la contraseña 
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userModel.updateOne({ email: decodedToken.email }, { password: hashedPassword });
      response.render('recovery/changeOK');
    } catch (error) {
      response.render('recovery/failure');  // Si el token no es válido, redireccionar a la página de error o renderizar la vista...
    }
  },
};
 
export default recoveryController;