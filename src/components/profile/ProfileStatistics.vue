<script setup>
  import { defineAsyncComponent, defineProps, ref, watch } from 'vue';
  import { getRatingChartData, getRatings } from '~/services/employees.api';
  import Chart from '~/components/chart/Chart';
  import AtAlert from '~/plugins/aliftech-ui/components/AtAlert/AtAlert';

  const props = defineProps({
    userId: String,
    manager: Boolean,
  });

  const chartData = ref({});
  const productivity = ref({});
  const extramail = ref({});
  const availability = ref({});
  const positive = ref({});
  const labels = ref([]);

  const fillData = () => {
    chartData.value = {
      lineData: {
        labels: labels.value,
        datasets: [
          {
            label: 'Продуктивность',
            borderColor: '#01BA59',
            pointBackgroundColor: 'white',
            lineTension: 0,
            backgroundColor: 'rgb(1, 186, 89, 0.2)',
            data: productivity.value,
          },
          {
            label: 'Доступность',
            borderColor: '#00B8FF',
            pointBackgroundColor: 'white',
            backgroundColor: 'rgb(0, 184, 255, 0.2)',
            data: availability.value,
            lineTension: 0,
          },
          {
            label: 'Позитив',
            borderColor: '#EE0F37',
            pointBackgroundColor: 'white',
            backgroundColor: 'rgb(238, 15, 55, 0.2)',
            data: positive.value,
            lineTension: 0,
          },
          {
            label: 'Экстрамайл',
            borderColor: '#6f2ce9',
            pointBackgroundColor: 'white',
            backgroundColor: 'rgb(115,41,231,0.2)',
            data: extramail.value,
            lineTension: 0,
          },
        ],
      },
    };
  };

  const ratings = ref([]);
  const ratingsQuery = ref({
    page: 1,
    per_page: 10,
  });

  const getRatingsData = () => {
    getRatings(props.userId, ratingsQuery.value).then(res => (ratings.value = res.data));
  };

  getRatingsData();

  watch(ratingsQuery.value, () => getRatingsData());

  const getChartData = () => {
    getRatingChartData(props.userId)
      .then(res => {
        availability.value = res.data.availability;
        productivity.value = res.data.productivity;
        extramail.value = res.data.extramile;
        positive.value = res.data.positive;
      })
      .finally(() => fillData());
  };
  getChartData();

  const AtPanel = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanel/AtPanel'));
  const AtPagination = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPagination/AtPagination'));
</script>

<template>
  <div class="grid grid-cols-3 gap-3 mb-4 mt-4">
    <div class="lg:col-span-2 col-span-3">
      <AtPanel :title="props.manager ? 'Продуктивность за неделю' : 'Моя продуктивность за неделю'" border-header>
        <Chart :styles="{ height: '23.5rem' }" :chart-data="chartData.lineData"></Chart>
      </AtPanel>
    </div>
    <div class="lg:col-span-1 col-span-3">
      <AtPanel class="my-0" title="История оценок" border-header>
        <div class="divide-y divide-gray-200 -mx-6 -mt-2 -mb-3">
          <div
            class="max-h-80 overflow-y-auto"
            :class="ratings.last_page > 1 ? 'max-h-80' : 'max-h-96 mb-3'"
            v-if="ratings.data?.length"
          >
            <div class="pb-3 px-6" v-for="item in ratings.data" :key="item.id">
              <p class="text-lg">{{ item.comment }}</p>
              <span
                :class="`text-${
                  item.rating_criteria.id === 1
                    ? 'green'
                    : item.rating_criteria.id === 2
                    ? 'indigo'
                    : item.rating_criteria.id === 3
                    ? 'blue'
                    : 'red'
                }-600 mr-1`"
              >
                {{ item.rating_criteria.name }}
              </span>
              &middot;<span class="text-gray-500 ml-2 mr-1">{{ item.score }} балл</span> &middot;
              <span class="text-gray-500 ml-1">
                {{ $filters.readableDate(item.created_at) }}
              </span>
            </div>
          </div>
          <div v-else>
            <div class="rounded px-4 -my-2">
              <at-alert>Нет данных</at-alert>
            </div>
          </div>
        </div>
        <template v-if="ratings.last_page > 1" #footer>
          <div class="text-right">
            <at-pagination v-model="ratingsQuery.page" :total="ratings.last_page"></at-pagination>
          </div>
        </template>
      </AtPanel>
    </div>
  </div>
</template>
