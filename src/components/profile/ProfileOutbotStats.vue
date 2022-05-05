<script setup>
  import { defineAsyncComponent, defineProps } from 'vue';
  import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/solid';

  const AtStats = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtStats/AtStats'));
  const AtStatsValue = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtStatsValue/AtStatsValue'));
  const props = defineProps({
    title: String,
    outbotData: Object,
  });
</script>

<template>
  <div class="col-span-4 md:col-span-2 lg:col-span-1">
    <AtStats :title="props.title" icon="users">
      <template #value>
        <AtStatsValue>
          <div v-if="(props.outbotData.curr - props.outbotData.prev) > 0" class="flex items-end -m-0.5">
            <p class="p-0.5">{{ props.outbotData.curr }} раза</p>
            <p class="p-0.5"><arrow-up-icon class="w-4 h-4 text-red-500"></arrow-up-icon></p>
            <p class="text-base p-0.5 leading-4 text-red-500">{{ Math.abs(props.outbotData.curr - props.outbotData.curr) }}</p>
          </div>
          <div class="flex items-end -m-0.5" v-else>
            <p class="p-0.5">{{ props.outbotData.curr }} раза</p>
            <p class="p-0.5"><arrow-down-icon class="w-4 h-4 text-green-500"></arrow-down-icon></p>
            <p class="text-base p-0.5 leading-4 text-green-500">{{ Math.abs(props.outbotData.curr - props.outbotData.prev) }}</p>
          </div>
        </AtStatsValue>
      </template>
    </AtStats>
  </div>
</template>
