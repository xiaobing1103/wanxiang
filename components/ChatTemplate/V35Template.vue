<template>
	<view>
		<view class="V35Template">
			👋你好啊，我是{{AppStrName}}AI,很高兴认识你！我可厉害了😎 对话、绘画、写作什么的统统不在话下，想试试吗？
		</view>
		<ChatMenuTooltip />
	</view>
</template>

<script lang="ts" setup>
	import { AppStrName } from '@/http';
	import ChatMenuTooltip from '@/components/CommonChat/ChatMenuTooltip.vue'
	// const props = defineProps<{ onFun : () => void, onTemplates : () => void }>()
	// console.log(props)
</script>

<style scoped>
	.V35Template {
		background-color: white;
		padding: 15rpx;
		border-radius: 10rpx;
	}
</style>