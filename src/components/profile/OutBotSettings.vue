<template>
  <div class="pb-4">
    <div class="mt-6 text-black font-medium">
      <h1 class="text-xl text-black font-medium">Настройка OutBot</h1>
    </div>
    <div class="grid grid-cols-4 gap-4 pb-4">
      <div v-if="employeesLoading" class="md:col-span-2 col-span-4 mt-6">
        <AtTable class="max-h-96 overflow-y-auto" :elements="loadingArray">
          <template v-slot:header>
            <h1 class="text-sm text-black font-bold">Чьи уведомления мне доступны</h1>
          </template>
          <template #element>
            <at-table-item>
              <at-skeleton type="row"></at-skeleton>
            </at-table-item>
          </template>
        </AtTable>
      </div>
      <div v-if="!employeesLoading" class="md:col-span-2 col-span-4 mt-6 max-h-96 overflow-y-auto">
        <AtTable class="max-h-96 overflow-y-auto" :elements="whoCanISeeEmployee">
          <template v-slot:header>
            <h1 class="text-sm text-black font-bold">Чьи уведомления мне доступны</h1>
          </template>
          <div v-if="!whoCanISeeEmployee.length">
            <p>Пусто</p>
          </div>
          <template #element="{ element }">
            <at-table-item>
              {{ element.name }}
            </at-table-item>
            <at-table-item>
              <span>{{ element.teams.join(', ') }}</span>
            </at-table-item>
          </template>
        </AtTable>
      </div>
      <div v-if="employeesLoading" class="md:col-span-2 col-span-4 max-h-96 overflow-y-auto mt-6">
        <AtTable class="max-h-96 overflow-y-auto" :head="messagesTableHead" :elements="loadingArray">
          <template v-slot:header>
            <h1 class="text-sm text-black font-bold">Добавлены вручную</h1>
          </template>
          <template #element>
            <at-table-item>
              <at-skeleton type="row"></at-skeleton>
            </at-table-item>
            <at-table-item>
              <at-skeleton type="row"></at-skeleton>
            </at-table-item>
          </template>
        </AtTable>
      </div>
      <div v-if="!employeesLoading" class="md:col-span-2 col-span-4 max-h-96 overflow-y-auto mt-6">
        <AtTable
          class="max-h-96 overflow-y-auto"
          :head="[{ title: 'Имя' }, { title: 'Команда' }]"
          :elements="employeesOutbotViewable || manualEmployees"
        >
          <template v-slot:header>
            <h1 class="text-sm text-black font-bold">Добавлены вручную</h1>
          </template>
          <template #element="{ element }">
            <at-table-item>
              {{ element?.name }}
            </at-table-item>
            <at-table-item>
              <span>{{ element?.teams.join(', ') }}</span>
            </at-table-item>
            <at-table-item>
              <x-circle-icon
                @click="openModal(element?.id, element?.name)"
                class="w-5 h-6 text-red-600 cursor-pointer"
              ></x-circle-icon>
            </at-table-item>
          </template>
          <template v-slot:footer>
            <div class="flex justify-end">
              <AtButton @click="modal = true" color="primary">Добавить доступ</AtButton>
            </div>
          </template>
        </AtTable>
      </div>
    </div>
  </div>

  <AtModal v-model="modalDelete" title="Удалить доступ">
    <div class="mt-4 mb-4">
      <p>Вы точно хотите удалить доступ для {{ employee.name }}</p>
    </div>
    <div class="flex space-x-3 mt-3">
      <AtButton class="w-full p-4" @click="modalDelete = false">Отмена</AtButton>
      <AtButton
        class="w-full p-4"
        :loading="outbotLoading"
        @click="deleteEmployeeOutbotAccess(employee.id)"
        color="primary"
      >
        Удалить
      </AtButton>
    </div>
  </AtModal>
  <AtModal v-model="modal" title="Настройки бота">
    <div class="mt-4 mb-4">
      <at-multiselect :options="colleagues || allColleagues" v-model="dataListValue" value-print="name">
      </at-multiselect>
    </div>
    <div class="flex space-x-3 mt-3">
      <AtButton class="w-full p-4" @click="modal = false">Отмена</AtButton>
      <AtButton class="w-full p-4" :loading="outbotLoading" @click="addOutBotAccess" color="primary">
        Сохранить
      </AtButton>
    </div>
  </AtModal>
