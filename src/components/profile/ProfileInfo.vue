<script setup>
  import { defineAsyncComponent, defineProps } from 'vue';
  import useUserAvatar from '~/utils/hooks/useUserAvatar';
  const getUserAvatar = useUserAvatar().getUserImage;
  const props = defineProps({
    user: {
      type: Object,
    },
    manager: {
      type: Boolean,
      default: null,
    },
  });

  const AtButton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtButton/AtButton'));
  const FeedBackToCompanyModal = defineAsyncComponent(() => import('~/components/profile/FeedBackToCompanyModal'));
</script>

<template>
  <div class="flex md:flex-row flex-col justify-start mb-4">
    <img
      v-img-loader
      class="-mt-32 h-48 md:ml-0 mx-auto mb-1 w-48 object-cover border-8 border-gray-50 rounded block"
      :src="getUserAvatar(props.user)"
      :alt="props.user.name"
    />
    <div>
      <h1 class="text-3xl text-black font-bold md:text-left text-center md:-mt-6 ml-4 py-1">
        {{ props.user?.name }}
      </h1>
      <div class="md:text-left text-center mb-2" v-if="!props.user?.positions?.length">
        <span class="text-gray-400 text-xl ml-4">У вас нет позиций</span>
      </div>
      <div v-else>
        <div
          class="text-gray-400 text-base md:text-left text-center mb-1 ml-4"
          v-for="position in props.user?.positions"
          :key="position.id"
        >
          <div class="-mt-1 mr-2" v-if="position.pivot.current === 1">
            {{ position.name }}
            <span v-for="team in props.user?.teams" :key="team.id" class="text-blue-500 -mt-7 capitalize ml-1">
              {{ team.projects.map(p => p.name).join(', ') }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex md:flex-row justify-end flex-grow flex-col whitespace-nowrap">
      <feed-back-to-company-modal class="md:mr-2 mr-0"></feed-back-to-company-modal>
      <a class="md:mt-0 mt-2" @click.stop href="https://id.alifshop.uz/welcome" target="_blank">
        <AtButton class="md:col-span-3 lg:col-span-3" size="sm" icon="shieldCheck" :block="true" color="primary"
          >Изменить пароль</AtButton
        >
      </a>
    </div>
  </div>
</template>
