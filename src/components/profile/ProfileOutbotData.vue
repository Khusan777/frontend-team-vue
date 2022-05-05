<script setup>
  import { defineAsyncComponent, computed, defineProps, ref, watch } from 'vue';
  import { readableDate, readableDateTime } from '~/utils/filters/dateFilters';
  import { getOutbotMessagesFromColleague } from '~/services/outbot.api';

  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));
  const AtPanel = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanel/AtPanel'));
  const AtPanelTitle = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanelTitle/AtPanelTitle'));
  const AtTable = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTable/AtTable'));
  const AtTabs = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTabs/AtTabs'));
  const AtTableItem = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTableItem/AtTableItem'));
  const AtPagination = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPagination/AtPagination'));
  const ProfileOutbotStats = defineAsyncComponent(() => import('~/components/profile/ProfileOutbotStats'));
  const StatsSkeleton = defineAsyncComponent(() => import('~/components/skeleton/StatsSkeleton'));
  const AtBadge = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtBadge/AtBadge'));
  const checkLateCases = computed(() => checkCountOutBotCases(props.userData?.late_cases));
  const checkDayOffs = computed(() => checkCountOutBotCases(props.userData?.day_offs));
  const checkRemoteWorkCases = computed(() => checkCountOutBotCases(props.userData?.remote_work_cases));
  const checkSelfReasonCases = computed(() => checkCountOutBotCases(props.userData?.self_reason_cases));

  const messageLoading = ref(false);
  const messages = ref([]);
  const messageFilterOptions = ref([
    { value: 'late_cases,self_reason_cases,day_offs,remote_work_cases', title: 'Все' },
    { value: 'late_cases', title: 'Опаздания' },
    { value: 'self_reason_cases', title: 'Предупреждали' },
    { value: 'day_offs', title: 'Отпрашивания' },
    { value: 'remote_work_cases', title: 'Работали дома' },
  ]);
  const messagesTableHead = [{ title: 'Дата' }, { title: 'Кейс' }, { title: 'Сообщение' }, { title: 'На сколько' }];
  const props = defineProps({
    userData: {
      type: [Array, Object],
      default: () => [],
    },
    userId: {
      type: Number,
    },
    loading: Boolean,
  });

  const messageQuery = ref({
    employee_id: props.userId,
    page: 1,
    filter_by: 'late_cases,self_reason_cases,day_offs,remote_work_cases',
    per_page: 10,
  });

  const getMessagesOutbot = () => {
    messageLoading.value = true;
    getOutbotMessagesFromColleague(messageQuery.value)
      .then(res => {
        messages.value = res.data.data;
      })
      .finally(() => (messageLoading.value = false));
  };

  getMessagesOutbot();

  watch(messageQuery, () => getMessagesOutbot(), { deep: true });

  const checkCountOutBotCases = outbotCase => {
    const date = new Date();
    const prev_month = new Date();
    prev_month.setDate(-1);
    const lateCases = outbotCase?.map(c => new Date(c.created_at)) ?? [];
    const comparer = lateCases.reduce(
      (acc, c) => {
        if (date.getFullYear() === c.getFullYear() && date.getMonth() === c.getMonth()) {
          acc.curr++;
        }
        if (prev_month.getFullYear() === c.getFullYear() && prev_month.getMonth() === c.getMonth()) {
          acc.prev++;
        }
        return acc;
      },
      { prev: 0, curr: 0 }
    );
    return comparer;
  };
</script>

<template>
  <h1 class="font-medium text-black text-xl mt-4">Статистика за месяц</h1>
  <div v-if="props.loading">
    <div class="grid grid-cols-4 gap-4 pb-2 mt-6">
      <div v-for="i in 4" :key="i">
        <div class="md:col-span-1 col-span-4">
          <stats-skeleton class="mb-1"></stats-skeleton>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="grid grid-cols-4 gap-4 pb-2 mt-6">
    <ProfileOutbotStats title="Отпрашивание" :outbotData="checkDayOffs"></ProfileOutbotStats>
    <ProfileOutbotStats title="Опоздания" :outbotData="checkLateCases"></ProfileOutbotStats>
    <ProfileOutbotStats title="Предупреждали" :outbotData="checkSelfReasonCases"></ProfileOutbotStats>
    <ProfileOutbotStats title="Работали дома" :outbotData="checkRemoteWorkCases"></ProfileOutbotStats>
  </div>
  <div class="py-2 grid grid-cols-4 gap-x-4 gap-y-2 mt-6 pb-6">
    <div class="col-span-4">
      <at-panel>
        <at-panel-title>Мои Сообщения</at-panel-title>
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
                <p class="text-black whitespace-nowrap">
                  {{ readableDate(element.date) || readableDate(element.created_at) }}
                </p>
                <p class="text-gray-500 whitespace-nowrap">
                  {{ $filters.readableTime(element.created_at) }}
                </p>
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
                      ? 'Опоздание'
                      : element.type === 'self_reason_cases'
                      ? 'Предупреждали'
                      : element.type === 'day_offs'
                      ? 'Отпрашивания'
                      : 'Работали дома'
                  }}</at-badge
                >
              </at-table-item>
              <at-table-item>
                {{ element.reason || element.note }}
              </at-table-item>
              <at-table-item>
                <div class="text-gray-500 whitespace-nowrap" v-if="element.type === 'day_offs' && element.date">
                  <div v-if="element.time_to && element.time_from">
                    <p class="whitespace-nowrap">
                      {{ readableDateTime(element.time_from) }}-{{ readableDateTime(element.time_to) }}
                    </p>
                  </div>
                  <p v-if="!element.duration_minute">На весь день</p>
                  <p>{{ readableDate(element?.date) }}</p>
                </div>
                <div v-if="element.type === 'late_cases'">
                  <p class="text-gray-500 whitespace-nowrap">
                    {{ element.minute + ' минут' }}
                  </p>
                </div>
                <div v-if="element.type === 'self_reason_cases'">
                  <p class="text-gray-500 whitespace-nowrap">-</p>
                </div>
                <div v-if="element.type === 'remote_work_cases'">
                  <p class="text-gray-500 whitespace-nowrap">{{ 'На ' + readableDate(element.date) }}</p>
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
