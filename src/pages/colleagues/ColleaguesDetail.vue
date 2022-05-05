<template>
  <div v-if="loading">
    <div class="mt-4 grid grid-cols-1 sm:grid-cols-7 lg:grid-cols-11 gap-4 py-6">
      <at-panel class="text-center max-w-xs md:h-full col-span-1 sm:col-span-3" no-header-padding>
        <at-skeleton type="image" class="mb-4 h-72"></at-skeleton>
        <at-skeleton type="row" class="mt-8 mb-2"></at-skeleton>
        <at-skeleton type="row" class="mb-2"></at-skeleton>
        <at-skeleton type="row" class="mb-2"></at-skeleton>
        <div class="flex justify-center mt-2">
          <at-skeleton type="button"></at-skeleton>
        </div>
      </at-panel>
      <AtPanel class="col-span-1 sm:col-span-4 w-full" title="Информация">
        <div class="grid md:grid-cols-1 sm:grid-cols-3 gap-4 grid-cols-2">
          <div v-for="i in 8" :key="i">
            <at-skeleton class="mt-2" type="row"></at-skeleton>
          </div>
        </div>
      </AtPanel>
      <AtPanel class="lg:col-span-4 sm:col-span-7 sm:w-full" title="История должностей">
        <div class="grid grid-cols-1">
          <div class="flex space-x-2 items-center mb-4" v-for="i in 5" :key="i">
            <at-skeleton type="avatar"></at-skeleton>
            <div class="flex-grow">
              <at-skeleton type="row" class="w-full mb-2"></at-skeleton>
              <at-skeleton type="row" class="w-full"></at-skeleton>
            </div>
          </div>
        </div>
      </AtPanel>
    </div>
  </div>
  <div v-else class="mt-4 grid grid-cols-1 sm:grid-cols-7 lg:grid-cols-11 gap-4 py-6">
    <at-panel class="text-center col-span-1 sm:col-span-3 relative" no-header-padding>
      <template #header>
        <img
          v-img-loader
          :src="getUserImage(colleague)"
          @error="getUserImage(colleague, $event)"
          class="object-cover rounded-t w-full h-72 xl:h-80 2xl:h-96"
          :alt="colleague.name"
        />
      </template>
      <div>
        <span class="font-bold">{{ colleague.name }}</span>
        <p class="text-gray-500 truncate mt-2">
          {{ getPositionTitle(colleague) }}
        </p>
        <div class="text-center mt-4">
          <div v-if="store.getters['core/getEmployeeData'].data?.employee?.id != id">
            <at-button @click="bntLog()" color="primary" size="sm">Дать фидбек</at-button>
          </div>
          <AtModal v-model="modal" :title="'Фидбек для ' + colleague.name">
            <div class="mt-2">
              <p class="text-lg text-black mb-1">Ваш Фидбек:</p>
              <AtTextarea
                ref="feedBackInput"
                :error="submitted && v$.feedbackBody.$error"
                v-model="feedbackBody"
                placeholder=""
              ></AtTextarea>
              <p class="text-lg text-black mb-1">Совет для "{{ '' + colleague.name }}":</p>
              <AtInput v-model="adviceToColleague" placeholder=""></AtInput>
              <p class="text-red-500" v-if="submitted && v$.feedbackBody.$error">Поле обязательно для заполнения</p>
              <AtCheckbox label="Анонимно" class="mb-2 mt-4 text-2xl" v-model="anonymous" />
              <div class="flex space-x-3 mt-3">
                <AtButton class="w-full p-4" @click="cancel">Отмена</AtButton>
                <AtButton class="w-full p-4" color="primary" :loading="modalLoading" @click="sendFeedbackToEmployee">
                  Сохранить
                </AtButton>
              </div>
            </div>
          </AtModal>
        </div>
      </div>
      <at-badge
        class="absolute top-64 xl:top-72 2xl:top-80 2xl:mt-5 left-2"
        :color="colleague.status === 1 ? 'green' : 'blue'"
        rounded
        >{{ colleague.status === 1 ? 'В офисе' : 'Не в офисе' }}</at-badge
      >
      <at-badge
        v-if="colleague.status === 6"
        class="absolute top-64 xl:top-72 2xl:top-80 2xl:mt-5 left-2"
        :color="'red'"
        rounded
      >
        {{ 'Работает удалённо' }}
      </at-badge>
    </at-panel>
    <AtPanel class="col-span-1 sm:col-span-4 w-full" title="Информация">
      <div>
        <div>
          <p class="text-sm text-gray-500">Номер</p>
          <p class="text-gray-900">
            <a :href="`tel:${colleague.phone}`">{{ phoneTransformation(colleague.phone) }}</a>
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mt-2">Почта</p>
          <p class="text-gray-900">
            <a :href="`mailto:${colleague.email}`">{{ colleague.email || 'Почта отсутствует' }}</a>
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mt-2">Телеграм</p>
          <a class="cursor-pointer underline text-blue-500" target="_blank" :href="colleague.telegram_link">
            {{ colleague.telegram_link }}
          </a>
          <at-badge v-if="colleague.telegram_link == null"> Нет данных </at-badge>
        </div>
        <div>
          <p class="text-sm text-gray-500 mt-2">День рождения</p>
          <p class="text-gray-900">
            {{ formatDateToLocaleString(colleague.birth_date) || 'Дата отсутствует' }} -
            {{ formatDistanceBirthDay(colleague.birth_date) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mt-2">Команда</p>
          <AtBadge class="mt-2 mr-2" v-for="(item, index) of colleague.teams" :key="index" large rounded>
            {{ item.name }}
          </AtBadge>
          <at-badge v-if="!colleague.teams?.length"> Нет данных </at-badge>
        </div>
        <div>
          <p class="text-sm text-gray-500 mt-2">Проекты</p>
          <div v-for="(item, index) of colleague.teams" :key="index" class="flex flex-wrap w-full">
            <div class="mr-2" v-for="project in item.projects" :key="project.id">
              <AtBadge color="blue" class="mt-2" large rounded>
                <p>{{ project.name }}</p>
              </AtBadge>
            </div>
            <at-badge v-if="!colleague.teams?.length"> Нет данных </at-badge>
          </div>
        </div>
      </div>
    </AtPanel>
    <AtPanel class="lg:col-span-4 sm:col-span-7 sm:w-full" title="История должностей">
      <div class="grid grid-cols-1 relative">
        <div class="mb-5" v-for="pos in colleague.positions" :key="pos.id">
          <div class="flex space-x-2 items-start" v-if="pos?.pivot?.current">
            <span
              class="
                rounded-full
                text-center
                bg-green-300
                h-9
                w-9
                flex
                items-center
                justify-center
                flex-shrink-0
                ring-8 ring-white
                p-2
              "
            >
              <check-icon class="w-full h-full text-white"></check-icon
            ></span>
            <div class="flex flex-col -mt-1">
              <p class="mb-6 text-black text-base font-normal leading-5 mb-4">{{ pos.name }}</p>
              <p class="text-gray-500 -mt-6">
                {{ pos.pivot.start_at }} -
                <span class="text-gray-500 text-base">Текущее время</span>
              </p>
            </div>
          </div>
          <div v-else class="flex space-x-2 items-start relative">
            <span
              class="
                rounded-full
                mt-2
                w-9
                h-9
                text-center
                bg-blue-500
                flex
                items-center
                justify-center
                flex-shrink-0
                ring-8 ring-white
                p-2
              "
            >
              <chevron-double-up-icon class="w-full h-full text-white"></chevron-double-up-icon>
            </span>
            <div class="flex flex-col mt-1">
              <p class="absolute w-0.5 h-6 bg-gray-200 left-4 -top-5"></p>
              <p class="mb-6 text-black text-base font-normal leading-5 mb-4">{{ pos.name }}</p>
              <p class="text-gray-500 -mt-6">{{ pos.pivot.start_at }} - {{ pos.pivot.end_at }}</p>
            </div>
          </div>
        </div>
        <div v-if="!colleague?.positions?.length">
          <at-alert>Нет данных</at-alert>
        </div>
      </div>
    </AtPanel>
    <!--    <div class="md:col-span-5 col-span-7" v-show="checkTeamManager()">-->
    <!--      <at-panel title="Назначить Таргет" border-header>-->
    <!--        <AtInput label="Введите таргет" v-model="targetBody" :error="form$.targetBody.$error" />-->
    <!--        <p class="text-red-500" v-if="form$.targetBody.$error">Поле обязательно для заполнения</p>-->
    <!--        <AtDatepicker label="From" v-model="dateFrom" :error="form$.dateFrom.$error" />-->
    <!--        <p class="text-red-500" v-if="form$.dateFrom.$error">Поле обязательно для заполнения</p>-->
    <!--        <AtDatepicker label="To" v-model="dateTo" :error="form$.dateTo.$error" />-->
    <!--        <p class="text-red-500" v-if="form$.dateTo.$error">Поле обязательно для заполнения</p>-->
    <!--        <AtButton class="mt-2" color="secondary" :loading="btnLoading" @click="sendTarget()">Отправить</AtButton>-->
    <!--      </at-panel>-->
    <!--    </div>-->
  </div>
</template>

<script>
  import { ChevronDoubleUpIcon, CheckIcon } from '@heroicons/vue/solid';
  import { getColleague } from '~/services/colleagues.api';
  import { sendTargetToEmployee } from '~/services/employeeGoals.api';
  import { formatDateToLocaleString } from '~/utils/parsers';
  import { parseDate } from '~/utils/filters/dateFilters';
  import AtInput from '~/plugins/aliftech-ui/components/AtInput/AtInput';
  import AtPanel from '~/plugins/aliftech-ui/components/AtPanel/AtPanel';
  import AtModal from '~/plugins/aliftech-ui/components/AtModal/AtModal';
  import AtTextarea from '~/plugins/aliftech-ui/components/AtTextarea/AtTextarea';
  import AtBadge from '~/plugins/aliftech-ui/components/AtBadge/AtBadge';
  import AtButton from '~/plugins/aliftech-ui/components/AtButton/AtButton';
  import AtSkeleton from '~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton';
  import AtAlert from '~/plugins/aliftech-ui/components/AtAlert/AtAlert';
  import AtCheckbox from '~/plugins/aliftech-ui/components/AtCheckbox/AtCheckbox';
  import store from '~/store';
  import useUserAvatar from '~/utils/hooks/useUserAvatar';
  import useVuelidate from '@vuelidate/core';
  import { required } from '@vuelidate/validators';
  import { useRoute, useRouter } from 'vue-router';

  import { sendFeedback } from '~/services/feedback.api';
  import { $toast } from '~/main';
  import { ref, reactive, nextTick } from 'vue';
  import { formatDistanceStrict } from 'date-fns';
  import { ru } from 'date-fns/locale';

  export default {
    name: 'ColleaguesDetail',
    components: {
      AtAlert,
      ChevronDoubleUpIcon,
      CheckIcon,
      AtPanel,
      AtBadge,
      AtButton,
      AtSkeleton,
      AtInput,
      AtModal,
      AtTextarea,
      AtCheckbox,
    },
    props: {
      id: { type: [Number, String], required: true },
    },
    setup() {
      const userAvatar = useUserAvatar();
      const route = useRoute();
      const router = useRouter();
      const feedbackBody = ref('');
      const colleague = ref({});
      const loading = ref(false);
      const anonymous = ref(false);
      const feedBackInput = ref(null);
      const dateFrom = ref(null);
      const adviceToColleague = ref('');
      const dateTo = ref(null);
      const targetBody = ref('');
      const roles = ref([]);
      //const employeeId = ref(0);
      const colleague_error = ref('');

      const colleaguePosition = reactive({
        data: null,
        loading: true,
        error: [],
      });

      // const getRoles = () => {
      //   getUser().then(res => {
      //     roles.value = res.data.roles;
      //   });
      // };
      //
      // getRoles();

      const bntLog = () => {
        modal.value = true;
        nextTick(() => {
          feedBackInput.value.children[0].focus();
        });
      };

      const getColleagueById = () => {
        loading.value = true;
        return getColleague(route.params.id)
          .then(res => {
            colleague.value = res.data;
            colleague.value.positions = res.data.positions.reverse();
          })
          .catch(res => {
            colleague_error.value = res.data?.message;
            router.push({ name: 'object-not-found' });
          })
          .finally(() => (loading.value = false));
      };

      const getDepartmentName = colleague => {
        return Array.isArray(colleague.positions) && colleague.positions[0] && colleague.positions[0].department
          ? colleague.positions[0].department.name
          : 'Отсутствует';
      };

      const phoneTransformation = phone => {
        if (phone) {
          const countryCode = phone.substring(0, 3);
          const code = phone.substring(3, 5);
          const number1 = phone.substring(5, 8);
          const number2 = phone.substring(8, 10);
          const number3 = phone.substring(10, 12);
          return `+${countryCode} ${code} ${number1} ${number2} ${number3}`;
        } else {
          return 'Телефон отсутствует';
        }
      };

      const getPositionTitle = colleague => {
        return Array.isArray(colleague.positions) && colleague.positions[0]
          ? colleague.positions[0].name
          : 'Нет позиции';
      };

      const formatDistanceBirthDay = colleague => {
        let date_now = new Date();
        let birth_date = new Date(colleague);
        birth_date.setFullYear(date_now.getFullYear());
        if (birth_date.getTime() < date_now.getTime()) {
          birth_date.setFullYear(date_now.getFullYear() + 1);
        }
        return formatDistanceStrict(birth_date, date_now, {
          locale: ru,
          addSuffix: true,
          roundingMethod: 'floor',
          unit: 'day',
        });
      };

      getColleagueById();

      const modal = ref(false);
      const modalLoading = ref(false);
      const btnLoading = ref(false);
      const submitted = ref(false);

      const sendTarget = () => {
        if (form$.value.$invalid) {
          form$.value.$touch();
          return;
        }
        btnLoading.value = true;
        sendTargetToEmployee({
          name: targetBody.value,
          date_from: parseDate(dateFrom.value),
          date_to: parseDate(dateTo.value),
        })
          .then(() => {
            $toast.show({
              title: 'Успешно',
              subTitle: 'Таргет успешно отправлено',
              type: 'success',
            });
          })
          .catch(error => {
            $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
          })
          .finally(() => {
            dateFrom.value = null;
            dateTo.value = null;
            targetBody.value = '';
            btnLoading.value = false;
          });
      };

      const sendFeedbackToEmployee = () => {
        submitted.value = true;

        if (v$.value.$invalid) {
          v$.value.$touch();
          return;
        }

        submitted.value = true;
        modalLoading.value = true;
        sendFeedback({
          body: feedbackBody.value,
          anonym: anonymous.value,
          for_company: false,
          to_employee_id: route.params.id,
          advice: adviceToColleague.value,
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
      };

      const checkTeamManager = () => {
        const teamManager = roles.value.find(element => element.name === 'Team Manager');
        return teamManager?.name && true;
      };

      checkTeamManager();

      const cancel = () => {
        feedbackBody.value = '';
        modal.value = false;
      };

      const rules = {
        feedbackBody: { required },
      };

      const rules1 = {
        dateTo: { required },
        dateFrom: { required },
        targetBody: { required },
      };
      const v$ = useVuelidate(rules, { feedbackBody });
      const form$ = useVuelidate(rules1, { dateFrom, dateTo, targetBody });

      return {
        modalLoading,
        modal,
        loading,
        colleague,
        getPositionTitle,
        getDepartmentName,
        getUserImage: userAvatar.getUserImage,
        feedbackBody,
        sendFeedbackToEmployee,
        formatDateToLocaleString,
        formatDistanceBirthDay,
        cancel,
        dateFrom,
        dateTo,
        targetBody,
        submitted,
        sendTarget,
        colleaguePosition,
        v$,
        parseDate,
        anonymous,
        feedBackInput,
        bntLog,
        phoneTransformation,
        //getUser,
        //getRoles,
        btnLoading,
        checkTeamManager,
        adviceToColleague,
        form$,
        rules1,
        roles,
        router,
        colleague_error,
        store,
      };
    },
  };
</script>

<style scoped></style>
