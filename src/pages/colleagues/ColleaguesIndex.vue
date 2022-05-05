<template>
  <Header></Header>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="col-span-1 md:col-span-3">
      <colleagues-filters></colleagues-filters>
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4">
        <at-panel v-for="i in 12" :key="i">
          <at-skeleton type="image" class="mb-3"></at-skeleton>
          <at-skeleton type="row" class="mb-3"></at-skeleton>
          <at-skeleton type="row"></at-skeleton>
        </at-panel>
      </div>
      <colleagues-list v-else :colleagues="colleagues.data"></colleagues-list>
      <at-pagination
        v-if="colleagues.meta?.last_page > 1"
        class="py-4 md:col-span-1"
        v-model="query.page"
        :total="colleagues.meta?.last_page"
      ></at-pagination>
    </div>
    <div class="col-span-1 md:col-span-1">
      <colleagues-birth-day v-if="!birthdayLoading" :birth-days="birthDays.data"></colleagues-birth-day>
      <skeleton-card v-else :count="5" type="list"></skeleton-card>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, watch, defineAsyncComponent, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import useRouterReplace from '~/utils/hooks/useRouterReplace';
  import { getAllColleagues, getColleaguesBirthDay } from '~/services/colleagues.api';
  import { deepCopy } from '~/plugins/aliftech-ui/utils';
  import Header from '~/components/app/Header';
  import ColleaguesFilters from '~/components/colleagues/ColleaguesFilters';
  import ColleaguesList from '~/components/colleagues/ColleaguesList';
  import ColleaguesBirthDay from '~/components/colleagues/ColleaguesBirthDay';
  import SkeletonCard from '~/components/skeleton/Skeleton';

  export default {
    name: 'ColleaguesIndex',
    components: {
      AtPagination: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPagination/AtPagination')),
      AtSkeleton: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton')),
      AtPanel: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanel/AtPanel')),
      Header,
      SkeletonCard,
      ColleaguesBirthDay,
      ColleaguesFilters,
      ColleaguesList,
    },
    setup() {
      const route = useRoute();
      const routerReplace = useRouterReplace();
      const colleagues = ref({});
      const birthDays = ref([]);
      const loading = ref(false);
      const birthdayLoading = ref(false);
      const query = ref({
        search: route.query.search || '',
        position_id: route.query.position_id || '',
        department_id: route.query.department_id || '',
        team_id: route.query.team_id || '',
        page: route.query.page || '',
        per_page: 12,
        status: route.query.status || 0,
      });

      const getColleagues = () => {
        loading.value = true;
        window.scrollTo(0, 0);
        getAllColleagues(query.value)
          .then(response => {
            colleagues.value = response.data;
          })
          .finally(() => (loading.value = false));
      };

      const getBirthDays = () => {
        birthdayLoading.value = true;
        getColleaguesBirthDay()
          .then(response => {
            birthDays.value = response.data;
          })
          .finally(() => (birthdayLoading.value = false));
      };

      onMounted(() => {
        getColleagues();
        getBirthDays();
      });

      watchEffect(() => {
        routerReplace.setRouter(query);
      });

      watch(
        () => route.query,
        /**
         * Fetch the user information when query change
         * @param {Object} newQueryValue - Query object
         */
        newQueryValue => {
          query.value = deepCopy(newQueryValue);
          getColleagues();
        }
      );

      return {
        colleagues,
        birthDays,
        loading,
        birthdayLoading,
        query,
      };
    },
  };
</script>
