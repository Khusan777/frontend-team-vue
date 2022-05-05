<script setup>
  import { computed, defineAsyncComponent, ref, watch } from 'vue';
  import { getOutbotMessagesFromAllColleagues } from '~/services/outbot.api';
  import { readableDateTime } from '~/utils/filters/dateFilters';
  import useUserAvatar from '~/utils/hooks/useUserAvatar';
  import { useStore } from 'vuex';

  const getUserAvatar = useUserAvatar().getUserImage;
  const store = useStore();
  const messageLoading = ref(false);
  const messages = ref([]);
  const messageFilterOptions = ref([
    { value: 'late_cases,self_reason_cases,day_offs,remote_work_cases', title: 'Все' },
    { value: 'late_cases', title: 'Опаздания' },
    { value: 'self_reason_cases', title: 'Предупреждения' },
    { value: 'day_offs', title: 'Отпрашивания' },
    { value: 'remote_work_cases', title: 'Удаленно работающие' },
  ]);
  const messageQuery = ref({
    page: 1,
    filter_by: 'late_cases,self_reason_cases,day_offs,remote_work_cases',
    per_page: 10,
  });
  const messagesTableHead = [{ title: 'ФИО' }, { title: 'Причина' }, { title: 'Дата' }];
  const employeeLoading = computed(() => {
    return store.getters['core/getEmployeeData'].loading;
  });
  const employee = computed(() => {
    return store.getters['core/getEmployeeData'].data?.employee;
  });
  const getOutbotMessage = computed(() => {
    return store.getters['core/getEmployeeData'].data?.employee?.outbot_access;
  });

  const getMessages = () => {
    messageLoading.value = true;
    getOutbotMessagesFromAllColleagues(messageQuery.value)
      .then(res => {
        messages.value = res.data.data;
      })
      .finally(() => (messageLoading.value = false));
  };

  watch(
    employee,
    () => {
      if (getOutbotMessage.value) {
        getMessages();
      }
    },
    { immediate: true }
  );

  const getCurrentPosition = employeePositions => {
    if (!employeePositions.length) return 'Без позиции';
    const preparedData = employeePositions.map(item => ({
      name: item.name,
      isCurrent: item.pivot.current ? true : false,
    }));
    const res = preparedData.find(item => item.isCurrent);
    return res?.name ?? 'Без позиции';
  };
  watch(messageQuery, () => getMessages(), { deep: true });

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

  const AtAlert = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtAlert/AtAlert'));
  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));
  const AtPanel = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanel/AtPanel'));
  const AtPanelTitle = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanelTitle/AtPanelTitle'));
  const AtButton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtButton/AtButton'));
  const AtTable = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTable/AtTable'));
  const AtTabs = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTabs/AtTabs'));
  const AtTableItem = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTableItem/AtTableItem'));
  const AtPagination = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPagination/AtPagination'));
</script>

