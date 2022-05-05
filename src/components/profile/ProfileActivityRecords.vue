<template>
  <div class="md:col-span-2 col-span-3">
    <div class="mt-6">
      <AtPanel title="Активность в офисе" border-header>
        <div v-if="loading" class="py-4">
          <at-skeleton type="image"></at-skeleton>
          <at-skeleton type="image"></at-skeleton>
        </div>
        <div v-else>
          <BarChart style="height: 450px" v-bind="barChartProps" />
        </div>
      </AtPanel>
    </div>
  </div>
</template>

<script>
  import { BarChart, useBarChart } from 'vue-chart-3';
  import { Chart, registerables } from 'chart.js';
  import { ref, computed, defineComponent } from 'vue';
  import AtPanel from '~/plugins/aliftech-ui/components/AtPanel/AtPanel';
  import AtSkeleton from '~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton';
  Chart.register(...registerables);

  export default defineComponent({
    name: 'ProfileActivityRecords',
    components: {
      AtSkeleton,
      BarChart,
      AtPanel,
    },
    setup() {
      const data_activity = ref([]);
      const loading = ref(false);

      const chartData = computed(() => ({
        datasets: [
          {
            label: 'Activity',
            data: data_activity.value,
            backgroundColor: ['#A7C6FD'],
          },
        ],
      }));

      const { barChartProps, barChartRef } = useBarChart({
        chartData,
      });
      return { barChartProps, barChartRef, loading, data_activity, chartData };
    },
  });
</script>
