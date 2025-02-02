import UserCredentials from "../definitions/auth/UserCredentials";
import SessionHandler from "./sessionHandler";

const DEFAULT_CREDENTIALS: UserCredentials = {
  email: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
};

export default class AuthHandler {
  sessionHandler: SessionHandler;

  constructor() {
    this.sessionHandler = new SessionHandler();
  }

  async login(credentials: UserCredentials) {
    if (
      !credentials.email ||
      !credentials.password ||
      !(
        credentials.email == DEFAULT_CREDENTIALS.email &&
        credentials.password == DEFAULT_CREDENTIALS.password
      )
    ) {
      return false;
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return this.sessionHandler
      .createSession({ userId: credentials.email, expiresAt })
      .then(() => {
        return true;
      })
      .catch((error) => {
        throw error;
      });
  }

  async verifyAuth() {
    if (!DEFAULT_CREDENTIALS.email) {
      throw new Error("No Admin credentials set.");
    }
    return await this.sessionHandler.verifySession(DEFAULT_CREDENTIALS.email);
  }

  async logout() {
    return this.sessionHandler
      .deleteSession()
      .then(() => {
        return true;
      })
      .catch((error) => {
        throw error;
      });
  }
}
