<template>
  <div class="px-3 w-80">
    <span class="font-bold text-lg">Дни рождения</span>
    <div class="grid grid-cols-1">
      <router-link
        v-for="bday of colleaguesBirthDay"
        :key="bday.id"
        :to="{ name: 'colleagues.detail', params: { id: bday.id } }"
      >
        <div
          class="
            my-3
            relative
            rounded-lg
            flex
            items-center
            space-x-3
            focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500
          "
        >
          <div class="flex-shrink-0">
            <img
              class="h-10 w-10 rounded-full object-cover bg-gray-300"
              :src="getUserImage(bday)"
              @error="getUserImage(bday, $event)"
              :alt="bday.name"
            />
          </div>
          <div class="flex-1 min-w-0">
            <span class="absolute inset-0" aria-hidden="true"></span>
            <p class="text-sm font-medium text-gray-900">{{ bday.name }}</p>
            <p v-if="!getColleagueNotificationBirthDate(bday.birth_date)" class="text-sm text-gray-500 truncate">
              {{ formatDateToLocaleString(bday.birth_date) }}
            </p>
            <div v-if="getColleagueNotificationBirthDate(bday.birth_date)">
              <p class="text-red-600">Сегодня</p>
            </div>
            <div v-else-if="getColleagueNotificationTomorrowBirthDate(bday.birth_date)">
              <p class="text-green-600">Завтра</p>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <div class="font-medium text-indigo-600 cursor-pointer" @click="showAllBirthDays = !showAllBirthDays">
      <span>{{ !showAllBirthDays ? 'Показать весь список' : 'Скрыть список' }}</span>
    </div>
  </div>
</template>

<script>
  import { computed, ref } from 'vue';
  import { formatDateToLocaleString } from '~/utils/parsers';
  import useUserAvatar from '~/utils/hooks/useUserAvatar';

  export default {
    name: 'ColleaguesBirthDay',
    props: {
      birthDays: { type: Array, default: () => [] },
    },
    setup(props) {
      const userAvatar = useUserAvatar();
      let showAllBirthDays = ref(false);
      let colleaguesBirthday = ref([]);
      const colleaguesBirthDay = computed(() => {
        return !showAllBirthDays.value && props.birthDays.length >= 5 ? props.birthDays.slice(0, 6) : props.birthDays;
      });

      const getColleagueNotificationBirthDate = birth_date => {
        const dateOfBirth = new Date(birth_date);
        const dateNow = new Date();
        return dateNow.getDate() === dateOfBirth.getDate() && dateOfBirth.getMonth() === dateNow.getMonth();
      };

      const getColleagueNotificationTomorrowBirthDate = birth_date => {
        const dateOfBirth = new Date(birth_date);
        const dateNow = new Date();
        return dateNow.getDate() + 1 === dateOfBirth.getDate() && dateOfBirth.getMonth() === dateNow.getMonth();
      };

      return {
        showAllBirthDays,
        colleaguesBirthDay,
        getUserImage: userAvatar.getUserResizedImage,
        colleaguesBirthday,
        getColleagueNotificationBirthDate,
        getColleagueNotificationTomorrowBirthDate,
      };
    },
    methods: {
      formatDateToLocaleString,
    },
  };
</script>

<style scoped></style>
