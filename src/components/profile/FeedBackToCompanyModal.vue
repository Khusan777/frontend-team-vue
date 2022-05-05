<script setup>
  import { defineAsyncComponent, ref, nextTick } from 'vue';
  import { sendFeedback } from '~/services/feedback.api';
  import { $toast } from '~/main';
  import useVuelidate from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

  let feedbackBody = ref('');
  let modal = ref(false);
  const modalLoading = ref(false);
  let submitted = ref(false);
  const feedbackInput = ref(null);

  function sendFeedbackToCompany() {
    submitted.value = true;

    if (v$.value.$invalid) {
      v$.value.$touch();
      return;
    }

    modalLoading.value = true;
    sendFeedback({
      body: feedbackBody.value,
      anonym: true,
      for_company: true,
      to_employee_id: null,
      advice: feedbackBody.value,
    })
      .then(() => {
        $toast.show({
          title: 'Успешно',
          subTitle: 'Ваш фидбек успешно отправлено',
          type: 'success',
        });
      })
      .finally(() => {
        submitted.value = false;
        feedbackBody.value = '';
        modal.value = false;
        modalLoading.value = false;
      });
  }

  const cancel = () => {
    feedbackBody.value = '';
    modal.value = false;
  };

  const bntLog = () => {
    modal.value = true;
    nextTick(() => {
      feedbackInput.value.children[0].focus();
    });
  };

  const rules = {
    feedbackBody: { required },
  };

  const v$ = useVuelidate(rules, { feedbackBody });
  const AtModal = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtModal/AtModal'));
  const AtTextarea = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTextarea/AtTextarea'));
  const AtButton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtButton/AtButton'));
</script>

<template>
  <div>
    <AtButton
      class="md:col-span-3 lg:col-span-3 whitespace-nowrap"
      color="success"
      size="sm"
      icon="mail"
      :block="true"
      @click="bntLog"
    >
      Дать фидбек компании
    </AtButton>
    <AtModal v-model="modal" title="Фидбек на Alif">
      <p class="text-md">
        Здесь вы можете оставить фидбек всей компании, если вас что-то не устраивает. Или вы можете предложить
        что-нибудь улучшить
      </p>
      <div class="mt-2">
        <p class="text-lg text-black mb-1">Ваш Фидбек</p>
        <AtTextarea
          v-model="feedbackBody"
          ref="feedbackInput"
          :error="submitted && v$.feedbackBody.$error"
          placeholder=""
        ></AtTextarea>
        <p class="text-red-500" v-if="submitted && v$.feedbackBody.$error">Поле обязательно для заполнения</p>
        <div class="flex space-x-3 mt-3">
          <AtButton class="w-full p-4" @click="cancel">Отмена</AtButton>
          <AtButton class="w-full p-4" color="primary" :loading="modalLoading" @click="sendFeedbackToCompany">
            Сохранить
          </AtButton>
        </div>
      </div>
    </AtModal>
  </div>
</template>

<style scoped></style>
