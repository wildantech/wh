import { users, type User, type InsertUser, memories, type Memory, type InsertMemory } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Memory methods
  getMemories(): Promise<Memory[]>;
  getMemory(id: number): Promise<Memory | undefined>;
  createMemory(memory: InsertMemory): Promise<Memory>;
  deleteMemory(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Memory methods
  async getMemories(): Promise<Memory[]> {
    return await db.select().from(memories).orderBy(memories.id);
  }

  async getMemory(id: number): Promise<Memory | undefined> {
    const [memory] = await db.select().from(memories).where(eq(memories.id, id));
    return memory || undefined;
  }

  async createMemory(insertMemory: InsertMemory): Promise<Memory> {
    const [memory] = await db
      .insert(memories)
      .values(insertMemory)
      .returning();
    return memory;
  }

  async deleteMemory(id: number): Promise<boolean> {
    const result = await db
      .delete(memories)
      .where(eq(memories.id, id))
      .returning({ id: memories.id });
    
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
