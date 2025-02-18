import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { MinioClient } from 'minio';
import path from 'path';
import { uploadService } from '../services/upload.service.js';

// MinIO配置
const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

// 文件存储配置
const storage = multerS3({
  s3: minioClient,
  bucket: process.env.MINIO_BUCKET || 'aiedu',
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${req.user.id}/${file.fieldname}-${uniqueSuffix}`);
  }
});

// 文件类型验证
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image': ['image/jpeg', 'image/png', 'image/gif'],
    'video': ['video/mp4', 'video/webm'],
    'audio': ['audio/mpeg', 'audio/wav'],
    'document': ['application/pdf', 'application/msword']
  };

  const fileType = req.params.type || 'document';
  if (allowedTypes[fileType]?.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 10
  }
});

export const getFileUrl = async (key) => {
  try {
    const url = await minioClient.presignedGetObject(
      process.env.MINIO_BUCKET,
      key,
      24 * 60 * 60 // 24小时有效期
    );
    return url;
  } catch (err) {
    throw new Error('获取文件链接失败: ' + err.message);
  }
};

// 上传配置
export const uploadConfig = {
  // 上传文件存储路径
  uploadDir: path.join(process.cwd(), 'uploads'),

  // 文件大小限制
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 5 // 最大文件数
  },

  // 允许的文件类型
  allowedTypes: {
    image: ['.jpg', '.jpeg', '.png', '.gif'],
    video: ['.mp4', '.mpeg', '.avi'],
    audio: ['.mp3', '.wav'],
    document: ['.pdf', '.doc', '.docx', '.ppt', '.pptx']
  }
};

// 上传中间件
export const upload = uploadService.upload;

// 文件服务器配置
export const fileServerConfig = {
  baseUrl: process.env.FILE_SERVER_URL || '',
  
  // 文件访问URL生成器
  getFileUrl: (fileType, fileName) => {
    return `${fileServerConfig.baseUrl}/uploads/${fileType}/${fileName}`;
  },

  // 临时文件清理配置
  tempFileCleanup: {
    enabled: true,
    interval: '0 0 * * *', // 每天执行
    maxAge: 24 * 60 * 60 * 1000 // 24小时
  }
};

// 云存储配置（可选）
export const cloudStorageConfig = {
  enabled: process.env.CLOUD_STORAGE_ENABLED === 'true',
  provider: process.env.CLOUD_STORAGE_PROVIDER,
  credentials: {
    accessKeyId: process.env.CLOUD_STORAGE_ACCESS_KEY,
    secretAccessKey: process.env.CLOUD_STORAGE_SECRET_KEY
  },
  bucket: process.env.CLOUD_STORAGE_BUCKET,
  region: process.env.CLOUD_STORAGE_REGION
};
