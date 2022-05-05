<script setup>
  import { computed, defineAsyncComponent, ref, watch } from 'vue';
  import { getOutbotMessagesFromAllColleagues } from '~/services/outbot.api';
  import { readableDateTime } from '~/utils/filters/dateFilters';
  import useUserAvatar from '~/utils/hooks/useUserAvatar';
  const getUserAvatar = useUserAvatar().getUserImage;
  import { useStore } from 'vuex';
  import { isArray } from 'lodash';
  const store = useStore();
  const statuses = store.state.core.globals?.statuses;
  const messageLoading = ref(false);
  const messages = ref([]);
  const messageFilterOptions = ref([
    { value: 'late_cases,self_reason_cases,day_offs,remote_work_cases', title: 'Все' },
    { value: 'late_cases', title: 'Опоздания' },
    { value: 'self_reason_cases', title: 'Предупреждения' },
    { value: 'day_offs', title: 'Отпрашивания' },
    { value: 'remote_work_cases', title: 'Удаленно работающие' },
  ]);
  const messageQuery = ref({
    page: 1,
    filter_by: 'late_cases,self_reason_cases,day_offs,remote_work_cases',
    per_page: 15,
  });
  const page = ref('my-command');
  // const pageFilter = ref([
  //   {
  //     title: 'Моя команда',
  //     value: 'my-command',
  //   },
  //   {
  //     title: 'Активность команды',
  //     value: 'active',
  //   },
  // ]);
  const messagesTableHead = [{ title: 'ФИО' }, { title: 'Статус' }, { title: 'Причина' }, { title: 'Дата' }];

  const getMessages = () => {
    messageLoading.value = true;
    getOutbotMessagesFromAllColleagues(messageQuery.value)
      .then(res => {
        messages.value = res.data.data;
      })
      .finally(() => (messageLoading.value = false));
  };

  watch(messageQuery, () => getMessages(), { deep: true });
  // const teamTableHead = [
  //   { title: 'Имя' },
  //   { title: 'Работает' },
  //   { title: 'Экстрамайл' },
  //   { title: 'Продуктивность' },
  //   { title: 'Активность' },
  //   { title: 'Позитив' },
  //   { title: 'Последний фидбек' },
  //   { title: 'Действия' },
  // ];
  //const teamData = ref([]);
  const team_id = ref(null);
  const teamLoading = ref(false);

  // const getTeamRatingsById = teamId => {
  //   team_id.value = teamId;
  //   teamLoading.value = true;
  //   teamData.value = [];
  //   getTeamRatings({ team_id: teamId })
  //     .then(res => {
  //       teamData.value = res.data;
  //     })
  //     .finally(() => (teamLoading.value = false));
  // };
  const employeeLoading = computed(() => {
    return store.getters['core/getEmployeeData'].loading;
  });
  const employee = computed(() => {
    return store.getters['core/getEmployeeData'].data?.employee;
  });
  const getOutbotMessage = computed(() => {
    return store.getters['core/getEmployeeData'].data?.employee?.outbot_access;
  });
  watch(
    employee,
    () => {
      if (getOutbotMessage.value) {
        getMessages();
      }
    },
    { immediate: true }
  );
  //getTeamRatingsById(employee.value.teams[0].id);

  const managerTeams = computed(() => {
    if (isArray(employee.value?.manager?.teams) && employee.value?.manager?.teams.length) {
      return employee.value?.manager.teams;
    } else {
      return employee.value?.teams;
    }
  });

  const greetingsColleague = () => {
    const dateNow = new Date();
    if (dateNow.getHours() >= 5 && dateNow.getHours() < 12) {
      return 'Доброе утро';
    } else if (dateNow.getHours() >= 12 && dateNow.getHours() < 18) {
      return 'Добрый день';
    } else if (dateNow.getHours() >= 18 && dateNow.getHours() < 24) {
      return 'Добрый вечер';
    } else {
      return 'Доброй ночи';
    }
  };

  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));
  const AtPanel = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanel/AtPanel'));
  const AtBadge = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtBadge/AtBadge'));
  const AtButton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtButton/AtButton'));
  const AtStats = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtStats/AtStats'));
  const AtTabs = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTabs/AtTabs'));
  const AtTable = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTable/AtTable'));
  const AtPanelTitle = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanelTitle/AtPanelTitle'));
  const AtTableItem = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTableItem/AtTableItem'));
  const AtPagination = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPagination/AtPagination'));
  //const SetScoreModal = defineAsyncComponent(() => import('~/components/profile/SetScoreModal'));
