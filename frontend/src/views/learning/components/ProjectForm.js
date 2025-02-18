import { ref, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { useProjectStore } from '@/store/project';

export default {
  name: 'ProjectForm',
  
  props: {
    initialData: {
      type: Object,
      default: () => ({
        name: '',
        type: '',
        tags: [],
        description: '',
        goals: [],
        startDate: '',
        endDate: '',
        visibility: 'public'
      })
    }
  },

  setup(props, { emit }) {
    const projectStore = useProjectStore();
    const formRef = ref(null);
    const inputTagVisible = ref(false);
    const inputTagValue = ref('');
    const tagInputRef = ref(null);

    const formData = ref({ ...props.initialData });

    const projectTypes = [
      { label: '研究性学习', value: 'research' },
      { label: '创新实践', value: 'innovation' },
      { label: '学科竞赛', value: 'competition' },
      { label: '社会调查', value: 'survey' },
      { label: '科技发明', value: 'invention' }
    ];

    const rules = {
      name: [
        { required: true, message: '请输入项目名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择项目类型', trigger: 'change' }
      ],
      description: [
        { required: true, message: '请输入项目简介', trigger: 'blur' },
        { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
      ],
      startDate: [
        { required: true, message: '请选择开始日期', trigger: 'change' }
      ],
      endDate: [
        { required: true, message: '请选择结束日期', trigger: 'change' }
      ]
    };

    const showTagInput = () => {
      inputTagVisible.value = true;
      nextTick(() => {
        tagInputRef.value.focus();
      });
    };

    const handleInputConfirm = () => {
      if (inputTagValue.value) {
        if (!formData.value.tags.includes(inputTagValue.value)) {
          formData.value.tags.push(inputTagValue.value);
        }
      }
      inputTagVisible.value = false;
      inputTagValue.value = '';
    };

    const removeTag = (tag) => {
      formData.value.tags = formData.value.tags.filter(t => t !== tag);
    };

    const addGoal = () => {
      formData.value.goals.push('');
    };

    const removeGoal = (index) => {
      formData.value.goals.splice(index, 1);
    };

    const submitForm = async () => {
      if (!formRef.value) return;
      
      await formRef.value.validate(async (valid) => {
        if (valid) {
          try {
            emit('submit', formData.value);
          } catch (error) {
            console.error('提交表单失败:', error);
            ElMessage.error('提交失败，请重试');
          }
        }
      });
    };

    const resetForm = () => {
      formRef.value?.resetFields();
      formData.value = { ...props.initialData };
    };

    return {
      formRef,
      formData,
      projectTypes,
      rules,
      inputTagVisible,
      inputTagValue,
      tagInputRef,
      showTagInput,
      handleInputConfirm,
      removeTag,
      addGoal,
      removeGoal,
      submitForm,
      resetForm
    };
  }
};
