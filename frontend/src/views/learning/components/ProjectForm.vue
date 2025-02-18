<template>
  <div class="project-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入项目名称" />
      </el-form-item>

      <el-form-item label="项目类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择项目类型">
          <el-option
            v-for="type in projectTypes"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="项目标签">
        <el-tag
          v-for="tag in formData.tags"
          :key="tag"
          closable
          @close="removeTag(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputTagVisible"
          ref="tagInputRef"
          v-model="inputTagValue"
          class="tag-input"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else size="small" @click="showTagInput">
          + 添加标签
        </el-button>
      </el-form-item>

      <el-form-item label="项目简介" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请输入项目简介"
        />
      </el-form-item>

      <el-form-item label="项目目标">
        <div v-for="(goal, index) in formData.goals" :key="index" class="goal-item">
          <el-input v-model="formData.goals[index]">
            <template #append>
              <el-button @click="removeGoal(index)">删除</el-button>
            </template>
          </el-input>
        </div>
        <el-button type="primary" link @click="addGoal">
          添加目标
        </el-button>
      </el-form-item>

      <el-form-item label="开始时间" prop="startDate">
        <el-date-picker
          v-model="formData.startDate"
          type="date"
          placeholder="选择开始日期"
        />
      </el-form-item>

      <el-form-item label="结束时间" prop="endDate">
        <el-date-picker
          v-model="formData.endDate"
          type="date"
          placeholder="选择结束日期"
        />
      </el-form-item>

      <el-form-item label="可见性" prop="visibility">
        <el-radio-group v-model="formData.visibility">
          <el-radio label="public">公开</el-radio>
          <el-radio label="private">私有</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
// ... script implementation will follow in the next message ...
</script>

<style scoped>
.project-form {
  padding: 20px;
}

.tag-input {
  width: 100px;
  margin-left: 10px;
  vertical-align: bottom;
}

.goal-item {
  margin-bottom: 10px;
}

:deep(.el-input-group__append) {
  padding: 0;
}
</style>
