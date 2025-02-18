import { ref, computed, onMounted, watch } from 'vue';
import { useLearningStore } from '@/store/learning';
import { useAIStore } from '@/store/ai';
import { ElMessage } from 'element-plus';
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue';

export default {
  name: 'ChallengeContent',
  
  props: {
    level: {
      type: Number,
      required: true
    },
    subject: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const learningStore = useLearningStore();
    const aiStore = useAIStore();
    
    const questions = ref([]);
    const currentIndex = ref(0);
    const answers = ref([]);
    const questionStatus = ref({});
    const showExplanation = ref({});
    const timer = ref(null);
    const remainingTime = ref(3600); // 1小时

    // 计算属性
    const timePercentage = computed(() => {
      return Math.round((remainingTime.value / 3600) * 100);
    });

    const currentScore = computed(() => {
      return Object.values(questionStatus.value)
        .filter(status => status === 'correct')
        .length * 5;
    });

    const totalScore = computed(() => questions.value.length * 5);

    const canSubmit = computed(() => {
      return Object.keys(questionStatus.value).length === questions.value.length;
    });

    // 方法
    async function loadQuestions() {
      try {
        const response = await learningStore.getChallengeQuestions({
          level: props.level,
          subject: props.subject
        });
        questions.value = response;
      } catch (error) {
        ElMessage.error('加载题目失败');
        console.error(error);
      }
    }

    async function checkAnswer(index) {
      const question = questions.value[index];
      const answer = answers.value[index];

      if (!answer) return;

      try {
        const result = await aiStore.evaluateAnswer({
          question,
          answer,
          subject: props.subject
        });

        questionStatus.value[index] = result.correct ? 'correct' : 'wrong';
        
        if (!result.correct) {
          showExplanation.value[index] = true;
        }

      } catch (error) {
        ElMessage.error('评估答案失败');
        console.error(error);
      }
    }

    function nextQuestion() {
      if (currentIndex.value < questions.value.length - 1) {
        currentIndex.value++;
      }
    }

    function previousQuestion() {
      if (currentIndex.value > 0) {
        currentIndex.value--;
      }
    }

    async function showHint(index) {
      try {
        const hint = await aiStore.getAnswerHint({
          question: questions.value[index],
          subject: props.subject
        });
        ElMessage({
          message: hint,
          type: 'info',
          duration: 0,
          showClose: true
        });
      } catch (error) {
        ElMessage.error('获取提示失败');
        console.error(error);
      }
    }

    async function submitChallenge() {
      if (!canSubmit.value) {
        ElMessage.warning('请完成所有题目');
        return;
      }

      try {
        const result = {
          level: props.level,
          subject: props.subject,
          score: currentScore.value,
          timeSpent: 3600 - remainingTime.value,
          answers: answers.value,
          status: questionStatus.value
        };

        await learningStore.submitChallenge(result);
        emit('complete', result);
        ElMessage.success('闯关成功！');
      } catch (error) {
        ElMessage.error('提交失败');
        console.error(error);
      }
    }

    // 生命周期钩子
    onMounted(async () => {
      await loadQuestions();
      timer.value = setInterval(() => {
        if (remainingTime.value > 0) {
          remainingTime.value--;
        } else {
          clearInterval(timer.value);
          submitChallenge();
        }
      }, 1000);
    });

    watch(() => props.level, loadQuestions);

    return {
      questions,
      currentIndex,
      answers,
      questionStatus,
      showExplanation,
      remainingTime,
      timePercentage,
      currentScore,
      totalScore,
      canSubmit,
      nextQuestion,
      previousQuestion,
      checkAnswer,
      showHint,
      submitChallenge
    };
  }
};
