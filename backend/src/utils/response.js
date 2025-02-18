class APIResponse {
  static success(data = null, message = '操作成功') {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    };
  }

  static error(message = '操作失败', code = 500) {
    return {
      success: false,
      code,
      message,
      timestamp: new Date().toISOString()
    };
  }

  static list(items, total, page, pageSize) {
    return {
      success: true,
      data: {
        items,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        }
      },
      timestamp: new Date().toISOString()
    };
  }

  static stream(data) {
    return {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
  }
}

// 响应处理中间件
export const responseHandler = (req, res, next) => {
  res.success = (data, message) => {
    res.json(APIResponse.success(data, message));
  };

  res.error = (message, code = 500) => {
    res.status(code).json(APIResponse.error(message, code));
  };

  res.list = (items, total, page, pageSize) => {
    res.json(APIResponse.list(items, total, page, pageSize));
  };

  res.stream = (data) => {
    res.json(APIResponse.stream(data));
  };

  next();
};

export default APIResponse;
