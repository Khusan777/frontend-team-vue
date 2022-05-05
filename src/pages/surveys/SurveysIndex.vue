<script setup>
  import { computed, defineAsyncComponent, ref } from 'vue';
  import { getIndexSurvey } from '~/services/survey';
  import { $toast } from '~/main';
  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));
  const AtButton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtButton/AtButton'));
  const AtPanel = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanel/AtPanel'));
  const AtAlert = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtAlert/AtAlert'));
  const loading = ref(false);
  const allSurveyData = ref([]);
  const activeSurveys = computed(() => {
    return allSurveyData.value?.filter(activeSurvey => activeSurvey?.is_active) || [];
  });
  const getSurveys = () => {
    loading.value = true;
    getIndexSurvey()
      .then(response => {
        allSurveyData.value = response?.data?.data;
      })
      .catch(error => {
        $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
      })
      .finally(() => (loading.value = false));
  };
  getSurveys();
</script>

<template>
  <div class="pb-4">
    <h1 class="text-black font-bold text-2xl">Опросы</h1>
    <div class="grid gap-6 grid-cols-8 mb-6">
      <div class="contents" v-if="loading">
        <div class="col-span-8" v-for="i in 3" :key="i">
          <div class="mt-4">
            <AtPanel>
              <div>
                <at-skeleton class="mb-4" type="row"></at-skeleton>
                <at-skeleton type="row"></at-skeleton>
              </div>
              <template #footer>
                <div class="justify-end flex flex-grow">
                  <at-skeleton type="row"></at-skeleton>
                </div>
              </template>
            </AtPanel>
          </div>
        </div>
      </div>

      <div class="col-span-8 mt-6" v-else-if="!activeSurveys?.length">
        <at-alert type="warning">Нет запущенных опросников</at-alert>
      </div>

      <div v-else class="col-span-8" v-for="surveyData in activeSurveys" :key="surveyData?.id">
        <div class="mt-4">
          <AtPanel>
            <p class="text-black font-bold text-xl mb-2">{{ surveyData?.title }}</p>
            <p class="text-gray-600">{{ surveyData?.description }}</p>
            <template #footer>
              <div class="justify-end flex flex-grow">
                <AtButton :to="{ name: 'survey.detail', params: { id: surveyData?.id } }" color="primary"
                  >Пройти опрос</AtButton
                >
              </div>
            </template>
          </AtPanel>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
