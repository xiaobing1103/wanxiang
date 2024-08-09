<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<CommonHeader />
		</template>
		<!-- 对话框 -->
		<!-- v-model:itemMessages="itemMessages" -->
		<view class="body">
			<CommonTitle title="文字生成图片" desc="在线AI绘画,创作你的专属作品" />
			<CommonDrawTem />
		</view>

		<template #bottom>
			<!-- 气泡选择 -->

			<!-- 聊天输入框 -->

			<!-- <up-input v-model="chatValue" @changeData="changeData">修改子组件的数据</up-input> -->
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue'
	import CommonTitle from '@/components/CommonTitle.vue'
	import CommonDrawTem from "../../components/CommonDrawTem"
</script>

<style lang="scss" scoped>
	.body {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}
</style>