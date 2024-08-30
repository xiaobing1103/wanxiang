<template>
	<z-paging>
		<template #top>
			<CommonHeader defindTitle="用户协议" />
		</template>

		<view class="pre">
			<MessageItem :content="init" />

		</view>
	</z-paging>

</template>

<script setup lang='ts'>
	import {
		onMounted,
		ref
	} from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue'
	import MessageItem from '@/components/CommonChat/MessageItem.vue';
	import {
		userInitData
	} from './data'
	const isH5 = ref(false)
	const init = ref(userInitData)
	onMounted(() => {


	})
</script>

<style lang="scss" scoped>
	.pre {
		padding: 50rpx;
		white-space: pre-wrap;
		font-family: monospace;
	}
</style>