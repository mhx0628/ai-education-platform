import axios from 'axios';
import { createError } from './error.js';
import logger from './logger.js';

class DeepSeekAPI {
  constructor() {
    this.baseURL = process.env.DEEPSEEK_API_URL;
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async generate(params) {
    try {
      const response = await this.client.post('/v1/chat/completions', {
        model: params.model || 'deepseek-r1',
        messages: [
          { role: 'system', content: '你是一位专业的教育AI助手' },
          { role: 'user', content: params.prompt }
        ],
        temperature: params.temperature || 0.7,
        max_tokens: params.max_tokens || 2000
      });

      return response.data;
    } catch (error) {
      logger.error('DeepSeek API调用失败:', error);
      throw createError(500, 'AI服务暂时不可用');
    }
  }

  async streamGenerate(params, onData) {
    try {
      const response = await this.client.post('/v1/chat/completions', {
        ...params,
        stream: true
      }, {
        responseType: 'stream'
      });

      for await (const chunk of response.data) {
        const data = JSON.parse(chunk.toString());
        if (data.choices?.[0]?.delta?.content) {
          onData(data.choices[0].delta.content);
        }
      }
    } catch (error) {
      logger.error('DeepSeek流式调用失败:', error);
      throw createError(500, 'AI流式服务异常');
    }
  }

  async embeddings(text) {
    try {
      const response = await this.client.post('/v1/embeddings', {
        model: 'deepseek-embedding',
        input: text
      });

      return response.data.data[0].embedding;
    } catch (error) {
      logger.error('DeepSeek向量计算失败:', error);
      throw createError(500, '向量服务异常');
    }
  }
}

export default new DeepSeekAPI();
