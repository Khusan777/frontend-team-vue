<template>
  <div class="grid grid-cols-3 md:col-span-3 col-span-1 gap-4 mt-6 pb-4">
    <template v-if="loading">
      <div class="md:col-span-1 grid-cols-1 col-span-3 sm:w-full">
        <AtPanel title="Информация">
          <div v-for="i in 8" :key="i">
            <at-skeleton class="mt-2" type="row"></at-skeleton>
          </div>
        </AtPanel>
      </div>
      <div class="md:col-span-1 grid-cols-1 col-span-3 sm:w-full">
        <AtPanel title="История должностей">
          <div class="flex space-x-2 items-center mb-4" v-for="i in 5" :key="i">
            <at-skeleton type="avatar"></at-skeleton>
            <div class="flex-grow">
              <at-skeleton type="row" class="w-full mb-2"></at-skeleton>
              <at-skeleton type="row" class="w-full"></at-skeleton>
            </div>
          </div>
        </AtPanel>
      </div>
      <div class="md:col-span-1 grid-cols-1 col-span-3 sm:w-full">
        <AtPanel title="Зарплата">
          <div v-for="i in 5" :key="i">
            <at-skeleton class="py-4" type="row"></at-skeleton>
          </div>
        </AtPanel>
      </div>
    </template>
    <template v-else>
      <div class="md:col-span-1 grid-cols-1 col-span-3">
        <AtPanel title="Информация">
          <div>
            <div>
              <p class="text-sm text-gray-500">Номер</p>
              <p class="text-gray-900">{{ phoneTransformation(colleague.phone) || 'Телефон отсутствует' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mt-2">Почта</p>
              <p class="text-gray-900">{{ colleague.email || 'Почта отсутствует' }}</p>
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
              <AtBadge
                color="indigo"
                class="mt-2 mr-2"
                v-for="(item, index) of colleague.teams"
                :key="index"
                large
                rounded
              >
                {{ item.name }}
              </AtBadge>
              <at-badge v-if="!colleague.teams.length"> Нет данных </at-badge>
            </div>
            <div>
              <p class="text-sm text-gray-500 mt-2">Проекты</p>
              <div v-for="(item, index) of colleague.teams" :key="index" class="flex flex-wrap w-full">
                <div class="mr-2" v-for="project in item.projects" :key="project.id">
                  <AtBadge color="blue" class="mt-2" large rounded>
                    <p>{{ project.name }}</p>
                  </AtBadge>
                </div>
                <at-badge v-if="!colleague.teams.length"> Нет данных </at-badge>
              </div>
            </div>
          </div>
        </AtPanel>
      </div>
      <div class="md:col-span-1 grid-cols-1 col-span-3">
        <AtPanel title="История должностей">
          <div class="relative">
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
      </div>
      <div class="md:col-span-1 grid-cols-1 col-span-3 sm:w-full">
        <AtPanel title="Зарплата" border-header>
          <div v-if="salariesLoading">
            <div v-for="i in 8" :key="i">
              <at-skeleton class="mb-2" type="row"></at-skeleton>
            </div>
          </div>
          <div v-else-if="salaries">
            <div class="max-h-80 overflow-y-auto -mx-6">
              <div class="py-2" v-for="salarySchedule in scheduleSalaries" :key="salarySchedule.id">
                <div v-if="salarySchedule.hidden == 0" class="flex py-1 justify-between px-4">
                  <p>${{ salarySchedule.amount }}</p>
                  <p v-if="salarySchedule.status == 'scheduled'" class="text-blue-500">Запланированная</p>
                </div>
                <p v-if="salarySchedule.hidden == 0" class="pb-4 text-gray-400 px-4 text-sm">
                  {{ $filters.formatDateByDayMonthYear(salarySchedule.start_date) }} -
                  {{ $filters.formatDistanceDate(salarySchedule.start_date) }}
                </p>
                <hr />
              </div>
              <div class="py-2" v-for="salaryActual in actualSalaries" :key="salaryActual.id">
                <div v-if="salaryActual.hidden == 0" class="flex py-1 justify-between px-4">
                  <p>${{ salaryActual.amount }}</p>
                  <p v-if="salaryActual.status == 'actual'" class="text-green-500">Текущая</p>
                </div>
                <p v-if="salaryActual.hidden == 0" class="pb-4 text-gray-400 px-4 text-sm">
                  {{ $filters.formatDateByDayMonthYear(salaryActual.start_date) }} -
                  {{ $filters.formatDistanceDate(salaryActual.start_date) }}
                </p>
                <hr />
              </div>
              <div class="py-2" v-for="archiveSalary in archivedSalaries" :key="archiveSalary.id">
                <div v-if="archiveSalary.hidden == 0" class="flex py-1 justify-between px-4">
                  <p>${{ archiveSalary.amount }}</p>
                </div>
                <p v-if="archiveSalary.hidden == 0" class="pb-4 text-gray-400 px-4 text-sm">
                  {{ $filters.formatDateByDayMonthYear(archiveSalary.start_date) }} -
                  {{ $filters.formatDistanceDate(archiveSalary.start_date) }}
                </p>
                <hr />
              </div>
            </div>
          </div>
          <div v-else>
            <at-alert>Нет данных</at-alert>
          </div>
        </AtPanel>
      </div>
      <div class="md:col-span-1 grid-cols-1 col-span-3 sm:w-full">
        <AtPanel title="Отпуски" border-header>
          <div v-if="vacation.loading">
            <div class="py-2" v-for="i in 5" :key="i">
              <at-skeleton type="row"></at-skeleton>
            </div>
          </div>
          <div
            class="divide-solid divide-gray-200 divide-y max-h-96 overflow-y-auto -mx-6"
            v-else-if="vacation.data?.length"
          >
            <div class="max-h-80 overflow-y-auto">
              <div class="py-1" v-for="vacations in vacation.data" :key="vacations.id">
                <div class="flex justify-between px-4">
                  <p>{{ vacations.type }}</p>
                  <p
                    v-if="
                      parseDateFormat(vacations.date_from) < parseDateFormat(new Date()) &&
                      parseDateFormat(vacations.date_to) > parseDateFormat(new Date())
                    "
                    class="text-green-500"
                  >
                    Актуальный
                  </p>
                </div>
                <p class="pb-4 px-4 text-gray-400 text-sm">
                  {{ parseDateFormat(vacations.date_from) }} -
                  {{ parseDateFormat(vacations.date_to) }}
                </p>
                <hr />
              </div>
            </div>
          </div>
          <div v-else>
            <div class="py-1">
              <at-alert class="mb-1 px-2">Нет данных</at-alert>
            </div>
          </div>
        </AtPanel>
      </div>
      <div class="md:col-span-1 grid-cols-1 col-span-3 sm:w-full">
        <AtPanel title="Доп. выходные дни" border-header>
          <div v-if="additionalDayOffs.loading">
            <div class="py-2" v-for="i in 5" :key="i">
              <at-skeleton type="row"></at-skeleton>
            </div>
          </div>
          <div
            class="divide-solid divide-gray-200 divide-y max-h-96 overflow-y-auto -mx-6"
            v-else-if="additionalDayOffs.data?.length"
          >
            <div class="max-h-80 overflow-y-auto">
              <div class="py-1" v-for="dayOffs in additionalDayOffs.data" :key="dayOffs.id">
                <div class="flex justify-between px-4">
                  <p>{{ dayOffs.reason }}</p>
                  <p class="py-1" v-if="dayOffs.used == 1">
                    <check-circle-icon class="w-5 h-5 text-green-800"></check-circle-icon>
                  </p>
                </div>
                <p class="pb-4 px-4 text-gray-400 text-sm">
                  {{ parseDateFormat(dayOffs.date) }}
                </p>
                <hr />
              </div>
            </div>
          </div>
          <div v-else>
            <div class="py-1">
              <at-alert class="mb-1 px-2">Нет данных</at-alert>
            </div>
          </div>
          <at-pagination
            v-if="additionalDayOffs.data?.last_page > 1"
            v-model="query.page"
            :total="additionalDayOffs.data?.last_page"
          ></at-pagination>
        </AtPanel>
      </div>
      <div class="md:col-span-1 grid-cols-1 col-span-3 sm:w-full">
        <AtPanel title="Предложенная зарплата" border-header>
          <div class="max-h-80 overflow-y-auto -mx-6">
            <div v-if="salariesLoading">
              <div v-for="i in 8" :key="i">
                <at-skeleton class="p-2" type="row"></at-skeleton>
              </div>
            </div>
            <div v-else-if="offerSalaries.length">
              <div class="py-2" v-for="offerSalary in offerSalaries" :key="offerSalary.id">
                <div class="flex py-1 justify-between px-4">
                  <p>${{ offerSalary.amount }}</p>
                </div>
                <p class="pb-4 text-gray-400 px-4 text-sm">
                  {{ $filters.formatDateByDayMonthYear(offerSalary.start_date) }} -
                  {{ $filters.formatDistanceDate(offerSalary.start_date) }}
                </p>
                <hr />
              </div>
            </div>
            <div class="px-4" v-else>
              <at-alert>Нет данных</at-alert>
            </div>
          </div>
        </AtPanel>
      </div>
    </template>
  </div>
</template>

<script>
  import { ChevronDoubleUpIcon, CheckIcon, CheckCircleIcon } from '@heroicons/vue/solid';
  import { getSalaries } from '~/services/salaries.api';
  import { useRoute } from 'vue-router';
  import useRouterReplace from '~/utils/hooks/useRouterReplace';
  import { parseErrorsFromResponse } from '~/utils/parsers';
  import { formatDateToLocaleString } from '~/utils/parsers';
  import { parseDateFormat } from '~/utils/filters/dateFilters';
  import AtPanel from '~/plugins/aliftech-ui/components/AtPanel/AtPanel';
  import AtPagination from '~/plugins/aliftech-ui/components/AtPagination/AtPagination';
  import AtBadge from '~/plugins/aliftech-ui/components/AtBadge/AtBadge';
  import AtSkeleton from '~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton';
  import AtAlert from '~/plugins/aliftech-ui/components/AtAlert/AtAlert';
  import { ref, reactive, watch } from 'vue';
  import { employeeVacations } from '~/services/employees.api';
  import { formatDistanceStrict } from 'date-fns';
  import { ru } from 'date-fns/locale';

  export default {
    name: 'ProfileColleaguesData',
    components: {
      AtAlert,
      ChevronDoubleUpIcon,
      CheckIcon,
      CheckCircleIcon,
      AtPanel,
      AtBadge,
      AtSkeleton,
      AtPagination,
    },
    props: {
      colleagueData: [Array, Object],
      additionalDayOffs: { Object },
      additionalDayOffsLoading: Boolean,
      loading: Boolean,
    },
    setup(props) {
      const colleague = ref({});
      const loading = ref(false);
      const salaries = ref({});
      const actualSalaries = ref([]);
      const scheduleSalaries = ref([]);
      const archivedSalaries = ref([]);
      const offerSalaries = ref([]);
      const salariesLoading = ref(true);
      const route = useRoute();
      const routerReplace = useRouterReplace();

      const query = ref({
        page: route.query.page || 1,
        per_page: 12,
      });

      const vacation = reactive({
        data: undefined,
        loading: true,
        error: [],
      });

      const additionalDayOffs = reactive({
        data: undefined,
        loading: true,
        error: [],
      });

      const employeeAdditionalDayOffs = () => {
        additionalDayOffs.data = props.additionalDayOffs;
        additionalDayOffs.loading = props.additionalDayOffsLoading;
        loading.value = props.loading;
      };

      employeeAdditionalDayOffs();

      getSalaries()
        .then(response => {
          salaries.value = response.data?.salaries;
          actualSalaries.value = response.data.salaries?.actual;
          scheduleSalaries.value = response.data.salaries?.scheduled;
          archivedSalaries.value = response.data.salaries?.archived;
          offerSalaries.value = response.data?.offer_salaries;
        })
        .finally(() => {
          salariesLoading.value = false;
        });

      employeeVacations()
        .then(response => (vacation.data = response.data))
        .catch(err => (vacation.error = parseErrorsFromResponse(err)))
        .finally(() => (vacation.loading = false));

      const colleaguePosition = reactive({
        data: null,
        loading: true,
        error: [],
      });

      const phoneTransformation = phone => {
        const countryCode = phone.substring(0, 3);
        const code = phone.substring(3, 5);
        const number1 = phone.substring(5, 8);
        const number2 = phone.substring(8, 10);
        const number3 = phone.substring(10, 12);
        return `+${countryCode} ${code} ${number1} ${number2} ${number3}`;
      };

      const getColleague = () => {
        colleague.value = props.colleagueData;
        colleague.value.positions = colleague.value?.positions?.reverse();
        loading.value = props.loading;
      };

      const formatDistanceBirthDay = colleague => {
        const date_now = new Date();
        const birth_date = new Date(colleague);
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

      getColleague();

      watch(query, () => employeeAdditionalDayOffs(), { deep: true });

      return {
        vacation,
        colleague,
        actualSalaries,
        scheduleSalaries,
        archivedSalaries,
        salariesLoading,
        offerSalaries,
        formatDateToLocaleString,
        formatDistanceBirthDay,
        parseDateFormat,
        colleaguePosition,
        route,
        routerReplace,
        salaries,
        query,
        phoneTransformation,
      };
    },
  };
</script>

<style scoped></style>
