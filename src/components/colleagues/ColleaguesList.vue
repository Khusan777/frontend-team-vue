<template>
  <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 mb-2">
    <router-link
      v-for="colleague of colleagues"
      :key="colleague.id"
      :to="{ name: 'colleagues.detail', params: { id: colleague.id } }"
    >
      <at-panel no-header-padding class="text-center h-full relative">
        <template #header>
          <img
            v-img-loader
            class="rounded-t w-full object-cover bg-gray-300 md:h-54 lg:h-64 h-64"
            :src="getUserImage(colleague)"
            @error="getUserImage(colleague, $event)"
            :alt="colleague.name"
          />
        </template>

        <div>
          <span class="font-bold">{{ colleague.name }}</span>
          <p class="text-gray-500 text-sm">
            {{ colleague.current_position?.name || 'Нет позиции' }}
          </p>
        </div>
        <at-badge class="absolute top-56 left-1" :color="colleague.status === 1 ? 'green' : 'blue'" rounded>
          {{ colleague.status === 1 ? 'В офисе' : 'Не в офисе' }}
        </at-badge>
        <at-badge v-if="colleague.status === 6" class="absolute top-56 left-1" :color="'red'" rounded>
          {{ 'Работает удалённо' }}
        </at-badge>
      </at-panel>
    </router-link>
  </div>
</template>

<script>
  import AtPanel from '~/plugins/aliftech-ui/components/AtPanel/AtPanel';
  import AtBadge from '~/plugins/aliftech-ui/components/AtBadge/AtBadge';
  import { calculateAge } from '~/utils/filters/dateFilters';
  import useUserAvatar from '~/utils/hooks/useUserAvatar';

  export default {
    name: 'ColleaguesList',
    components: { AtPanel, AtBadge },
    props: {
      colleagues: { type: Array, default: () => [] },
    },
    setup() {
      const userAvatar = useUserAvatar();

      const getDepartmentName = colleague => {
        return Array.isArray(colleague.positions) && colleague.positions[0] && colleague.positions[0].department
          ? colleague.positions[0].department.name
          : 'Отсутствует';
      };

      return {
        getDepartmentName,
        getUserImage: userAvatar.getUserImage,
      };
    },
    methods: {
      calculateAge,
    },
  };
</script>

<style scoped></style>
