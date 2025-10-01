import { pgPool, query, queryOne, transaction } from './supabase';
import bcrypt from 'bcryptjs';

// User operations
export const db = {
  user: {
    async findById(id: string) {
      return queryOne('SELECT * FROM users WHERE id = $1', [id]);
    },
    
    async findByEmail(email: string) {
      return queryOne('SELECT * FROM users WHERE email = $1', [email]);
    },
    
    async create(data: {
      email: string;
      name?: string;
      hashedPassword?: string;
      dob: Date;
      gender?: string;
      anniversary?: Date;
      address?: any;
    }) {
      const result = await queryOne(
        `INSERT INTO users (email, name, hashed_password, dob, gender, anniversary, address)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [data.email, data.name, data.hashedPassword, data.dob, data.gender || 'other', data.anniversary, data.address ? JSON.stringify(data.address) : null]
      );
      return result;
    },
    
    async update(id: string, data: any) {
      const fields = [];
      const values = [];
      let idx = 1;
      
      for (const [key, value] of Object.entries(data)) {
        if (key === 'address' && value) {
          fields.push(`address = $${idx}::jsonb`);
          values.push(JSON.stringify(value));
        } else {
          fields.push(`${key} = $${idx}`);
          values.push(value);
        }
        idx++;
      }
      
      values.push(id);
      
      return queryOne(
        `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
    },
    
    async delete(id: string) {
      return query('DELETE FROM users WHERE id = $1', [id]);
    },
    
    async findMany(where?: any) {
      if (!where) {
        return query('SELECT * FROM users');
      }
      
      const conditions = [];
      const values = [];
      let idx = 1;
      
      for (const [key, value] of Object.entries(where)) {
        conditions.push(`${key} = $${idx}`);
        values.push(value);
        idx++;
      }
      
      return query(`SELECT * FROM users WHERE ${conditions.join(' AND ')}`, values);
    }
  },
  
  account: {
    async create(data: any) {
      return queryOne(
        `INSERT INTO accounts (user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [data.userId, data.type, data.provider, data.providerAccountId, data.refresh_token, data.access_token, data.expires_at, data.token_type, data.scope, data.id_token, data.session_state]
      );
    },
    
    async findUnique(provider: string, providerAccountId: string) {
      return queryOne(
        'SELECT * FROM accounts WHERE provider = $1 AND provider_account_id = $2',
        [provider, providerAccountId]
      );
    }
  },
  
  session: {
    async create(data: any) {
      return queryOne(
        `INSERT INTO sessions (session_token, user_id, expires)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [data.sessionToken, data.userId, data.expires]
      );
    },
    
    async findUnique(sessionToken: string) {
      return queryOne(
        'SELECT * FROM sessions WHERE session_token = $1',
        [sessionToken]
      );
    },
    
    async delete(sessionToken: string) {
      return query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);
    }
  },
  
  verificationToken: {
    async create(data: any) {
      return queryOne(
        `INSERT INTO verification_tokens (identifier, token, expires)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [data.identifier, data.token, data.expires]
      );
    },
    
    async findUnique(identifier: string, token: string) {
      return queryOne(
        'SELECT * FROM verification_tokens WHERE identifier = $1 AND token = $2',
        [identifier, token]
      );
    },
    
    async delete(identifier: string, token: string) {
      return query(
        'DELETE FROM verification_tokens WHERE identifier = $1 AND token = $2',
        [identifier, token]
      );
    }
  },
  
  event: {
    async findMany(userId?: string) {
      if (userId) {
        return query('SELECT * FROM events WHERE user_id = $1 ORDER BY event_date', [userId]);
      }
      return query('SELECT * FROM events ORDER BY event_date');
    },
    
    async findById(id: string) {
      return queryOne('SELECT * FROM events WHERE id = $1', [id]);
    },
    
    async create(data: any) {
      return queryOne(
        `INSERT INTO events (user_id, name, occasion, event_date, description)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [data.userId, data.name, data.occasion, data.eventDate, data.description]
      );
    },
    
    async update(id: string, data: any) {
      const fields = [];
      const values = [];
      let idx = 1;
      
      for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = $${idx}`);
        values.push(value);
        idx++;
      }
      
      values.push(id);
      
      return queryOne(
        `UPDATE events SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
    },
    
    async delete(id: string) {
      return query('DELETE FROM events WHERE id = $1', [id]);
    }
  },
  
  list: {
    async findMany(userId?: string) {
      if (userId) {
        return query('SELECT * FROM lists WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      }
      return query('SELECT * FROM lists ORDER BY created_at DESC');
    },
    
    async findById(id: string) {
      return queryOne('SELECT * FROM lists WHERE id = $1', [id]);
    },
    
    async create(data: any) {
      return queryOne(
        `INSERT INTO lists (user_id, event_id, name)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [data.userId, data.eventId, data.name]
      );
    },
    
    async update(id: string, data: any) {
      const fields = [];
      const values = [];
      let idx = 1;
      
      for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = $${idx}`);
        values.push(value);
        idx++;
      }
      
      values.push(id);
      
      return queryOne(
        `UPDATE lists SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
    },
    
    async delete(id: string) {
      return query('DELETE FROM lists WHERE id = $1', [id]);
    }
  },
  
  listItem: {
    async findMany(listId?: string) {
      if (listId) {
        return query('SELECT * FROM list_items WHERE list_id = $1 ORDER BY created_at DESC', [listId]);
      }
      return query('SELECT * FROM list_items ORDER BY created_at DESC');
    },
    
    async findById(id: string) {
      return queryOne('SELECT * FROM list_items WHERE id = $1', [id]);
    },
    
    async create(data: any) {
      return queryOne(
        `INSERT INTO list_items (list_id, product_name, product_url, image_url, price, currency, variants, platform, quantity, status, held_by_user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [data.listId, data.productName, data.productUrl, data.imageUrl, data.price, data.currency || 'USD', 
         data.variants, data.platform, data.quantity || 1, data.status || 'WISHED', data.heldByUserId]
      );
    },
    
    async update(id: string, data: any) {
      const fields = [];
      const values = [];
      let idx = 1;
      
      for (const [key, value] of Object.entries(data)) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${idx}`);
        values.push(value);
        idx++;
      }
      
      values.push(id);
      
      return queryOne(
        `UPDATE list_items SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
    },
    
    async delete(id: string) {
      return query('DELETE FROM list_items WHERE id = $1', [id]);
    }
  },
  
  friendship: {
    async findMany(userId: string) {
      return query(
        `SELECT * FROM friendships 
         WHERE (requester_id = $1 OR addressee_id = $1)
         ORDER BY created_at DESC`,
        [userId]
      );
    },
    
    async findById(id: string) {
      return queryOne('SELECT * FROM friendships WHERE id = $1', [id]);
    },
    
    async findByUsers(requesterId: string, addresseeId: string) {
      return queryOne(
        'SELECT * FROM friendships WHERE requester_id = $1 AND addressee_id = $2',
        [requesterId, addresseeId]
      );
    },
    
    async create(data: any) {
      return queryOne(
        `INSERT INTO friendships (requester_id, addressee_id, status)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [data.requesterId, data.addresseeId, data.status || 'PENDING']
      );
    },
    
    async update(id: string, data: any) {
      const fields = [];
      const values = [];
      let idx = 1;
      
      for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = $${idx}`);
        values.push(value);
        idx++;
      }
      
      values.push(id);
      
      return queryOne(
        `UPDATE friendships SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
    },
    
    async delete(id: string) {
      return query('DELETE FROM friendships WHERE id = $1', [id]);
    }
  },
  
  notification: {
    async findMany(userId: string) {
      return query(
        'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
    },
    
    async create(data: any) {
      return queryOne(
        `INSERT INTO notifications (user_id, message, is_read)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [data.userId, data.message, data.isRead || false]
      );
    },
    
    async markAsRead(id: string) {
      return queryOne(
        'UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *',
        [id]
      );
    }
  },
  
  socialActivity: {
    async findMany(userIds?: string[]) {
      if (userIds && userIds.length > 0) {
        const placeholders = userIds.map((_, i) => `$${i + 1}`).join(', ');
        return query(
          `SELECT sa.*, u.name as user_name, u.image as user_image
           FROM social_activities sa
           JOIN users u ON sa.user_id = u.id
           WHERE sa.user_id IN (${placeholders})
           ORDER BY sa.created_at DESC
           LIMIT 50`,
          userIds
        );
      }
      return query(
        `SELECT sa.*, u.name as user_name, u.image as user_image
         FROM social_activities sa
         JOIN users u ON sa.user_id = u.id
         ORDER BY sa.created_at DESC
         LIMIT 50`
      );
    },
    
    async create(data: any) {
      return queryOne(
        `INSERT INTO social_activities (user_id, activity_type, entity_type, entity_id, entity_name)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [data.userId, data.activityType, data.entityType, data.entityId, data.entityName]
      );
    }
  },
  
  feedback: {
    async findMany() {
      return query('SELECT * FROM feedback ORDER BY created_at DESC');
    },
    
    async create(data: any) {
      return queryOne(
        `INSERT INTO feedback (name, email, feedback, rating, category)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [data.name, data.email, data.feedback, data.rating, data.category || 'general']
      );
    },
    
    async delete(id: string) {
      return query('DELETE FROM feedback WHERE id = $1', [id]);
    }
  },
  
  itemBlock: {
    async findByItem(itemId: string) {
      return query('SELECT * FROM item_blocks WHERE item_id = $1', [itemId]);
    },
    
    async create(itemId: string, userId: string) {
      return queryOne(
        `INSERT INTO item_blocks (item_id, user_id)
         VALUES ($1, $2)
         ON CONFLICT (item_id, user_id) DO NOTHING
         RETURNING *`,
        [itemId, userId]
      );
    },
    
    async delete(itemId: string, userId: string) {
      return query(
        'DELETE FROM item_blocks WHERE item_id = $1 AND user_id = $2',
        [itemId, userId]
      );
    }
  },
  
  stats: {
    async getAdminStats() {
      const userCount = await queryOne('SELECT COUNT(*) as count FROM users');
      const listCount = await queryOne('SELECT COUNT(*) as count FROM lists');
      const itemCount = await queryOne('SELECT COUNT(*) as count FROM list_items');
      const eventCount = await queryOne('SELECT COUNT(*) as count FROM events');
      
      return {
        totalUsers: parseInt(userCount?.count || '0'),
        totalLists: parseInt(listCount?.count || '0'),
        totalItems: parseInt(itemCount?.count || '0'),
        totalEvents: parseInt(eventCount?.count || '0')
      };
    }
  }
};