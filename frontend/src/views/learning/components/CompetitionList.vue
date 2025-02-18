<template>
  <div class="competition-list">
    <div class="filter-bar">
      <el-select v-model="filters.type" placeholder="竞赛类型">
        <el-option
          v-for="type in competitionTypes"
          :key="type.value"
          :label="type.label"
          :value="type.value"
        />
      </el-select>
      <el-select v-model="filters.status" placeholder="竞赛状态">
        <el-option
          v-for="status in competitionStatus"
          :key="status.value"
          :label="status.label"
          :value="status.value"
        />
      </el-select>
      <el-button type="primary" @click="refreshList">筛选</el-button>
    </div>

    <el-table 
      :data="competitions"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="竞赛名称">
        <template #default="{ row }">
          <div class="competition-info">
            <el-image
              :src="row.coverUrl"
              :alt="row.name"
              class="competition-cover"
            />
            <div class="competition-detail">
              <h3>{{ row.name }}</h3>
              <p>{{ row.description }}</p>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="竞赛时间" width="200">
        <template #default="{ row }">
          <div>开始：{{ formatTime(row.startDate) }}</div>
          <div>结束：{{ formatTime(row.endDate) }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="participantsCount" label="参与人数" width="100" />

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button 
            :type="row.isEnrolled ? 'success' : 'primary'"
            :disabled="!canEnroll(row)"
            @click="handleEnroll(row)"
          >
            {{ row.isEnrolled ? '已报名' : '报名' }}
          </el-button>
          <el-button @click="viewDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
// ... script implementation will follow in the next message ...
</script>

<style scoped>
.competition-list {
  padding: 20px;
}

.filter-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.competition-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.competition-cover {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.competition-detail h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.competition-detail p {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
