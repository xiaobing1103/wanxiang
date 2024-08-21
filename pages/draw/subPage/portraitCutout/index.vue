<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<CommonHeader defindPath="/pages/draw/index"/>
		</template>
		<!-- 对话框 -->
		<!-- v-model:itemMessages="itemMessages" -->
		fdsfds

		<template #bottom>
			<!-- 气泡选择 -->
			dsfds
			<!-- 聊天输入框 -->
			fdsfds
			<!-- <up-input v-model="chatValue" @changeData="changeData">修改子组件的数据</up-input> -->
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue'
</script>

<style lang="scss">
</style>