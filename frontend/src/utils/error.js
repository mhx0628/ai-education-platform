import { ElMessage } from 'element-plus';

export class AppError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  AI: 'AI_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

export function handleError(error, context = '') {
  console.error(`[${context}]`, error);

  if (error instanceof AppError) {
    showErrorMessage(error.message);
    return;
  }

  if (error.isAxiosError) {
    handleAxiosError(error);
    return;
  }

  showErrorMessage('发生未知错误，请稍后重试');
}

function handleAxiosError(error) {
  if (!error.response) {
    showErrorMessage('网络连接失败，请检查网络设置');
    return;
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      showErrorMessage(data.message || '请求参数错误');
      break;
    case 401:
      showErrorMessage('登录已过期，请重新登录');
      // 触发登出逻辑
      break;
    case 403:
      showErrorMessage('您没有权限执行此操作');
      break;
    case 404:
      showErrorMessage('请求的资源不存在');
      break;
    case 500:
      showErrorMessage('服务器内部错误');
      break;
    default:
      showErrorMessage('请求失败，请稍后重试');
  }
}

function showErrorMessage(message, type = 'error') {
  ElMessage({
    message,
    type,
    duration: 3000,
    showClose: true
  });
}

export function createError(code, message, details = null) {
  return new AppError(message, code, details);
}

export function validateResponse(response) {
  if (!response) {
    throw createError(ErrorTypes.SERVER, '服务器响应为空');
  }

  if (response.error) {
    throw createError(
      ErrorTypes.SERVER,
      response.error.message || '请求失败',
      response.error
    );
  }

  return response;
}
