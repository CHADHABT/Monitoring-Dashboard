import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConnectionSchema, documentSchema } from "@shared/schema";
import { MongoClient, ObjectId } from "mongodb";

export async function registerRoutes(app: Express): Promise<Server> {
  // Connections routes
  app.get("/api/connections", async (req, res) => {
    try {
      const connections = await storage.getAllConnections();
      res.json(connections);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/connections", async (req, res) => {
    try {
      const parsed = insertConnectionSchema.parse(req.body);
      const connection = await storage.createConnection(parsed);
      res.status(201).json(connection);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/connections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteConnection(id);
      if (!success) {
        return res.status(404).json({ message: "Connection not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/connections/:id/test", async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await storage.getConnection(id);
      
      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }

      const client = new MongoClient(connection.uri);
      
      try {
        await client.connect();
        const db = client.db(connection.database);
        await db.command({ ping: 1 });
        
        await storage.updateConnectionStatus(id, "connected");
        await client.close();
        
        res.json({ success: true, message: "Connection successful" });
      } catch (mongoError: any) {
        await storage.updateConnectionStatus(id, "disconnected");
        await client.close().catch(() => {});
        res.json({ success: false, message: "Failed to connect to MongoDB" });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Connection test failed" });
    }
  });

  // Documents routes
  app.get("/api/documents", async (req, res) => {
    try {
      const { connectionId, type, status, search, dateFrom, dateTo } = req.query;
      
      if (!connectionId) {
        return res.status(400).json({ message: "connectionId is required" });
      }

      const connection = await storage.getConnection(connectionId as string);
      
      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }

      const client = new MongoClient(connection.uri);
      
      try {
        await client.connect();
        const db = client.db(connection.database);
        const collection = db.collection(connection.collection);

        const query: any = {};
        
        if (type) {
          const types = Array.isArray(type) ? type : [type];
          query.Type = { $in: types };
        }
        
        if (status) {
          const statuses = Array.isArray(status) ? status : [status];
          query.Status = { $in: statuses };
        }
        
        if (search) {
          query.$or = [
            { YoozDocNum: { $regex: search, $options: 'i' } },
            { "Payload.CardCode": { $regex: search, $options: 'i' } },
            { "Payload.NumAtCard": { $regex: search, $options: 'i' } }
          ];
        }

        if (dateFrom || dateTo) {
          query.Last_updated = {};
          if (dateFrom) {
            query.Last_updated.$gte = dateFrom;
          }
          if (dateTo) {
            query.Last_updated.$lte = dateTo;
          }
        }

        const documents = await collection.find(query).limit(1000).toArray();
        await client.close();
        
        const validatedDocuments = documents
          .map(doc => {
            try {
              return documentSchema.parse({
                ...doc,
                _id: doc._id.toString(),
              });
            } catch (validationError) {
              return null;
            }
          })
          .filter(doc => doc !== null);
        
        res.json(validatedDocuments);
      } catch (mongoError: any) {
        await client.close().catch(() => {});
        res.status(500).json({ message: "Failed to fetch documents" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update document payload
  app.patch("/api/documents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { connectionId, payload } = req.body;

      if (!connectionId) {
        return res.status(400).json({ message: "connectionId is required" });
      }

      const connection = await storage.getConnection(connectionId);
      
      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }

      const client = new MongoClient(connection.uri);
      
      try {
        await client.connect();
        const db = client.db(connection.database);
        const collection = db.collection(connection.collection);

        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { 
            $set: { 
              Payload: payload,
              Last_updated: new Date().toISOString()
            } 
          }
        );

        await client.close();

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Document not found" });
        }

        res.json({ success: true, message: "Document updated successfully" });
      } catch (mongoError: any) {
        await client.close().catch(() => {});
        res.status(500).json({ message: "Failed to update document" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Statistics route
  app.get("/api/statistics", async (req, res) => {
    try {
      const { connectionId } = req.query;
      
      if (!connectionId) {
        return res.status(400).json({ message: "connectionId is required" });
      }

      const connection = await storage.getConnection(connectionId as string);
      
      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }

      const client = new MongoClient(connection.uri);
      
      try {
        await client.connect();
        const db = client.db(connection.database);
        const collection = db.collection(connection.collection);

        const [totalCount, loadedCount, failedCount, openCount, invoiceStats, creditNoteStats] = await Promise.all([
          collection.countDocuments(),
          collection.countDocuments({ Status: "LOADED" }),
          collection.countDocuments({ Status: "FAILED" }),
          collection.countDocuments({ Status: "OPEN" }),
          collection.aggregate([
            { $match: { Type: "PurchaseInvoices" } },
            { $group: {
              _id: "$Status",
              count: { $sum: 1 }
            }}
          ]).toArray(),
          collection.aggregate([
            { $match: { Type: "PurchaseCreditNotes" } },
            { $group: {
              _id: "$Status",
              count: { $sum: 1 }
            }}
          ]).toArray()
        ]);

        const invoiceLoaded = invoiceStats.find((s: any) => s._id === "LOADED")?.count || 0;
        const invoiceFailed = invoiceStats.find((s: any) => s._id === "FAILED")?.count || 0;
        const invoiceOpen = invoiceStats.find((s: any) => s._id === "OPEN")?.count || 0;
        const creditNoteLoaded = creditNoteStats.find((s: any) => s._id === "LOADED")?.count || 0;
        const creditNoteFailed = creditNoteStats.find((s: any) => s._id === "FAILED")?.count || 0;
        const creditNoteOpen = creditNoteStats.find((s: any) => s._id === "OPEN")?.count || 0;

        await client.close();
        
        res.json({
          total: totalCount,
          loaded: loadedCount,
          failed: failedCount,
          open: openCount,
          successRate: totalCount > 0 ? ((loadedCount / totalCount) * 100).toFixed(1) : "0",
          invoices: {
            total: invoiceLoaded + invoiceFailed + invoiceOpen,
            loaded: invoiceLoaded,
            failed: invoiceFailed,
            open: invoiceOpen
          },
          creditNotes: {
            total: creditNoteLoaded + creditNoteFailed + creditNoteOpen,
            loaded: creditNoteLoaded,
            failed: creditNoteFailed,
            open: creditNoteOpen
          }
        });
      } catch (mongoError: any) {
        await client.close().catch(() => {});
        res.status(500).json({ message: "Failed to fetch statistics" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "An error occurred" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
