import UserService from "../services/usersService.js";

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
  }
};


export default UsersController;