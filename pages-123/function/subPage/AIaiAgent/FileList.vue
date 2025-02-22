<template>
	<view class="FileList">
		<template v-if="list.length > 0">
			<template v-for="(items,index) in list" :key="index">
				<view class="FileList_Items">
					<image class="FileList_Items_image" :src="FileIconMap[items.type]" mode=""></image>
					<view class="FileList_Items_textBox">
						<text class="FileList_Items_name">{{items.name}}</text>
						<text class="FileList_Items_message">{{items.message}}</text>
					</view>
				</view>
			</template>
		</template>
	</view>
</template>

<script setup lang="ts">
	import { FileItem } from '@/store/aiAgentChats'
	import { FileIconMap } from './datas'
	interface Props {
		close ?: boolean
		list : FileItem[]
		onReset ?: (index : number) => void
		onDelete ?: (index : number) => void
	}
	const props = defineProps<Props>()
</script>

<style scoped lang="scss">
	.FileList {
		display: flex;
		font-size: 25rpx;
		overflow: hidden;
		margin-top: 10rpx;
		&_Items {
			padding: 10rpx;
			border-radius: 10rpx;
			background-color: rgb(243, 244, 246);
			width: 200rpx;
			min-width: 200rpx;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			margin-right: 10rpx;

			&_textBox {
				display: flex;
				flex-direction: column;
				margin-left: 5rpx;
				overflow: hidden;
			}

			&_image {
				width: 30rpx;
				height: 30rpx;
				min-width: 30rpx;
				min-height: 30rpx;
			}

			&_name {

				max-width: 150rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: clip;
				text-overflow: ellipsis;

			}

			&_message {
				color: #bcbcbc;
				font-size: 18rpx;
			}
		}
	}
</style>