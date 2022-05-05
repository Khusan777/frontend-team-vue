import { h } from 'vue';
import { BarChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const BarLineChart = props => {
  return h(BarChart, { ...props });
};
BarLineChart.props = {
  chartData: {
    type: Object,
    default: () => ({}),
  },
};
export default BarLineChart;
