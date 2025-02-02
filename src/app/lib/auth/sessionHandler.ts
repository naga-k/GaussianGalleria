import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

interface SessionConfig {
  cookieKey: string;
  sessionSecret: Uint8Array;
  alg: string;
  expiry: string;
}

interface SessionPayload extends JWTPayload {
  userId: string;
  expiresAt: Date;
}

export default class SessionHandler {
  sessionConfig: SessionConfig;

  constructor() {
    const sessionSecret = process.env.AUTH_SESSION_SECRET;
    const alg = process.env.AUTH_JWT_ALG;
    const expiry = process.env.AUTH_SESSION_EXPIRY;
    const cookieKey = process.env.AUTH_COOKIE_KEY;

    if (!sessionSecret) {
      throw new Error("AUTH_SESSION_SECRET missing in Environment Variables");
    }

    if (!alg) {
      throw new Error("AUTH_JWT_ALG missing in Environment Variables");
    }

    if (!expiry) {
      throw new Error("AUTH_SESSION_EXPIRY missing in Environment Variables");
    }

    if (!cookieKey) {
      throw new Error("AUTH_COOKIE_KEY missing in Environment Variables");
    }

    this.sessionConfig = {
      cookieKey: cookieKey,
      sessionSecret: new TextEncoder().encode(sessionSecret),
      alg: "HS256",
      expiry: expiry,
    };
  }

  async createSession(payload: SessionPayload) {
    const session = await this.encrypt(payload);

    const cookieStore = await cookies();

    cookieStore.set(this.sessionConfig.cookieKey, session, {
      httpOnly: true,
      secure: true,
      expires: payload.expiresAt,
      sameSite: "lax",
      path: "/",
    });
  }

  async verifySession(userId: string) {
    const cookie = (await cookies()).get(this.sessionConfig.cookieKey)?.value;
    if (!cookie) {
      return false;
    }

    const session: SessionPayload = (await this.decrypt(cookie)).payload;

    if (
      !session?.userId ||
      session?.userId !== userId ||
      session?.expiresAt < new Date(Date.now())
    ) {
      return false;
    }

    return true;
  }

  async deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete(this.sessionConfig.cookieKey);
  }

  encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: this.sessionConfig.alg })
      .setIssuedAt()
      .setExpirationTime(this.sessionConfig.expiry)
      .sign(this.sessionConfig.sessionSecret);
  }

  async decrypt(session: string) {
    try {
      const payload = await jwtVerify<SessionPayload>(
        session,
        this.sessionConfig.sessionSecret,
        {
          algorithms: [this.sessionConfig.alg],
        }
      );
      return payload;
    } catch (error) {
      throw new Error(`Failed to verify session: ${error}`);
    }
  }
}
