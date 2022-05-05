<template>
  <div v-if="!appLoading" class="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
    <div v-if="!appLoading" class="col-span-1 sm:col-span-3 gap-4 grid grid-cols-4">
      <at-input placeholder="Поиск по ФИО" iconAfter="search" class="md:col-span-2 col-span-4" v-model="query.search" />
      <AtSelect
        placeholder="Выберите статус активности"
        class="md:-mt-1 md:col-span-2 col-span-4"
        :options="[
          {
            title: 'Все',
            value: 0,
          },
          {
            title: 'В офисе',
            value: 1,
          },
          {
            title: 'Не в офисе',
            value: 8,
          },
          {
            title: 'Работает удалённо',
            value: 6,
          },
        ]"
        v-model="query.status"
      ></AtSelect>
    </div>
    <at-select :options="selectOptions('Все позиции', positions)" v-model="query.position_id"> </at-select>
    <at-select
      :options="selectOptions('Все отделы', departments)"
      v-model="departmentIdQuery.department_id"
    ></at-select>
    <at-select :options="selectOptions('Все команды', teams)" v-model="query.team_id"> </at-select>
  </div>
  <div class="mt-4 py-2" v-else>
    <div class="p-4" v-for="i in 3" :key="i">
      <at-skeleton type="row"></at-skeleton>
    </div>
  </div>
</template>

<script>
  import { defineAsyncComponent, ref, computed, watch } from 'vue';
  import debounce from 'lodash.debounce';
  import { useStore } from 'vuex';
  import useRouterReplace from '~/utils/hooks/useRouterReplace';
  import { useRoute } from 'vue-router';

  export default {
    name: 'ColleaguesFilters',
    components: {
      AtSkeleton: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton')),
      AtInput: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtInput/AtInput')),
      AtSelect: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSelect/AtSelect')),
    },
    setup() {
      const store = useStore();
      const routerReplace = useRouterReplace();
      const route = useRoute();
      const query = ref({
        position_id: Number(route.query.position_id) || 0,
        team_id: Number(route.query.team_id) || 0,
        search: route.query.search || '',
        status: Number(route.query.status) || 0,
      });

      const departmentIdQuery = ref({
        department_id: Number(route.query.department_id) || 0,
      });

      const selectOptions = (defaultTitle, options) => {
        return [{ title: defaultTitle, value: '' }, ...options];
      };

      watch(
        query.value,
        debounce(() => {
          routerReplace.setRouter(query, {
            page: route.query.page,
          });
        }, 500)
      );

      watch(departmentIdQuery.value, () => {
        routerReplace.setRouter(departmentIdQuery, {
          page: route.query.page,
        });
        store.dispatch('core/getApp', departmentIdQuery.value);
      });

      return {
        query,
        departmentIdQuery,
        selectOptions,
        appLoading: computed(() => store.getters['core/appLoading']),
        positions: computed(() => store.getters['core/positions']),
        departments: computed(() => store.getters['core/departments']),
        teams: computed(() => store.getters['core/teams']),
      };
    },
  };
</script>

<style scoped></style>
