<script>
  export default {
    beforeRouteEnter(to, from, next) {
      if (!to.query.tab) return next({ path: to.path, query: { tab: 'home' } });
      next();
    },
  };
</script>

<script setup>
  import { reactive, defineAsyncComponent, computed } from 'vue';
  import { employeeAdditionalDayOffs, getEmployeeById } from '~/services/employees.api';
  import { parseErrorsFromResponse } from '~/utils/parsers';
  import { useRoute } from 'vue-router';
  import { useStore } from 'vuex';

  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));
  const ProfileHome = defineAsyncComponent(() => import('~/components/profile/ProfileHome'));
  const ProfileInfo = defineAsyncComponent(() => import('~/components/profile/ProfileInfo'));
  const AtTabs = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTabs/AtTabs'));
  const ProfileOutbotData = defineAsyncComponent(() => import('~/components/profile/ProfileOutbotData'));
  const ProfileColleaguesData = defineAsyncComponent(() => import('~/components/profile/ProfileColleaguesData'));
  const StockStatistics = defineAsyncComponent(() => import('~/components/profile/StockStatistics'));
  const ProfileFeedbacks = defineAsyncComponent(() => import('~/components/profile/ProfileFeedbacks'));
  const OutBotSettings = defineAsyncComponent(() => import('~/components/profile/OutBotSettings'));
  const route = useRoute();
  const store = useStore();
  let employeeId = route.query?.employee_id;
  window.scrollTo(0, 0);
  const userProfile = reactive({
    data: null,
    loading: false,
    error: '',
  });

  const additionalDayOffs = reactive({
    data: undefined,
    loading: true,
    error: [],
  });

  employeeAdditionalDayOffs()
    .then(response => (additionalDayOffs.data = response.data))
    .catch(err => (additionalDayOffs.error = parseErrorsFromResponse(err)))
    .finally(() => (additionalDayOffs.loading = false));

  const getTeamEmployee = () => {
    userProfile.loading = true;
    (!employeeId ? store.dispatch('core/getEmployeeData') : getEmployeeById(employeeId))
      .then(response => {
        userProfile.data = employeeId ? response?.data : store.getters['core/getEmployeeData'].data?.employee;
      })
      .catch(err => (userProfile.error = parseErrorsFromResponse(err)))
      .finally(() => (userProfile.loading = false));
  };

  getTeamEmployee();

  const tabComponents = computed(() => ({
    home: {
      component: ProfileHome,
      props: {
        loading: userProfile.data?.loading,
        goals: userProfile.data?.goals,
        userId: userProfile.data?.id,
        manager: !!employeeId,
        additionalDayOffs: additionalDayOffs.data,
      },
    },
    data: {
      component: ProfileColleaguesData,
      props: {
        colleagueData: userProfile.data,
        loading: userProfile.loading,
        additionalDayOffs: additionalDayOffs.data,
        additionalDayOffsLoading: additionalDayOffs.loading,
      },
    },
    outbot: {
      component: ProfileOutbotData,
      props: {
        userId:userProfile.data?.id,
        userData: userProfile.data,
        loading: userProfile.loading,
      },
    },
    options: {
      component: StockStatistics,
      props: {},
    },
    feedbacks: {
      component: ProfileFeedbacks,
      props: {},
    },
    settings: {
      props: {
        userId: userProfile.data?.id,
      },
      component: OutBotSettings,
    },
  }));
</script>

<template>
  <div v-if="userProfile.loading">
    <div class="flex flex-row md:flex-row justify-start">
      <at-skeleton
        class="-mt-16 h-48 w-48 md:ml-0 mx-auto object-cover border-8 border-gray-50 rounded block"
        type="image"
      ></at-skeleton>
      <div class="w-1/2 ml-4">
        <at-skeleton class="mb-2 h-8" type="row"></at-skeleton>
        <at-skeleton type="row"></at-skeleton>
      </div>
      <div class="flex md:flex-row justify-end flex-grow flex-col mt-6">
        <at-skeleton class="md:mr-2 mr-0 mb-1" type="button"></at-skeleton>
        <at-skeleton type="button"></at-skeleton>
      </div>
    </div>
    <div class="w-full">
      <at-skeleton type="image"></at-skeleton>
    </div>
  </div>
  <template v-else>
    <profile-info :manager="!!employeeId" :user="userProfile.data"></profile-info>
    <div class="mt-6">
      <AtTabs
        :items="[
          { title: 'Главное', value: 'home', icon: 'home', exact: true },
          { title: 'Данные', value: 'data', icon: 'clipboardList' },
          { title: 'OutBot', value: 'outbot', icon: 'externalLink' },
          { title: 'Опционы', value: 'options', icon: 'currencyDollar' },
          { title: 'Фидбеки', value: 'feedbacks', icon: 'chatAlt' },
          { title: 'Настройки', value: 'settings', icon: 'cog' },
        ]"
        :model-value="$route.query.tab"
        @update:model-value="$router.push({ path: $route.path, query: { tab: $event } })"
      />
      <keep-alive>
        <component
          :is="tabComponents[route.query.tab]?.component || tabComponents.home.component"
          v-bind="tabComponents[route.query.tab]?.props || tabComponents.home.props"
        ></component>
      </keep-alive>
    </div>
  </template>
</template>
