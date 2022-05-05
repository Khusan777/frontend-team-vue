<script setup>
  import { defineAsyncComponent, ref } from 'vue';
  import { getOptionsChartData, getOptionsData, getOptionsTotalData } from '~/services/profile.api';
  import Chart from '~/components/chart/Chart';
  import { XCircleIcon, CheckCircleIcon } from '@heroicons/vue/solid';

  const chartData = ref({});
  const stocks = ref({});
  const options = ref({});
  const labels = ref([]);
  const loading = ref(false);

  const optionsHead = [
    { title: 'КОЛ-ВО' },
    { title: 'ЦЕНА ПО ИЗНАЧАЛЬНОЙ ЦЕНЕ' },
    { title: 'ЦЕНА ПО АКТУАЛЬНОЙ ЦЕНЕ' },
    { title: 'ДАТА НАЧИСЛЕНИЯ' },
    { title: 'ДАТА КРИСТАЛИЗАЦИИ' },
    { title: 'АКЦИЯ' },
  ];

  const fillData = () => {
    chartData.value = {
      lineData: {
        labels: labels.value,
        datasets: [
          {
            label: 'Опционы',
            borderColor: '#01BA59',
            pointBackgroundColor: 'white',
            lineTension: 0,
            backgroundColor: 'rgb(1, 186, 89, 0.2)',
            data: options.value,
          },
          {
            label: 'Акции',
            borderColor: '#00B8FF',
            pointBackgroundColor: 'white',
            backgroundColor: 'rgb(0, 184, 255, 0.2)',
            data: stocks.value,
            lineTension: 0,
          },
        ],
      },
    };
  };

  const optionsData = ref([]);
  const optionsTotalData = ref({});

  const getOptions = () => {
    loading.value = true;
    getOptionsData()
      .then(res => (optionsData.value = res.data.options))
      .finally(() => {
        loading.value = false;
      });
  };

  getOptions();

  const getChartData = () => {
    getOptionsChartData()
      .then(res => {
        stocks.value = res.data?.stocks;
        options.value = res.data?.options;
      })
      .finally(() => fillData());
  };

  getChartData();

  getOptionsTotalData()
    .then(res => (optionsTotalData.value = res.data.total_data))
    .finally(() => {
      loading.value = false;
    });

  const AtPanel = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanel/AtPanel'));
  const AtStats = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtStats/AtStats'));
  const AtAlert = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtAlert/AtAlert'));
  const AtTable = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTable/AtTable'));
  const AtPanelTitle = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanelTitle/AtPanelTitle'));
  const AtPanelSubtitle = defineAsyncComponent(() =>
    import('~/plugins/aliftech-ui/components/AtPanelSubTitle/AtPanelSubTitle')
  );
  const AtTableItem = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTableItem/AtTableItem'));
  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));
  const StatsSkeleton = defineAsyncComponent(() => import('~/components/skeleton/StatsSkeleton'));
</script>

<template>
  <div class="grid grid-cols-5 gap-4 pb-4 mt-6">
    <div class="md:col-span-3 col-span-5">
      <AtPanel title="Статистика опционов и акции" border-header>
        <Chart :styles="{ height: '19rem' }" :chart-data="chartData.lineData"></Chart>
      </AtPanel>
    </div>
    <div class="md:col-span-2 col-span-5 mb-2 mt-6 md:mt-0">
      <div v-if="loading">
        <div v-for="i in 4" :key="i">
          <stats-skeleton class="mb-1"></stats-skeleton>
        </div>
      </div>
      <div v-else class="rounded-none">
        <AtPanel class="">
          <div class="divide-y divide-solid -mx-6">
            <div class="px-4 py-1">
              <AtPanelTitle>{{ optionsTotalData.share_price_accrued + '$' }}</AtPanelTitle>
              <AtPanelSubtitle class="text-gray-500 pb-4">Изначальная цена опциона</AtPanelSubtitle>
            </div>
            <div class="px-4 py-2">
              <AtPanelTitle>{{ parseFloat(optionsTotalData.share_price_current).toFixed(2) + '$' }}</AtPanelTitle>
              <AtPanelSubtitle class="text-gray-500 pb-4">Актуальная цена опциона</AtPanelSubtitle>
            </div>
            <div class="px-4 py-2">
              <AtPanelTitle>{{ parseFloat(optionsTotalData.total_amount_of_options).toFixed(2) }}</AtPanelTitle>
              <AtPanelSubtitle class="text-gray-500 pb-4">Общее количество опциона</AtPanelSubtitle>
            </div>
            <div class="px-4 py-2">
              <AtPanelTitle>{{ parseFloat(optionsTotalData.total_amount_of_stocks).toFixed(2) }}</AtPanelTitle>
              <AtPanelSubtitle class="text-gray-500 pb-4">Общее количество акций</AtPanelSubtitle>
            </div>
          </div>
        </AtPanel>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-4 gap-4" v-if="loading">
    <div v-for="i in 4" :key="i" class="md:col-span-2 col-span-4">
      <stats-skeleton class="mb-1"></stats-skeleton>
    </div>
  </div>
  <div v-else class="grid grid-cols-4 gap-4 pb-4 font-medium text-black">
    <AtStats
      title="Сумма опционов по изначальной цене"
      class="md:col-span-2 col-span-4 font-medium text-black"
      :value="parseFloat(optionsTotalData.total_summa_of_options_at_accrued_price).toFixed(2) + '$'"
    >
    </AtStats>
    <AtStats
      title="Сумма опционов по актуальной цене"
      class="md:col-span-2 col-span-4 font-medium text-black"
      :value="parseFloat(optionsTotalData.total_summa_of_options_at_current_price).toFixed(2) + '$'"
    >
    </AtStats>
    <AtStats
      title="Сумма акций по изначальной цене"
      class="md:col-span-2 col-span-4 font-medium text-black"
      :value="parseFloat(optionsTotalData.total_summa_of_stocks_at_accrued_price).toFixed(2) + '$'"
    >
    </AtStats>
    <AtStats
      title="Сумма акций по актуальной цене"
      class="md:col-span-2 col-span-4 font-medium text-black"
      :value="parseFloat(optionsTotalData.total_summa_of_stocks_at_current_price).toFixed(2) + '$'"
    >
    </AtStats>
  </div>
  <div class="pb-4 mt-4">
    <at-panel>
      <at-panel-title class="mb-4">
        Опционы и акции <span class="text-gray-400 text-base">(Все цены указаны приблизительно)</span>
      </at-panel-title>
      <div class="-mb-2" v-if="loading">
        <div v-for="i in 10" :key="i">
          <at-skeleton class="mb-2"></at-skeleton>
        </div>
      </div>
      <div v-else-if="!optionsData?.length">
        <at-alert>Нет данных</at-alert>
      </div>
      <div v-else>
        <at-table class="-mr-6 -ml-6 -mb-6" style="max-height: 26rem" :head="optionsHead" :elements="optionsData">
          <template #element="{ element }">
            <at-table-item>{{ element.amount }}</at-table-item>
            <at-table-item> {{ element.summa_at_current_price }}$ </at-table-item>
            <at-table-item> {{ parseFloat(element.summa_at_accrued_price).toFixed(2) }}$ </at-table-item>
            <at-table-item>{{ $filters.readableMonth(element.accrual_date) }}</at-table-item>
            <at-table-item>{{ $filters.readableMonth(element.crystallization_date) }}</at-table-item>
            <div v-if="element.status === 'crystallized'">
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
    </at-panel>
  </div>
</template>