<template>
  <div v-if="employeeLoading" class="py-5">
    <at-skeleton type="row" class="mb-3 h-10 w-8/12"></at-skeleton>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <at-panel>
        <at-skeleton type="image" class="mb-6 h-60 w-full"></at-skeleton>
        <at-skeleton type="row" class="mb-3"></at-skeleton>
        <at-skeleton type="row" class="mb-3"></at-skeleton>
        <at-skeleton type="button" class="w-full h-10 mt-4"></at-skeleton>
      </at-panel>
      <div class="col-span-1 md:col-span-2 lg:col-span-3">
        <at-skeleton type="row" class="h-24 mb-4"></at-skeleton>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <at-panel v-for="i in 8" :key="i">
            <at-skeleton type="image" class="mb-3"></at-skeleton>
            <at-skeleton type="row"></at-skeleton>
          </at-panel>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="py-5">
    <p class="text-3xl text-black font-bold mb-6">{{ greetingsColleague() }}, {{ ' ' + employee.name }}</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <at-panel no-header-padding>
        <template #header>
          <img
            v-img-loader
            :src="getUserAvatar(employee)"
            @error="getUserAvatar(employee, $event)"
            :alt="employee.name"
            :class="`w-full rounded-t h-auto object-cover bg-gray-300 ${employee.avatar_link ? '' : 'p-4'}`"
            style="height: 17rem"
          />
        </template>
        <div class="text-center">
          <p class="text-xl font-bold">{{ employee.name }}</p>
          <p class="text-gray-500 mb-5">{{ getCurrentPosition(employee.positions) }}</p>
          <at-button color="primary" :to="{ name: 'profile' }" block>Перейти в профиль</at-button>
        </div>
      </at-panel>

      <div class="col-span-1 md:col-span-2 lg:col-span-3">
        <div v-if="!employee.teams.length">
          <at-alert class="h-22" type="info">У вас нет команды</at-alert>
        </div>
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4"
          v-for="team in employee.teams"
          :key="team.id"
        >
          <div class="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
            <div class="block py-4 px-6 bg-blue-500 rounded-md shadow-lg shadow-inner">
              <h3 class="text-2xl text-white font-semibold">Команда {{ team.name }}</h3>
              <span class="text-gray-500">Менеджер</span
              ><span class="ml-2 text-white font-bold" v-if="!team.manager?.manager_name">{{ 'Не назначен' }}</span>
              <span v-else class="ml-2 text-white font-bold">{{ team.manager?.manager_name }}</span>
            </div>
          </div>
          <router-link
            :to="{ name: 'colleagues.detail', params: { id: teamEmployee.id } }"
            v-for="teamEmployee in team.employees.filter(item => item.id !== employee.id)"
            :key="teamEmployee.id"
          >
            <at-panel class="h-full" no-header-padding>
              <template #header>
                <div class="relative">
                  <img
                    v-img-loader
                    :class="`rounded-t w-full object-cover bg-gray-300 ${teamEmployee.avatar_link ? '' : 'p-4'}`"
                    style="height: 14.56rem"
                    :src="getUserAvatar(teamEmployee)"
                    :alt="teamEmployee.name"
                  />
                  <span
                    class="absolute bottom-2 left-2 px-2 py-1 bg-white rounded-full text-xs font-semibold"
                    :class="teamEmployee.status === 1 ? 'text-green-500' : 'text-red-500'"
                  >
                    {{ teamEmployee.status === 1 ? 'В офисе' : 'Не в офисе' }}
                  </span>
                </div>
              </template>
              <div class="text-center">
                <p class="font-bold">{{ teamEmployee.name }}</p>
                <p class="text-gray-500 text-sm" v-if="teamEmployee?.positions.length">
                  {{ teamEmployee.positions[teamEmployee.positions.length - 1].name }}
                </p>
              </div>
            </at-panel>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <div v-if="employee && getOutbotMessage" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div></div>
    <div class="col-span-1 md:col-span-2 lg:col-span-3 mb-4">
      <at-panel>
        <at-panel-title>Сообщения от коллег</at-panel-title>
        <div class="mb-4">
          <at-tabs
            label="Фильтр"
            v-model="messageQuery.filter_by"
            valueType="value"
            :items="messageFilterOptions"
          ></at-tabs>
        </div>
        <div v-if="messageLoading">
          <div v-for="i in 15" :key="i">
            <at-skeleton class="mb-3"></at-skeleton>
          </div>
        </div>
        <div v-else>
          <at-table class="-mr-6 -ml-6 -mb-6" :head="messagesTableHead" :elements="messages.data">
            <template #element="{ element }">
              <at-table-item>
                {{ element.employee_name }}
              </at-table-item>
              <at-table-item>
                {{ element.reason || element.note }}
              </at-table-item>
              <at-table-item>
                <div v-if="element.type === 'day_offs'">
                  <div v-if="element.time_to && element.time_from">
                    <p class="whitespace-nowrap">
                      {{ readableDateTime(element.time_from) }}-{{ readableDateTime(element.time_to) }}
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
              <div v-if="!messages.data?.length" class="text-center my-5">
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
</template>
