<template>
  <AtNavbar
    class="xl:px-32 w-full z-0"
    style="position: sticky; z-index: 0"
    :nav-links="navLinks"
    in-container
    :user="user"
    :logo="logo"
    @logout="logout"
  />
  <div class="w-full min-h-screen bg-gray-50">
    <div v-if="$route.name === 'profile'">
      <img class="max-h-58 w-full object-cover h-48" :src="profileBgImage" alt="Profile background image" />
    </div>
    <div class="xl:px-32">
      <div class="container mx-auto px-4 pt-8">
        <div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineAsyncComponent, computed, ref } from 'vue';
  import { useStore } from 'vuex';
  import logoTeam from '~/assets/img/logo.svg';
  import profileBgImage from '~/assets/img/profile_bg_image.png';

  export default {
    name: 'AppLayout',
    components: {
      AtNavbar: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtNavbar/AtNavbar')),
    },
    setup() {
      const navLinks = ref([
        { title: 'Моя команда', to: { name: 'home' }, exact: true },
        { title: 'Профиль', to: { name: 'profile' } },
        { title: 'Все коллеги', to: { name: 'colleagues' } },
        { title: 'Опросы', to: { name: 'surveys' } },
      ]);
      const logo = ref({
        name: 'Team',
        path: logoTeam,
      });
      const store = useStore();
      store.dispatch('core/getEmployeeData');
      function logout() {
        store.dispatch('auth/logout');
      }
      return { navLinks, user: computed(() => store.state.auth.user), logo, logout, logoTeam, profileBgImage };
    },
  };
</script>
