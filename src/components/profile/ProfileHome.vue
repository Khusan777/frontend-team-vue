<script setup>
  import { XCircleIcon, CheckCircleIcon } from '@heroicons/vue/solid';
  import { parseDateFormat } from '~/utils/filters/dateFilters';
  import { computed, defineAsyncComponent, defineProps, reactive, ref } from 'vue';
  import { getGoals } from '~/services/employeeGoals.api';
  import { parseErrorsFromResponse } from '~/utils/parsers';
  import { parseDate } from '~/utils/filters/dateFilters';
  import { getEmployeeActivityRecords, getEmployeeActivityRecordsByParams } from '~/services/statistics.api';
  import { useBarChart, BarChart } from 'vue-chart-3';
  import { Chart, registerables } from 'chart.js';
  import { $toast } from '~/main';
  import { addWeeks } from 'date-fns';
  Chart.register(...registerables);

  const props = defineProps({
    userId: [String, Number],
    manager: Boolean,
    loading: Boolean,
    goals: {
      type: Array,
      default: () => [],
    },
    additionalDayOffs: {
      type: Object,
    },
  });

  const dateActivity = reactive({
    from: addWeeks(new Date(), -1),
    to: new Date(),
  });

  const userGoals = reactive({
    data: props.goals,
    loading: false,
    error: [],
  });

  const loading = ref(false);
  const data_activity = ref({});
  const sum_hour_activity = ref(0);
  const average_activity = ref(0);

  getEmployeeActivityRecords()
    .then(res => {
      data_activity.value = Object.keys(res.data.data).reduce((acc, c) => {
        acc[c] = Number(parseFloat(res.data.data[c] / 60).toFixed(1));
        sum_hour_activity.value += +acc[c];
        return acc;
      }, {});
      average_activity.value =
        sum_hour_activity.value / (Object.values(data_activity.value).filter(i => i > 0)?.length || 1);
    })
    .finally(() => {
      loading.value = false;
    });

  const chartData = computed(() => ({
    datasets: [
      {
        label: 'Activity',
        data: data_activity.value,
        backgroundColor: ['#A7C6FD'],
      },
    ],
  }));

  const { barChartProps } = useBarChart({
    chartData,
  });
  const barChartKey = ref(0);

  const changeDataActivity = (key, $event) => {
    dateActivity[key] = $event;
    if (dateActivity.from == null) {
      $toast.show({ title: 'Error', subTitle: 'Заполните поле DateFrom', type: 'error' });
      return false;
    }
    if (dateActivity.from > dateActivity.to) {
      $toast.show({ title: 'Error', subTitle: 'DateFrom должен быть меньше DateTo', type: 'error' });
      return false;
    } else if (dateActivity.from < dateActivity.to) {
      getEmployeeActivityRecordsByParams({
        date_from: parseDate(dateActivity.from),
        date_to: parseDate(dateActivity.to),
      })
        .then(res => {
          sum_hour_activity.value = 0;
          average_activity.value = 0;
          data_activity.value = Object.keys(res.data.data).reduce((acc, c) => {
            acc[c] = parseFloat(res.data.data[c] / 60).toFixed(1);
            sum_hour_activity.value += +acc[c];
            return acc;
          }, {});
          average_activity.value =
            sum_hour_activity.value / (Object.values(data_activity.value).filter(i => i > 0)?.length || 1);
          barChartKey.value++;
        })
        .finally(() => {
          loading.value = false;
        });
    }
  };
  if (!props.manager) {
    getGoals({ employee_id: props.userId })
      .then(response => (userGoals.data = response.data.employee_targets.reverse()))
      .catch(err => (userGoals.error = parseErrorsFromResponse(err)))
      .finally(() => (userGoals.loading = false));
  }

  const AtPanel = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanel/AtPanel'));
  const AtAlert = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtAlert/AtAlert'));
  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));
  const AtTable = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTable/AtTable'));
  const AtTableItem = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTableItem/AtTableItem'));
  const AtDatepicker = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtDatepicker/AtDatepicker'));

  const goalsHead = [{ title: 'НАЗВАНИЕ' }, { title: 'ДАТА НАЗНАЧЕНИЯ' }, { title: 'ОЖИДАЕТСЯ' }, { title: 'СТАТУС' }];
</script>

<template>
  <div class="col-span-3 mt-6" v-for="dayOffs in props.additionalDayOffs?.data" :key="dayOffs.id">
    <div v-if="parseDateFormat(dayOffs.date) > parseDateFormat(new Date())">
      <at-alert type="success">
        <h1 class="text-black font-bold">Вам назначили дополнительные выходные дни!</h1>
        <p class="text-blue-400 text-md">
          Ура! Вам назначили доп. выходные за экстрамайл!
          <router-link to="/profile?tab=data" class="underline">Подробнее тут</router-link>
        </p>
      </at-alert>
    </div>
  </div>
  <div class="grid grid-cols-3 gap-4">
    <div class="md:col-span-2 col-span-3">
      <AtPanel title="Активность в офисе" border-header>
        <div v-if="props.loading" class="py-4">
          <at-skeleton type="image"></at-skeleton>
          <at-skeleton type="image"></at-skeleton>
        </div>
        <div v-else>
          <p class="flex justify-end text-gray-900 font-bold">
            В среднем
            <span class="text-green-500 ml-1 mr-1">{{ parseFloat(average_activity).toFixed(1) }}</span> часов
          </p>
          <AtDatepicker
            label="Дата от"
            :modelValue="dateActivity.from"
            @update:modelValue="changeDataActivity('from', $event)"
          />
          <AtDatepicker
            label="Дата до"
            :modelValue="dateActivity.to"
            @update:modelValue="changeDataActivity('to', $event)"
          />
          <BarChart style="height: 450px" v-bind="barChartProps" :key="barChartKey" />
        </div>
      </AtPanel>
    </div>
    <div class="col-span-3">
      <div :class="props.manager ? 'col-span-3' : 'col-span-3'">
        <div class="mb-4" :class="props.manager ? 'col-span-3' : 'col-span-3'" v-if="userGoals.loading">
          <at-panel title="Мои таргеты" border-header>
            <div class="py-2" v-for="i in 6" :key="i">
              <at-skeleton type="row"></at-skeleton>
            </div>
          </at-panel>
        </div>
        <div v-else class="mb-4" :class="props.manager ? 'col-span-3' : 'col-span-3'">
          <AtPanel :title="props.manager ? 'Мои Таргеты' : 'Мои Таргеты'" border-header>
            <div v-if="!userGoals.data?.length">
              <AtAlert class="mb-1">Нет данных </AtAlert>
            </div>
            <div v-else>
              <at-table class="max-h-96 overflow-auto" :head="goalsHead" :elements="userGoals.data">
                <template #element="{ element }">
                  <at-table-item>{{ element.name }}</at-table-item>
                  <at-table-item>{{ element.date_from }}</at-table-item>
                  <at-table-item>{{ element.date_to }}</at-table-item>
                  <div v-if="element.is_done === 1">
                    <at-table-item>
                      <check-circle-icon class="w-6 h-6 text-green-500"></check-circle-icon>
                    </at-table-item>
                  </div>
                  <div v-else>
                    <at-table-item><x-circle-icon class="w-6 h-6 text-gray-400"></x-circle-icon></at-table-item>
                  </div>
                </template>
              </at-table>
            </div>
          </AtPanel>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
