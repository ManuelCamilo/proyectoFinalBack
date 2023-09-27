import UserManager from "../dao/usersManager.js";

class UserService {
  constructor() {
    this.userManager = new UserManager();
  }

  async getUserById(uid) {
    try {
      return await this.userManager.getUserById(uid);
    } catch (error) {
      throw error;
    }
  }

  async uploadDocuments(uid, files) {
    try {
      return await this.userManager.uploadDocuments(uid, files);
    } catch (error) {
      throw error;
    }
  }

  async changeUserRole(uid) {
    try {
      return await this.userManager.changeUserRole(uid);
    } catch (error) {
      throw error;
    }
  }

  async getUsersList() {
    try {
      return await this.userManager.getUsersList();
    } catch (error) {
      throw error;
    }
  }

  async deleteInactiveUsers() {
    try {
      return await this.userManager.deleteInactiveUsers();
    } catch (error) {
      throw error;
    }
  }

  async manualChangeRole(userId, newRole) {
    try {
      return await this.userManager.manualChangeRole(userId, newRole);
    } catch (error) {
      throw error;
    }
  }

  async manualDeleteUser(userId) {
    try {
      return await this.userManager.manualDeleteUser(userId);
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
