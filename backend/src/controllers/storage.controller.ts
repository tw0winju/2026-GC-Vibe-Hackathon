import { Request, Response } from 'express';
import * as storageService from '../services/storage.service.js';
import { AppError } from '../middlewares/errorHandler.js';

export const getUploadUrl = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, '인증이 필요합니다');

  const { type, filename, mime_type } = req.body;
  const result = await storageService.createUploadUrl({
    userId: req.user.userId,
    type,
    filename,
    mimeType: mime_type,
  });

  res.json(result);
};

export const getFileUrl = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, '인증이 필요합니다');

  const { type, file_path } = req.body;
  const url = await storageService.getFileUrl({ type, filePath: file_path });

  res.json({ url });
};