import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message:
          "Acesso negado. O seu perfil não tem permissão para esta ação.",
        statusCode: 403,
        error: "Forbidden",
      });
      return;
    }
    next();
  };
};