</template>

<script>
  import { defineAsyncComponent, reactive, ref } from 'vue';
  import { outbotAcceess, setOutbotAcceess, deleteOutbotAcceess } from '~/services/outbotacceess.api';
  import { $toast } from '~/main';
  export default {
    name: 'OutBotSettings',
    props: {
      userId: Number,
    },
    components: {
      XCircleIcon: defineAsyncComponent(() => import('@heroicons/vue/solid/XCircleIcon')),
      AtTable: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTable/AtTable')),
      AtTableItem: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTableItem/AtTableItem')),
      AtSkeleton: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton')),
      AtButton: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtButton/AtButton')),
      AtMultiselect: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtMultiselect/AtMultiselect')),
      AtModal: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtModal/AtModal')),
    },
    setup(props) {
      let modalDelete = ref(false);
      let modal = ref(false);
      const outbotLoading = ref(false);
      const loadingArray = ref(Array(8).fill(1));
      const dataListValue = ref([]);
      const whoCanISeeEmployee = ref([]);
      const manualEmployees = ref([]);
      const colleagues = ref([]);
      const allColleagues = ref([]);
      const messagesTableHead = [{ title: 'Менеджер' }, { title: 'Команда' }];
      const employeesOutbotViewable = ref([]);
      const employeesLoading = ref(true);

      const employee = reactive({
        name: null,
        id: null,
      });

      const openModal = (employeeId, employeeName) => {
        employee.name = employeeName;
        employee.id = employeeId;
        modalDelete.value = true;
      };

      const deleteEmployeeOutbotAccess = id => {
        outbotLoading.value = true;
        deleteOutbotAcceess(id)
          .then(() => {
            $toast.show({
              title: 'Успешно',
              subTitle: 'Успешно удалено',
              type: 'success',
            });
          })
          .finally(() => {
            modalDelete.value = false;
            outbotLoading.value = false;
            getEmployeesOutBotAccesses();
          });
      };

      const getEmployeesOutBotAccesses = async () => {
        employeesLoading.value = true;
        await outbotAcceess({ employee_id: props.userId })
          .then(res => {
            whoCanISeeEmployee.value = res?.data?.who_can_I_see;
            manualEmployees.value = res?.data?.who_can_see_me?.manual;
            employeesOutbotViewable.value = res?.data?.who_can_see_me?.default?.concat(manualEmployees.value);
            allColleagues.value = res?.data?.employees;
            colleagues.value = res?.data.employees
              .filter(s => s.is_viewable == false)
              .map(item => ({
                name: item.employee,
                value: item.id,
              }));
            dataListValue.value = res.data?.who_can_see_me?.manual?.map(item => ({
              name: item.name,
              value: item.id,
            }));
          })
          .finally(() => {
            employeesLoading.value = false;
          });
      };

      getEmployeesOutBotAccesses();

      const addOutBotAccess = () => {
        outbotLoading.value = true;
        if (dataListValue.value?.length) {
          setOutbotAcceess({ employee_ids: dataListValue.value })
            .then(() => {
              $toast.show({
                title: 'Успешно',
                subTitle: 'Успешно сохранён',
                type: 'success',
              });
            })
            .finally(() => {
              modal.value = false;
              outbotLoading.value = false;
              getEmployeesOutBotAccesses();
            });
        } else {
          $toast.show({
            title: 'Ошибка',
            subTitle: 'Выберите сотрудника',
            type: 'error',
          });
          modal.value = false;
          outbotLoading.value = false;
        }
      };
      return {
        modalDelete,
        openModal,
        modal,
        colleagues,
        dataListValue,
        messagesTableHead,
        employeesOutbotViewable,
        props,
        addOutBotAccess,
        getEmployeesOutBotAccesses,
        deleteEmployeeOutbotAccess,
        employeesLoading,
        employee,
        loadingArray,
        outbotLoading,
        allColleagues,
        whoCanISeeEmployee,
        manualEmployees,
      };
    },
  };
</script>

<style scoped></style>
