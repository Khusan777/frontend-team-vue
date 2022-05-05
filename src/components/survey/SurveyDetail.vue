<script setup>
  import { defineAsyncComponent, ref } from 'vue';
  import { getShowSurveyQuestions, sendAnswerQuestion } from '~/services/survey';
  import { $toast } from '~/main';
  import { useRoute, useRouter } from 'vue-router';
  import { minLength } from '@vuelidate/validators';
  import useVuelidate from '@vuelidate/core';
  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));
  const AtInput = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtInput/AtInput'));
  const AtButton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtButton/AtButton'));
  const AtRadioGroup = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtRadioGroup/AtRadioGroup'));
  const AtPanel = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanel/AtPanel'));
  const AtAlert = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtAlert/AtAlert'));
  const questionId = ref([]);
  const nameSurvey = ref('');
  const route = useRoute();
  const router = useRouter();
  const surveyId = ref('');
  const btnLoading = ref(false);
  const descriptionSurvey = ref('');
  const checkAnswerSurvey = ref(true);
  const questions = ref([]);
  const loading = ref(false);
  const note = ref('');
  const answers = ref([]);
  const items = [
    {
      title: 1,
      value: 1,
    },
    {
      title: 2,
      value: 2,
    },
    {
      title: 3,
      value: 3,
    },
    {
      title: 4,
      value: 4,
    },
    {
      title: 5,
      value: 5,
    },
    {
      title: 6,
      value: 6,
    },
  ];

  const chooseAnswer = (index, score) => {
    answers.value[index] = score;
  };

  const noteRules = {
    note: { minLength: minLength(4) },
  };

  const noteValidation = useVuelidate(noteRules, {
    note,
  });

  const getSurveyById = () => {
    loading.value = true;
    getShowSurveyQuestions(Number(route.params.id))
      .then(response => {
        surveyId.value = response?.data.data.id;
        nameSurvey.value = response?.data.data.title;
        descriptionSurvey.value = response?.data.data.description;
        questions.value = response?.data.data.questions;
        questionId.value = questions.value.map(idQuestion => {
          return idQuestion.id;
        });
      })
      .catch(error => {
        $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
      })
      .finally(() => (loading.value = false));
  };

  getSurveyById();

  const sendAnswer = () => {
    if (answers.value?.length != questions.value?.length) {
      $toast.show({ title: 'Error', subTitle: 'Пожалуйста заполните все вопросы', type: 'error' });
    } else if (noteValidation.value.$invalid) {
      noteValidation.value.$touch();
      return;
    } else {
      btnLoading.value = true;
      sendAnswerQuestion(surveyId.value, {
        'question_id': questionId.value,
        'score': answers.value,
        'notes': note.value || 'test',
      })
        .then(() => {
          $toast.show({
            title: 'Успешно',
            subTitle: 'Успешно отправлено',
            type: 'success',
          });
          checkAnswerSurvey.value = false;
          router.push({ name: 'profile' });
        })
        .catch(error => {
          $toast.show({ title: 'Error', subTitle: error?.data?.message, type: 'error' });
        })
        .finally(() => {
          btnLoading.value = false;
        });
    }
  };
</script>

<template>
  <div>
    <div class="grid grid-cols-8">
      <div class="col-span-8">
        <div v-if="loading">
          <at-skeleton class="mb-4" type="row"></at-skeleton>
          <at-skeleton class="mb-6" type="row"></at-skeleton>
          <AtPanel>
            <div class="py-2" v-for="i in 12" :key="i">
              <at-skeleton type="row"></at-skeleton>
            </div>
          </AtPanel>
        </div>
        <div v-else>
          <p class="text-black font-bold text-xl mb-4">{{ nameSurvey }}</p>
          <p class="text-gray-600 mb-4">{{ descriptionSurvey }}</p>
          <div class="flex gap-x-2 mb-8 text-sm">
            <div>
              Ниже приводятся высказывания, описывающие восприятие человеком различных сторон своей работы. Отнесите эти
              высказывания к Вашей сегодняшней работе и оцените, насколько Вы с ними согласны или не согласны при помощи
              следующей шкалы:
              <p class="mt-2">
                1= совершенно не согласен; 2 = не согласен; 3 = скорее не согласен; 4= скорее согласен; 5= согласен; 6=
                совершенно согласен.
              </p>
            </div>
          </div>
          <AtPanel borderHeader>
            <div class="divide-solid divide-gray-200 divide-y -mx-6" v-if="questions?.length">
              <div class="mb-4" v-for="(questionData, index) in questions" :key="questionData?.id">
                <div class="flex px-6 gap-x-2 mt-4">
                  <div class="text-gray-400 w-5">{{ index + 1 }}</div>
                  <div class="text-md items-center">
                    <p>{{ questionData?.title }}</p>
                    <AtRadioGroup
                      class="mt-2"
                      @update:modelValue="chooseAnswer(index, $event)"
                      :modelValue="answers[index]"
                      :items="items"
                      valueType="title"
                      noBorder
                      inline
                    ></AtRadioGroup>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <at-alert type="warning">Нет данных</at-alert>
            </div>
            <template #footer>
              <div v-if="checkAnswerSurvey" class="justify-end flex flex-grow">
                <AtButton @click="sendAnswer()" color="primary" :loading="btnLoading">Отправить</AtButton>
              </div>
            </template>
            <div class="px-2 mt-4">
              <AtInput
                :error="noteValidation.note.$error"
                label="Ваши комментарии"
                placeholder="комментарий ..."
                v-model="note"
              />
            </div>
          </AtPanel>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
