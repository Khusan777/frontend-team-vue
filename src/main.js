import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import AlifUI from '~/plugins/aliftech-ui';
import VueCookie from 'vue-cookie';
import AtToast from '~/plugins/aliftech-ui/toast';
import loaderDirectives from '~/directives/loaderDirectives';

import {
  formatDateByDayMonthYear,
  formatDistanceDate,
  readableDate,
  readableMonth,
  readableTime,
} from '~/utils/filters/dateFilters';
import { finder } from '~/utils/filters/finder';

export const app = createApp(App);

app.config.globalProperties.$filters = {
  formatDateByDayMonthYear,
  formatDistanceDate,
  readableDate,
  readableTime,
  readableMonth,
  finder,
};

app.directive('img-loader', loaderDirectives);

app.config.globalProperties.$cookie = VueCookie;
app.config.globalProperties.$toast = AtToast;

app.use(store);
app.use(router);
app.use(AlifUI);
app.use(AtToast);
app.provide('$toast', AtToast);

export const $toast = AtToast;

app.mount('#app');
