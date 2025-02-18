<template>
  <div class="work-submit-form">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <!-- 基本信息 -->
      <el-form-item label="作品标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入作品标题" />
      </el-form-item>

      <el-form-item label="作品描述" prop="description">
        <el-input 
          v-model="formData.description" 
          type="textarea" 
          rows="4"
          placeholder="请描述您的作品..."
        />
      </el-form-item>

      <!-- 作品内容上传 -->
      <el-form-item label="作品内容" prop="content">
        <el-tabs v-model="contentType">
          <el-tab-pane label="文字" name="text">
            <el-input 
              v-model="formData.content.text" 
              type="textarea" 
              rows="6"
            />
          </el-tab-pane>
          
          <el-tab-pane label="图片" name="image">
            <el-upload
              class="upload-demo"
              action="/api/upload"
              :before-upload="handleBeforeUpload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              multiple
            >
              <el-button type="primary">选择图片</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  支持jpg/png文件，每张不超过10MB
                </div>
              </template>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="视频" name="video">
            <el-upload
              class="upload-video"
              action="/api/upload/video"
              :before-upload="handleBeforeUpload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
            >
              <el-button type="primary">上传视频</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  支持mp4格式，不超过100MB
                </div>
              </template>
            </el-upload>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>

      <!-- AI工具使用记录 -->
      <el-form-item label="AI工具">
        <div class="ai-tools">
          <el-tag 
            v-for="tool in formData.aiTools" 
            :key="tool.name"
            closable
            @close="removeAITool(tool)"
          >
            {{ tool.name }}
          </el-tag>
          <el-button 
            size="small" 
            @click="showAIToolDialog"
          >
            添加AI工具
          </el-button>
        </div>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交作品</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- AI工具选择对话框 -->
    <el-dialog
      v-model="aiToolDialogVisible"
      title="添加AI工具"
      width="500px"
    >
      <el-form :model="aiToolForm">
        <el-form-item label="工具名称">
          <el-select v-model="aiToolForm.name">
            <el-option 
              v-for="tool in aiToolOptions" 
              :key="tool.value"
              :label="tool.label"
              :value="tool.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="使用说明">
          <el-input 
            v-model="aiToolForm.usage"
            type="textarea"
            placeholder="请描述如何使用该AI工具..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="aiToolDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addAITool">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  activityId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['submit', 'cancel']);

// 表单数据
const formData = reactive({
  title: '',
  description: '',
  content: {
    type: 'text',
    text: '',
    files: []
  },
  aiTools: []
});

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入作品标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在2-50个字符之间', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入作品描述', trigger: 'blur' }
  ]
};

// ... 其他方法实现 ...
</script>

<style scoped>
.work-submit-form {
  padding: 20px;
}

.ai-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.upload-demo, .upload-video {
  text-align: center;
  padding: 20px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}

.el-upload__tip {
  font-size: 12px;
  color: #606266;
  margin-top: 10px;
}
</style>
