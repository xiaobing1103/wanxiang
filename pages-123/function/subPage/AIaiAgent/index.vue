<template>
	<z-paging ref="pagingRef" :pagingStyle="{ background: 'rgb(246, 247, 249)',padding:'0 0rpx'}"
		:show-scrollbar=" false">
		<template #top>
			<CommonHeader defindTitle="智能体中心" />
		</template>
		<AiAgentTemplate />
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	import AiAgentTemplate from './aiAgentTemplate.vue'
</script>

<style scoped lang="scss">
</style>