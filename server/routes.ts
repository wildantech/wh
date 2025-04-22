import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint untuk mendapatkan semua kenangan
  app.get("/api/memories", async (_req: Request, res: Response) => {
    try {
      const memories = await storage.getMemories();
      return res.json(memories);
    } catch (error) {
      console.error("Error fetching memories:", error);
      return res.status(500).json({ message: "Terjadi kesalahan saat mengambil kenangan" });
    }
  });

  // Endpoint untuk mendapatkan kenangan berdasarkan ID
  app.get("/api/memories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }

      const memory = await storage.getMemory(id);
      if (!memory) {
        return res.status(404).json({ message: "Kenangan tidak ditemukan" });
      }

      return res.json(memory);
    } catch (error) {
      console.error("Error fetching memory:", error);
      return res.status(500).json({ message: "Terjadi kesalahan saat mengambil kenangan" });
    }
  });

  // Endpoint untuk menambahkan kenangan baru
  app.post("/api/memories", async (req: Request, res: Response) => {
    try {
      // Validasi data kenangan
      const result = insertMemorySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Data tidak valid", 
          errors: result.error.format() 
        });
      }

      // Tambahkan kenangan ke database
      const memory = await storage.createMemory(result.data);
      return res.status(201).json(memory);
    } catch (error) {
      console.error("Error creating memory:", error);
      return res.status(500).json({ message: "Terjadi kesalahan saat membuat kenangan" });
    }
  });

  // Endpoint untuk menghapus kenangan
  app.delete("/api/memories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }

      const success = await storage.deleteMemory(id);
      if (!success) {
        return res.status(404).json({ message: "Kenangan tidak ditemukan" });
      }

      return res.json({ message: "Kenangan berhasil dihapus" });
    } catch (error) {
      console.error("Error deleting memory:", error);
      return res.status(500).json({ message: "Terjadi kesalahan saat menghapus kenangan" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
