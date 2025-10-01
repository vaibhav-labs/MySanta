import { Adapter } from "next-auth/adapters";
import { db } from "./db";

export function SupabaseAdapter(): Adapter {
  return {
    async createUser(user: any) {
      const newUser = await db.user.create({
        email: user.email,
        name: user.name || undefined,
        dob: new Date('1990-01-01'), // Default DOB, should be updated later
      });
      return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        image: newUser.image,
        emailVerified: newUser.email_verified,
      };
    },
    
    async getUser(id: any) {
      const user = await db.user.findById(id);
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.email_verified,
      };
    },
    
    async getUserByEmail(email: any) {
      const user = await db.user.findByEmail(email);
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.email_verified,
      };
    },
    
    async getUserByAccount({ providerAccountId, provider }: any) {
      const account = await db.account.findUnique(provider, providerAccountId);
      if (!account) return null;
      
      const user = await db.user.findById(account.user_id);
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.email_verified,
      };
    },
    
    async updateUser(user: any) {
      const updates: any = {};
      if (user.name !== undefined) updates.name = user.name;
      if (user.email !== undefined) updates.email = user.email;
      if (user.image !== undefined) updates.image = user.image;
      if (user.emailVerified !== undefined) updates.email_verified = user.emailVerified;
      
      const updatedUser = await db.user.update(user.id!, updates);
      
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        image: updatedUser.image,
        emailVerified: updatedUser.email_verified,
      };
    },
    
    async deleteUser(userId: any) {
      await db.user.delete(userId);
    },
    
    async linkAccount(account: any) {
      await db.account.create({
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      });
    },
    
    async unlinkAccount({ providerAccountId, provider }: any) {
      // Not implemented for now
    },
    
    async createSession({ sessionToken, userId, expires }: any) {
      const session = await db.session.create({
        sessionToken,
        userId,
        expires,
      });
      
      return {
        sessionToken: session.session_token,
        userId: session.user_id,
        expires: session.expires,
      };
    },
    
    async getSessionAndUser(sessionToken: any) {
      const session = await db.session.findUnique(sessionToken);
      if (!session) return null;
      
      const user = await db.user.findById(session.user_id);
      if (!user) return null;
      
      return {
        session: {
          sessionToken: session.session_token,
          userId: session.user_id,
          expires: session.expires,
        },
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.email_verified,
        },
      };
    },
    
    async updateSession({ sessionToken, expires }: any) {
      // Not implemented for now
      return null;
    },
    
    async deleteSession(sessionToken: any) {
      await db.session.delete(sessionToken);
    },
    
    async createVerificationToken({ identifier, expires, token }: any) {
      const verificationToken = await db.verificationToken.create({
        identifier,
        token,
        expires,
      });
      
      return {
        identifier: verificationToken.identifier,
        expires: verificationToken.expires,
        token: verificationToken.token,
      };
    },
    
    async useVerificationToken({ identifier, token }: any) {
      const verificationToken = await db.verificationToken.findUnique(identifier, token);
      if (!verificationToken) return null;
      
      await db.verificationToken.delete(identifier, token);
      
      return {
        identifier: verificationToken.identifier,
        expires: verificationToken.expires,
        token: verificationToken.token,
      };
    },
  };
}