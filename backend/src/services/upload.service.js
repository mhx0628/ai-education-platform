import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { moderationService } from './moderation.service.js';
import { createError } from '../utils/error.js';
import logger from '../utils/logger.js';

class UploadService {
  constructor() {
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const type = this.getFileType(file.mimetype);
        const uploadDir = path.join(process.cwd(), 'uploads', type);
        fs.mkdir(uploadDir, { recursive: true })
          .then(() => cb(null, uploadDir))
          .catch(err => cb(err));
      },
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      }
    });

    this.fileFilter = (req, file, cb) => {
      const allowedTypes = this.getAllowedTypes();
      if (!allowedTypes[this.getFileType(file.mimetype)]) {
        cb(new Error('不支持的文件类型'), false);
        return;
      }
      cb(null, true);
    };

    this.upload = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
        files: 5
      }
    });
  }

  async handleUpload(files, userId, type = 'general') {
    try {
      const results = await Promise.all(
        files.map(file => this.processFile(file, userId, type))
      );

      return results.filter(result => result !== null);
    } catch (error) {
      logger.error('文件上传处理失败:', error);
      throw error;
    }
  }

  async processFile(file, userId, type) {
    try {
      // 文件内容审核
      const moderationResult = await moderationService.moderateContent({
        type: this.getFileType(file.mimetype),
        filePath: file.path
      });

      if (!moderationResult.isApproved) {
        await this.removeFile(file.path);
        return null;
      }

      // 生成文件访问URL
      const fileUrl = this.generateFileUrl(file);

      // 记录文件信息
      return await this.saveFileInfo({
        userId,
        originalName: file.originalname,
        fileName: file.filename,
        fileType: this.getFileType(file.mimetype),
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        url: fileUrl,
        uploadType: type
      });
    } catch (error) {
      logger.error('文件处理失败:', error);
      await this.removeFile(file.path);
      return null;
    }
  }

  private getFileType(mimeType) {
    const types = {
      'image': ['image/jpeg', 'image/png', 'image/gif'],
      'video': ['video/mp4', 'video/mpeg'],
      'audio': ['audio/mpeg', 'audio/wav'],
      'document': ['application/pdf', 'application/msword']
    };

    for (const [type, mimes] of Object.entries(types)) {
      if (mimes.includes(mimeType)) return type;
    }
    return 'other';
  }

  private getAllowedTypes() {
    return {
      image: true,
      video: true,
      audio: true,
      document: true
    };
  }

  private generateFileUrl(file) {
    const baseUrl = process.env.FILE_SERVER_URL || '';
    return `${baseUrl}/uploads/${this.getFileType(file.mimetype)}/${file.filename}`;
  }

  private async removeFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.error('文件删除失败:', error);
    }
  }

  private async saveFileInfo(fileInfo) {
    // 实现文件信息保存到数据库的逻辑
    return fileInfo;
  }
}

export const uploadService = new UploadService();
