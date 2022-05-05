<script setup>
  import { defineAsyncComponent, computed } from 'vue';
  import { useStore } from 'vuex';

  const HomePage = defineAsyncComponent(() => import('~/pages/home/HomePage'));
  const HomePageManager = defineAsyncComponent(() => import('~/pages/home/HomePageManager'));

  const store = useStore();

  const user = computed(() => store.state.auth.user);
  const currentComponent = computed(() =>
    user.value?.roles.find(item => item.name === 'Team Manager') ? HomePageManager : HomePage
  );
</script>

<template>
  <component :is="currentComponent"></component>
</template>