</script>
<template>
  <div>
    <div v-if="employeeLoading" class="py-5">
      <at-skeleton type="row" class="h-10 w-8/12"></at-skeleton>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div class="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 md:w-full w-11/12">
          <at-skeleton type="row" class="mt-20 h-20 mb-4 w-full"></at-skeleton>
        </div>
        <at-skeleton type="image" class="-mt-2 2xl:h-80 xl:h-72 h-64 w-full"></at-skeleton>
        <at-skeleton type="image" class="-mt-2 2xl:h-80 xl:h-72 h-64 w-full"></at-skeleton>
        <at-skeleton type="image" class="-mt-2 2xl:h-80 xl:h-72 h-64 w-full"></at-skeleton>
        <at-skeleton type="image" class="-mt-2 2xl:h-80 xl:h-72 h-64 w-full"></at-skeleton>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        <at-skeleton type="image" class="-mt-2 2xl:h-80 xl:h-72 h-64 w-full"></at-skeleton>
        <at-skeleton type="image" class="-mt-2 2xl:h-80 xl:h-72 h-64 w-full"></at-skeleton>
        <at-skeleton type="image" class="-mt-2 2xl:h-80 xl:h-72 h-64 w-full"></at-skeleton>
        <at-skeleton type="image" class="-mt-2 2xl:h-80 xl:h-72 h-64 w-full"></at-skeleton>
      </div>
    </div>
    <div v-else class="py-5">
      <p class="text-3xl text-black font-bold mb-6">{{ greetingsColleague() }}, {{ ' ' + employee.name }}</p>
      <!--      <div class="mb-4">-->
      <!--        <at-tabs v-model="page" :items="pageFilter"></at-tabs>-->
      <!--      </div>-->
      <div v-show="page === 'active'">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4"
          v-for="team in managerTeams"
          :key="team.id"
        >
          <div class="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
            <div class="flex justify-between items-center py-4 px-6 bg-blue-500 rounded-md shadow-lg shadow-inner">
              <div>
                <h3 class="text-2xl text-white font-semibold">Команда {{ team.name }}</h3>
              </div>
              <div v-if="team_id !== team.id">
                <AtButton @click="getTeamRatingsById(team.id)" color="secondary">Показать активность </AtButton>
              </div>
            </div>
          </div>
          <div
            v-if="team_id === team.id"
            class="grid lg:grid-cols-3 md:grid-cols-2 gap-4 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4"
          >
            <AtStats title="Пропавшие" value="2 из 10" icon="users"></AtStats>
            <AtStats title="В офисе" value="5 из 10" icon="users"></AtStats>
            <AtStats class="md:col-span-2 lg:col-span-1" title="Удалённо" value="3 из 10" icon="users"></AtStats>
          </div>
          <div v-if="team_id === team.id" class="mb-4 col-span-4">
            <at-panel title="Активность за неделю">
              <div v-if="teamLoading">
                <div v-for="i in 7" :key="i">
                  <at-skeleton class="mb-3"></at-skeleton>
                </div>
              </div>
              <!--              <div v-else>-->
              <!--                <at-table-->
              <!--                  class="-mr-6 -ml-6 -mb-6 -mt-6"-->
              <!--                  :head="teamTableHead"-->
              <!--                  :elements="teamData.filter(item => item.employee_id !== employee.id)"-->
              <!--                >-->
              <!--                  <template #element="{ element }">-->
              <!--                    <at-table-item :to="{ name: 'employeeProfile', query: { employee_id: element.employee_id } }">-->
              <!--                      {{ element.employee_name }}-->
              <!--                    </at-table-item>-->
              <!--                    <at-table-item :to="{ name: 'employeeProfile', query: { employee_id: element.employee_id } }">-->
              <!--                      <at-badge :color="`${$filters.finder(statuses, element.employee_status).color}`">-->
              <!--                        {{ $filters.finder(statuses, element.employee_status).name }}-->
              <!--                      </at-badge>-->
              <!--                    </at-table-item>-->
              <!--                    <at-table-item :to="{ name: 'employeeProfile', query: { employee_id: element.employee_id } }">-->
              <!--                      +{{ element.ratings[0].score }}-->
              <!--                    </at-table-item>-->
              <!--                    <at-table-item :to="{ name: 'employeeProfile', query: { employee_id: element.employee_id } }">-->
              <!--                      +{{ element.ratings[1].score }}-->
              <!--                    </at-table-item>-->
              <!--                    <at-table-item :to="{ name: 'employeeProfile', query: { employee_id: element.employee_id } }">-->
              <!--                      +{{ element.ratings[2].score }}-->
              <!--                    </at-table-item>-->
              <!--                    <at-table-item :to="{ name: 'employeeProfile', query: { employee_id: element.employee_id } }">-->
              <!--                      +{{ element.ratings[3].score }}-->
              <!--                    </at-table-item>-->
              <!--                    <at-table-item :to="{ name: 'employeeProfile', query: { employee_id: element.employee_id } }">-->
              <!--                      <p class="text-gray-500 whitespace-nowrap">-->
              <!--                        {{ $filters.readableDate(element.ratings[0].created_at) }}-->
              <!--                      </p>-->
              <!--                      <p class="text-gray-500 whitespace-nowrap">{{ $filters.readableTime(element.created_at) }}</p>-->
              <!--                    </at-table-item>-->
              <!--                    <at-table-item>-->
              <!--                      <SetScoreModal :employee="element" />-->
              <!--                    </at-table-item>-->
              <!--                  </template>-->
              <!--                </at-table>-->
              <!--              <div v-if="!teamData.length" class="mt-10">-->
              <!--                <at-alert class="text-center">Ничего не найдено</at-alert>-->
              <!--              </div>-->
              <!--              </div>-->
            </at-panel>
          </div>
        </div>
      </div>
      <div v-show="page === 'my-command'">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4"
          v-for="team in managerTeams"
          :key="team.id"
        >
          <div class="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
            <div class="block py-4 px-6 bg-blue-500 rounded-md shadow-lg shadow-inner">
              <h3 class="text-2xl text-white font-semibold">Команда {{ team.name }}</h3>
            </div>
          </div>
          <router-link
            :to="{ name: 'colleagues.detail', params: { id: teamEmployee.id } }"
            v-for="teamEmployee in team.employees.filter(item => item.id !== employee.id)"
            :key="teamEmployee.id"
          >
            <at-panel class="h-full" no-header-padding>
              <template #header>
                <div v-if="employeeLoading">
                  <div class="flex">
                    <at-skeleton type="image"></at-skeleton>
                    <at-skeleton type="image"></at-skeleton>
                  </div>
                </div>
                <div v-else class="relative">
                  <img
                    v-img-loader
                    :class="`rounded-t 2xl:h-80 xl:h-72 h-64 w-full object-cover bg-gray-300 ${
                      teamEmployee.avatar_link ? '' : 'p-4'
                    }`"
                    :src="getUserAvatar(teamEmployee)"
                    :alt="teamEmployee.name"
                  />
                  <span
                    class="absolute bottom-2 left-2 px-2 py-1 bg-white rounded-full text-xs font-semibold"
                    :class="`text-${$filters.finder(statuses, teamEmployee.status)?.color}-500`"
                  >
                    {{ $filters.finder(statuses, teamEmployee?.status)?.name }}
                  </span>
                </div>
              </template>
              <div class="text-center">
                <p class="font-bold">{{ teamEmployee.name }}</p>
                <div v-if="teamEmployee?.current_position?.length">
                  <p class="text-gray-500 text-sm">
                    {{ teamEmployee.current_position[teamEmployee.current_position.length - 1].name }}
                  </p>
                </div>
                <div v-else-if="teamEmployee?.positions?.length">
                  <p class="text-gray-500 text-sm">
                    {{ teamEmployee.positions[teamEmployee.positions.length - 1].name }}
                  </p>
                </div>
                <p class="text-gray-500 text-sm" v-else>Нет позиции</p>
              </div>
            </at-panel>
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="employee && getOutbotMessage && page === 'my-command'" class="py-5">
      <div class="mb-4">
        <at-panel>
          <at-panel-title>Сообщения от коллег</at-panel-title>
          <div class="mb-4">
            <at-tabs v-model="messageQuery.filter_by" valueType="value" :items="messageFilterOptions"></at-tabs>
          </div>
          <div v-if="messageLoading">
            <div v-for="i in 15" :key="i">
              <at-skeleton class="mb-2"></at-skeleton>
            </div>
          </div>
          <div v-else>
            <at-table class="-mr-6 -ml-6 -mb-6" :head="messagesTableHead" :elements="messages.data">
              <template #element="{ element }">
                <at-table-item>
                  {{ element.employee_name }}
                </at-table-item>
                <at-table-item>
                  <at-badge
                    :color="
                      element.type === 'late_cases'
                        ? 'yellow'
                        : element.type === 'self_reason_cases'
                        ? 'green'
                        : element.type === 'day_offs'
                        ? 'indigo'
                        : 'red'
                    "
                    >{{
                      element.type === 'late_cases'
                        ? 'Опаздывает'
                        : element.type === 'self_reason_cases'
                        ? 'Предупредил'
                        : element.type === 'day_offs'
                        ? 'Отпросился'
                        : 'Работает удаленно'
                    }}</at-badge
                  >
                </at-table-item>
                <at-table-item>
                  {{ element.reason || element.note }}
                </at-table-item>
                <at-table-item>
                  <div v-if="element.type === 'day_offs'">
                    <div v-if="element.time_to && element.time_from">
                      <p class="whitespace-nowrap">
                        <span class="text-gray-400"> {{ element.duration_minute + ' min' }}</span>
                        {{ '(' + readableDateTime(element.time_from) }}-{{ readableDateTime(element.time_to) + ')' }}
                      </p>
                    </div>
                    <div v-else>
                      <p class="whitespace-nowrap">На весь день</p>
                    </div>
                  </div>
                  <div v-if="element.type === 'late_cases'">
                    <div v-if="element.minute">
                      <p class="whitespace-nowrap">{{ element.minute }} минут</p>
                    </div>
                  </div>
                  <div v-if="element.type === 'remote_work_cases'">
                    <p class="whitespace-nowrap">
                      в {{ $filters.readableDate(element.created_at) }} {{ $filters.readableTime(element.created_at) }}
                    </p>
                    <p class="text-gray-500 whitespace-nowrap">на {{ $filters.readableDate(element.date) }}</p>
                  </div>
                  <div v-else>
                    <p class="text-gray-500 whitespace-nowrap">
                      {{ $filters.readableDate(element.created_at) }}
                    </p>
                    <p class="text-gray-500 whitespace-nowrap">{{ $filters.readableTime(element.created_at) }}</p>
                  </div>
                </at-table-item>
              </template>
              <template #footer>
                <div v-if="!messages.data?.length && employee" class="text-center my-5">
                  <p>Пусто</p>
                </div>
                <at-pagination
                  v-if="messages.last_page > 1"
                  v-model="messageQuery.page"
                  :total="messages.last_page"
                ></at-pagination>
              </template>
            </at-table>
          </div>
        </at-panel>
      </div>
    </div>
  </div>
</template>
