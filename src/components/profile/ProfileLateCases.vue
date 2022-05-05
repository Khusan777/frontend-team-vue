<!--<script setup>-->
<!--  import { reactive, defineAsyncComponent } from 'vue';-->
<!--  import { getEmployeeById } from '~/services/employees.api';-->
<!--  import { useRoute } from 'vue-router';-->
<!--  import { useStore } from 'vuex';-->

<!--  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));-->
<!--  const AtPanel = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanel/AtPanel'));-->
<!--  const AtCalendar = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtCalendar/AtCalendar'));-->
<!--  const AtBadges = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtBadge/AtBadge'));-->
<!--  const AtAlert = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtAlert/AtAlert'));-->

<!--  const userProfile = reactive({-->
<!--    data: null,-->
<!--    loading: true,-->
<!--    error: [],-->
<!--  });-->

<!--  const store = useStore();-->
<!--  const route = useRoute();-->
<!--  let employeeId = route.query?.employee_id;-->

<!--  const getTeamEmployee = () => {-->
<!--    userProfile.loading = true;-->
<!--    !employeeId ? store.dispatch('core/getEmployeeData') : getEmployeeById(employeeId);-->
<!--    userProfile.data = employeeId-->
<!--      ? store.getters['core/getEmployeeData'].data-->
<!--      : store.getters['core/getEmployeeData'].data?.employee;-->
<!--    userProfile.error = store.getters['core/getEmployeeData'].error;-->
<!--    userProfile.loading = store.getters['core/getEmployeeData'].loading;-->
<!--  };-->

<!--  getTeamEmployee();-->
<!--</script>-->

<!--<template>-->
<!--  <div class="md:col-span-1 col-span-3 mt-6">-->
<!--    <div class="max-h-150">-->
<!--      <AtPanel title="Опоздание" border-header>-->
<!--        <div v-if="userProfile.loading">-->
<!--          <at-skeleton type="row"></at-skeleton>-->
<!--          <div class="py-4">-->
<!--            <at-skeleton type="image"></at-skeleton>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div v-else-if="!userProfile.data?.late_cases?.length">-->
<!--          <div>-->
<!--            <AtAlert class="mb-1">У вас нет опозданий</AtAlert>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div v-else>-->
<!--          <span>-->
<!--            <at-badges rounded :large="true" class="mr-1 text-gray-900" color="blue">15-30 мин.</at-badges>-->
<!--            <at-badges rounded :large="true" class="mr-1" color="yellow">30-60 мин.</at-badges>-->
<!--            <at-badges rounded :large="true" color="red">60+ мин.</at-badges>-->
<!--          </span>-->
<!--          <at-calendar></at-calendar>-->
<!--        </div>-->
<!--      </AtPanel>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->
