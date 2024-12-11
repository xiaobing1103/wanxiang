<template>
	<view class="msg">
		<view class="content">
			{{msg.content}}
		</view>
		<template v-if="msg.files?.length>0">
			<view class="filelist">
				<FileList :list="msg.files" />
			</view>
		</template>
	</view>
</template>

<script setup lang="ts">
	import { AChat } from '@/store/aiAgentChats';
	import FileList from './FileList';

	interface Props {
		msg : AChat.UserMessageItem
	}
	const props = defineProps<Props>()
</script>

<style scoped lang="scss">
	.msg {
		display: flex;
		flex-direction: column;
		max-width: 95%;
		width: max-content;
		min-width: 100rpx;
		border-radius: 15rpx;
		background-color: rgb(74, 222, 128, 0.8);
		padding: 15rpx;
		margin: 15rpx 0;
		margin-left: auto;
	}
</style>