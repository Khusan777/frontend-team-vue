<!--<script setup>-->
<!--  import { defineAsyncComponent, defineProps, ref } from 'vue';-->
<!--  import { ClockIcon, ClipboardCheckIcon, ChartBarIcon, EmojiHappyIcon } from '@heroicons/vue/solid';-->
<!--  //import { setScore } from '~/services/employees.api';-->
<!--  import { useStore } from 'vuex';-->
<!--  import { StarIcon } from '@heroicons/vue/solid';-->
<!--  const store = useStore();-->
<!--  const ratingsCriteries = store.state.core.globals.rating_criteria.map(item => {-->
<!--    return {-->
<!--      title: item.name_ru,-->
<!--      value: item.id,-->
<!--    };-->
<!--  });-->

<!--  const props = defineProps({-->
<!--    employee: Object,-->
<!--    fullButton: Boolean,-->
<!--  });-->

<!--  const modal = ref(false);-->

<!--  const employeeScore = ref({-->
<!--    employee_id: props.employee?.employee_id || props.employee.id,-->
<!--    criteria_id: null,-->
<!--    score: null,-->
<!--    comment: null,-->
<!--  });-->

<!--  const scores = [-->
<!--    { title: 1, value: 1 },-->
<!--    { title: 2, value: 2 },-->
<!--    { title: 3, value: 3 },-->
<!--    { title: 4, value: 4 },-->
<!--    { title: 5, value: 5 },-->
<!--    { title: 6, value: 6 },-->
<!--    { title: 7, value: 7 },-->
<!--    { title: 8, value: 8 },-->
<!--    { title: 9, value: 9 },-->
<!--    { title: 10, value: 10 },-->
<!--  ];-->

<!--  // const setScoreToEmployee = () => {-->
<!--  //   setScore(employeeScore.value)-->
<!--  //     .then(() => {})-->
<!--  //     .finally(() => {-->
<!--  //       modal.value = false;-->
<!--  //     });-->
<!--  // };-->

<!--  const AtModal = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtModal/AtModal'));-->
<!--  const AtSelect = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSelect/AtSelect'));-->
<!--  const AtTextarea = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTextarea/AtTextarea'));-->
<!--  const AtBadge = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtBadge/AtBadge'));-->
<!--  const AtButton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtButton/AtButton'));-->
<!--</script>-->

<!--<template>-->
<!--  <div>-->
<!--    <AtButton v-if="props.fullButton" @click="modal = true" color="primary" icon="star" :block="true">-->
<!--      Оценить сотрудника-->
<!--    </AtButton>-->
<!--    <AtButton v-else title="Оценить" @click="modal = true" color="success">-->
<!--      <StarIcon class="w-5 h-5"></StarIcon>-->
<!--    </AtButton>-->
<!--    <at-modal size="2xl" v-model="modal" :title="employee.name">-->
<!--      <div>-->
<!--        <div v-if="!props.fullButton" class="flex justify-between mt-4">-->
<!--          <at-badge color="green">В офисе</at-badge>-->
<!--          <span class="flex mr-1 text-nowrap">-->
<!--            <ClockIcon class="w-5 h-5 text-gray-300 mr-1"></ClockIcon>Экстрамайл - -->
<!--            {{ props.employee.ratings[0].score }}</span-->
<!--          >-->
<!--          <span class="flex mr-1 text-nowrap">-->
<!--            <ClipboardCheckIcon class="w-5 h-5 text-gray-300 mr-1"></ClipboardCheckIcon>Продуктивность - -->
<!--            {{ props.employee.ratings[1].score }}-->
<!--          </span>-->
<!--          <span class="flex mr-1 text-nowrap">-->
<!--            <ChartBarIcon class="w-5 h-5 text-gray-300 mr-1"></ChartBarIcon>Доступность - -->
<!--            {{ props.employee.ratings[2].score }}</span-->
<!--          >-->
<!--          <span class="flex mr-1 text-nowrap">-->
<!--            <EmojiHappyIcon class="w-5 h-5 text-gray-300 mr-1"></EmojiHappyIcon>Позитив - -->
<!--            {{ props.employee.ratings[3].score }}</span-->
<!--          >-->
<!--        </div>-->
<!--        <div class="grid grid-cols-2 gap-4 mt-4 mb-5">-->
<!--          <at-select-->
<!--            :options="ratingsCriteries"-->
<!--            v-model="employeeScore.criteria_id"-->
<!--            placeholder="Выберите кретерию"-->
<!--            label="Критерий оценки"-->
<!--          ></at-select>-->
<!--          <at-select-->
<!--            :options="scores"-->
<!--            v-model="employeeScore.score"-->
<!--            placeholder="Выберите оценку"-->
<!--            label="Оценки"-->
<!--          ></at-select>-->
<!--        </div>-->
<!--        <div>-->
<!--          <at-textarea v-model="employeeScore.comment" label="Комментарий"></at-textarea>-->
<!--        </div>-->
<!--        <div class="flex space-x-3 mt-4">-->
<!--          <AtButton class="w-full p-4" @click="modal = false">Отмена</AtButton>-->
<!--          <AtButton-->
<!--            v-if="!props.fullButton"-->
<!--            class="w-full p-4"-->
<!--            :to="{ name: 'employeeProfile', query: { employee_id: props.employee.employee_id } }"-->
<!--            @click="modal = false"-->
<!--          >-->
<!--            Перейти в профиль-->
<!--          </AtButton>-->
<!--          <AtButton-->
<!--            class="w-full p-4"-->
<!--            @click="setScoreToEmployee"-->
<!--            :disabled="!employeeScore.criteria_id || !employeeScore.comment || !employeeScore.score"-->
<!--            color="primary"-->
<!--          >-->
<!--            Сохранить-->
<!--          </AtButton>-->
<!--        </div>-->
<!--      </div>-->
<!--    </at-modal>-->
<!--  </div>-->
<!--</template>-->
