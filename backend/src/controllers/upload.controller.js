import { uploadService } from '../services/upload.service.js';
import { moderationService } from '../services/moderation.service.js';
import { createError } from '../utils/error.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const uploadController = {
  uploadFile: asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) {
      throw createError(400, '未检测到上传文件');
    }

    const result = await uploadService.handleUpload([file], req.user.id);
    res.success(result[0]);
  }),

  uploadMultipleFiles: asyncHandler(async (req, res) => {
    const files = req.files;
    if (!files?.length) {
      throw createError(400, '未检测到上传文件');
    }

    const results = await uploadService.handleUpload(files, req.user.id);
    res.success(results);
  }),

  uploadImage: asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) {
      throw createError(400, '未检测到上传图片');
    }

    // 图片审核
    const moderationResult = await moderationService.moderateContent({
      type: 'image',
      filePath: file.path
    });

    if (!moderationResult.isApproved) {
      throw createError(400, '图片内容不合规：' + moderationResult.reason);
    }

    const result = await uploadService.handleUpload([file], req.user.id, 'image');
    res.success(result[0]);
  }),

  uploadVideo: asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) {
      throw createError(400, '未检测到上传视频');
    }

    // 视频处理任务
    const processingTask = await uploadService.processVideo(file);
    
    res.success({
      taskId: processingTask.id,
      status: 'processing',
      message: '视频正在处理中'
    });
  }),

  getUserFiles: asyncHandler(async (req, res) => {
    const { type, page = 1, limit = 20 } = req.query;
    const files = await uploadService.getUserFiles(req.user.id, {
      type,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.success(files);
  }),

  deleteFile: asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    await uploadService.deleteFile(fileId, req.user.id);
    res.success(null, '文件删除成功');
  }),

  processFile: asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const { operation } = req.body;

    const result = await uploadService.processFile(fileId, operation);
    res.success(result);
  })
};
