// crud.middleware.ts

import { PrismaClientService } from '@db/prisma-client';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CrudMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaClientService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Vérifier si c'est une route CRUD API
    if (!req.path.startsWith('/api/crud/')) {
      return next();
    }

    // Extraire le modèle de l'URL (ex: /api/crud/user -> user)
    const pathParts = req.path.split('/');
    const modelName = pathParts[3]; // /api/crud/[model]

    if (!modelName || !this.isValidModel(modelName)) {
      return res.status(404).json({ error: 'Model not found' });
    }

    // Récupérer l'utilisateur depuis les headers ou le token
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'] ?? 'USER';
    // const user = userId ? { id: String(userId), role: userRole } : undefined;
    const user = userId ? { id: String(userId), role: userRole as string } : undefined;

    console.log("CRUD Middleware - User:", user, "Model:", modelName);

    // Traiter la requête selon la méthode HTTP
    this.handleCrudRequest(req, res, modelName, user);
  }

  private async handleCrudRequest(
    req: Request,
    res: Response,
    modelName: string,
    user?: { id: string; role: string }
  ) {
    try {
      const model = this.prismaService[modelName];
      if (!model) {
        return res.status(404).json({ error: 'Model not found' });
      }

      switch (req.method) {
        case 'GET':
          return this.handleGet(req, res, model, user);
        case 'POST':
          return this.handlePost(req, res, model, user);
        case 'PUT':
        case 'PATCH':
          return this.handleUpdate(req, res, model, user);
        case 'DELETE':
          return this.handleDelete(req, res, model, user);
        default:
          return res.status(405).json({ error: 'Method not allowed' });
      }
    } catch (error) {
      console.error('CRUD Middleware Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  private async handleGet(req: Request, res: Response, model: any, user?: any) {
    const { id } = req.params;
    const { page = 1, limit = 10, ...filters } = req.query;

    if (id) {
      // GET single record
      const record = await model.findUnique({
        where: { id: String(id) },
        ...this.applyUserFilter(user)
      });
      return res.json(record);
    } else {
      // GET multiple records with pagination
      const skip = (Number(page) - 1) * Number(limit);
      const where = { ...filters, ...this.buildUserWhereClause(user) };

      const [records, total] = await Promise.all([
        model.findMany({
          where,
          skip,
          take: Number(limit),
        }),
        model.count({ where })
      ]);

      return res.json({
        data: records,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      });
    }
  }

  private async handlePost(req: Request, res: Response, model: any, user?: any) {
    const data = {
      ...req.body,
      ...this.addUserToData(user)
    };

    const record = await model.create({ data });
    return res.status(201).json(record);
  }

  private async handleUpdate(req: Request, res: Response, model: any, user?: any) {
    const { id } = req.params;
    const data = req.body;

    const record = await model.update({
      where: {
        id: String(id),
        ...this.buildUserWhereClause(user)
      },
      data
    });

    return res.json(record);
  }

  private async handleDelete(req: Request, res: Response, model: any, user?: any) {
    const { id } = req.params;

    await model.delete({
      where: {
        id: String(id),
        ...this.buildUserWhereClause(user)
      }
    });

    return res.status(204).send();
  }

  private isValidModel(modelName: string): boolean {
    // Liste des modèles autorisés - à adapter selon votre schéma Prisma
    const allowedModels = [
      'user', 'task', 'project', 'organization',
      // Ajouter vos modèles ici
    ];
    return allowedModels.includes(modelName.toLowerCase());
  }

  private applyUserFilter(user?: any) {
    if (!user) return {};

    // Logique de filtrage basée sur l'utilisateur
    // À adapter selon vos règles métier
    return {};
  }

  private buildUserWhereClause(user?: any) {
    if (!user) return {};

    // Construire les clauses WHERE basées sur l'utilisateur
    // Exemple : limiter aux données de l'utilisateur ou de son organisation
    if (user.role === 'ADMIN') {
      return {}; // Admin voit tout
    }

    return {
      // userId: user.id // Exemple : limiter aux données de l'utilisateur
    };
  }

  private addUserToData(user?: any) {
    if (!user) return {};

    // Ajouter automatiquement l'ID utilisateur aux nouvelles créations
    return {
      // userId: user.id // Exemple
    };
  }
}

/*
Pour utiliser ce middleware, ajoutez-le à votre module principal NestJS:

import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CrudMiddleware } from '@be/common';

@Module({
  // ...existing code...
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CrudMiddleware)
      .forRoutes({ path: '/api/crud/*', method: RequestMethod.ALL });
  }
}

Utilisation:
# GET tous les utilisateurs
GET /api/crud/user

# GET utilisateur spécifique
GET /api/crud/user/123

# POST nouveau utilisateur
POST /api/crud/user
Content-Type: application/json
{ "name": "John", "email": "john@example.com" }

# PUT/PATCH mise à jour
PUT /api/crud/user/123
Content-Type: application/json
{ "name": "John Updated" }

# DELETE
DELETE /api/crud/user/123
*/
