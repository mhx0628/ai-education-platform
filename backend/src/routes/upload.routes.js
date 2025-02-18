import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller.js';
import { upload } from '../config/storage.js';
import { checkRole } from '../middlewares/auth.js';

const router = Router();

// 文件上传路由
router.post('/file',
  upload.single('file'),
  uploadController.uploadFile
);

router.post('/files',
  upload.array('files', 5),
  uploadController.uploadMultipleFiles
);

// 特定类型文件上传
router.post('/image',
  upload.single('image'),
  uploadController.uploadImage
);

router.post('/video',
  checkRole(['teacher', 'admin']),
  upload.single('video'),
  uploadController.uploadVideo
);

// 文件管理路由
router.get('/files',
  uploadController.getUserFiles
);

router.delete('/files/:fileId',
  uploadController.deleteFile
);

// 文件处理路由
router.post('/files/:fileId/process',
  uploadController.processFile
);

export default router;
