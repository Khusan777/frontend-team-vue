<template>
  <div class="w-full flex justify-center items-center">
    <AtLoginPage
      @login="loginFunc"
      v-model:phone="user.phone"
      v-model:password="user.password"
      v-model:remember-me="user.remember_me"
      :title-logo="TeamLogo"
      :submitLoading="loading"
    />
  </div>
</template>
<script>
  import { defineAsyncComponent, defineComponent, inject, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { login } from '~/services/auth.api';
  import logo from '~/assets/img/logo.svg';

  export default defineComponent({
    name: 'AuthPage',
    components: {
      AtLoginPage: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtLoginPage/AtLoginPage')),
    },
    setup() {
      let loading = ref(false);
      const TeamLogo = ref({
        path: logo,
        name: 'Team',
      });
      const user = ref({
        phone: '',
        password: '',
        remember_me: true,
        app: 'Client',
      });
      const router = useRouter();

      const $toast = inject('$toast');
      const loginFunc = () => {
        loading.value = true;
        login(user.value)
          .then(() => {
            router.push({ name: 'profile' });
          })
          .catch(error => {
            if (error.response.status === 401) {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            } else {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            }
          })
          .finally(() => (loading.value = false));
      };
      return {
        loading,
        user,
        loginFunc,
        TeamLogo,
      };
    },
  });
</script>
