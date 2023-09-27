import userModel from '../model/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import emailConfig from '../config/emailConfig.js';
import dotenv from 'dotenv';
dotenv.config();

const recoveryService = {
  async sendRecoveryEmail(email) {
    const user = await userModel.findOne({ email });

    if (!user) {
      return { error: 'El correo electrónico no está registrado', emailNotRegistered: true };
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
    return { success: true };
  },

  async resetPassword(token, newPassword, confirmNewPassword) {
    if (newPassword !== confirmNewPassword) {
      return { error: 'Las contraseñas no coinciden' };
    }

    try {
      const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
      const expirationTimeInSeconds = decodedToken.exp;
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      if (currentTimeInSeconds > expirationTimeInSeconds) {
        return { error: 'El token ha expirado' };
      }

      const user = await userModel.findOne({ email: decodedToken.email });
      const isPasswordMatch = await bcrypt.compare(newPassword, user.password);

      if (isPasswordMatch) {
        return { error: 'La nueva contraseña debe ser diferente de la anterior' };
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userModel.updateOne({ email: decodedToken.email }, { password: hashedPassword });
      return { success: true };
    } catch (error) {
      return { error: 'El token no es válido' };
    }
  },
};

export default recoveryService;
