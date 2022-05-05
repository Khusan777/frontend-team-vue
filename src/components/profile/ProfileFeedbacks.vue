<template>
  <div class="pb-6">
    <AtPanel border-header no-header-padding>
      <template #header>
        <div class="flex items-center justify-between px-4 mt-6">
          <at-panel-title>Фидбеки</at-panel-title>
          <at-tabs
            v-model="currentTab"
            :items="[
              { title: 'Мне', value: 'feedbackTo' },
              { title: 'Мои фидбеки', value: 'feedbackFrom' },
            ]"
          />
        </div>
      </template>
      <div v-if="currentTab === 'feedbackTo'">
        <div v-if="employeeFeedbacks.loading">
          <at-panel>
            <div class="py-2" v-for="i in 6" :key="i">
              <at-skeleton class="py-2" type="row"></at-skeleton>
            </div>
          </at-panel>
        </div>
        <div v-else-if="!employeeFeedbacks.data?.employee_feedbacks_to?.length">
          <div class="py-1">
            <AtAlert class="mb-1 px-2">Нет фидбеков</AtAlert>
          </div>
        </div>
        <div v-else class="divide-solid divide-gray-200 divide-y max-h-96 overflow-y-auto -mx-6">
          <div
            v-for="feedbackTo in employeeFeedbacks.data?.employee_feedbacks_to"
            :key="feedbackTo.id"
            class="flex px-1"
          >
            <div class="flex flex-col w-full px-4 py-2">
              <p class="text-gray-800">{{ feedbackTo.body }}</p>
              <p class="text-gray-400" v-if="feedbackTo.advice">
                Совет:<span class="text-black">{{ ' ' + feedbackTo.advice }}</span>
              </p>
              <div class="flex justify-between items-center text-sm text-gray-400 py-1">
                <span class="font-bold">{{ feedbackTo.anonym ? 'Анонимно' : feedbackTo.from_employee?.name }}</span>
                <span>{{ $filters.formatDateByDayMonthYear(feedbackTo.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentTab === 'feedbackFrom'">
        <div v-if="employeeFeedbacks.loading">
          <at-panel>
            <div class="py-2" v-for="i in 6" :key="i">
              <at-skeleton class="py-2" type="row"></at-skeleton>
            </div>
          </at-panel>
        </div>
        <div v-if="!employeeFeedbacks.data?.employee_feedbacks_from.length">
          <div>
            <AtAlert class="mb-1 px-2">У вас нет фидбеков</AtAlert>
          </div>
        </div>
        <div v-else class="divide-solid divide-y divide-gray-200 max-h-96 overflow-y-auto -mx-6">
          <div
            v-for="feedbackFrom in employeeFeedbacks.data?.employee_feedbacks_from"
            :key="feedbackFrom.id"
            class="flex px-1"
          >
            <div class="flex flex-col w-full px-4 py-2">
              <p class="text-gray-800">{{ feedbackFrom.body }}</p>
              <p class="text-gray-400" v-if="feedbackFrom.advice">
                Совет:<span class="text-black">{{ ' ' + feedbackFrom.advice }}</span>
              </p>
              <div class="flex justify-between items-center text-sm text-gray-400 py-1">
                <span>{{ feedbackFrom.anonym ? 'Анонимно' : feedbackFrom.to_employee?.name }}</span>
                <span>{{ $filters.formatDateByDayMonthYear(feedbackFrom.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AtPanel>
  </div>
</template>

<script>
  import { defineAsyncComponent, reactive, ref } from 'vue';
  import { getFeedbacks } from '~/services/profile.api';
  import { deepCopy } from '~/plugins/aliftech-ui/utils';
  import { parseErrorsFromResponse } from '~/utils/parsers';

  export default {
    name: 'ProfileFeedbacks',
    components: {
      AtPanel: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanel/AtPanel')),
      AtPanelTitle: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanelTitle/AtPanelTitle')),
      AtTabs: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTabs/AtTabs')),
      AtAlert: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtAlert/AtAlert')),
      AtSkeleton: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton')),
    },
    setup() {
      const currentTab = ref('feedbackTo');

      const employeeFeedbacks = reactive({
        data: undefined,
        loading: true,
        error: [],
      });

      getFeedbacks()
        .then(response => (employeeFeedbacks.data = deepCopy(response.data)))
        .catch(err => (employeeFeedbacks.error = parseErrorsFromResponse(err)))
        .finally(() => (employeeFeedbacks.loading = false));

      return { currentTab, employeeFeedbacks };
    },
  };
</script>
