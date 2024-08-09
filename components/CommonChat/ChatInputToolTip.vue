<template>
	<view class="tip-con">
		<view @click="refershList" class="tools">
			<view class="tools-item">
				<text class="more-text">换一换</text>
				<up-icon name="reload" color="#2979ff" size="18"></up-icon>
			</view>
		</view>
		<scroll-view :show-scrollbar="false" style="flex-1" scroll-x>
			<view class="tip-wrapepr">
				<view @click="onTipChange(item)" v-for="(item,index) in tipList" :key="index" class="toolip-item">
					<view class="title">
						<image style="width: 25rpx;height:25rpx" :src="iconUrl()"></image>
						<text class="title-text" style="margin-left: 6rpx;">{{item.title}}</text>
					</view>
					<text class="content">{{item?.prompt && textContent(item?.prompt)}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { onMounted, ref, computed } from 'vue';
	import { getRandomInt } from '@/utils/index'
	// import Api from '@/api/api'
	import { useGlobalProperties } from '../../hooks/useGlobalHooks';
	import { ToolTipItem } from '../../type/userTypes';

	const IconArr : string[] = [
		'http://file.1foo.com/2023/11/30/93cb43c66866d425b4d38c26afbd81c2.png',
		'http://file.1foo.com/2023/11/30/076d5275f04127103d4f5bfdc4429784.png',
		'http://file.1foo.com/2023/11/30/8ee944311f04b9d4d75036cebcfc9dbe.png',
		'http://file.1foo.com/2023/11/30/9588e16ceaccf40feaa88ae4f7ba33f9.png'
	]
	const page = ref(0)//当前页
	const maxPage = ref(50)//最大页码数
	const tipList = ref<ToolTipItem[]>([])//tips列表
	const { $api } = useGlobalProperties()
	//自定义事件
	const emits = defineEmits<{
		(e : 'change', val : ToolTipItem) : void
	}>()

	//格式化内容
	const textContent = computed(() => {
		return (text : string) => {
			return text.slice(0, 20) + '...'
		}
	})
	//刷新列表
	const refershList = () => {
		page.value = getRandomInt(0, maxPage.value)
		getTips()
	}
	//获取tips
	const getTips = async () => {
		const res = await $api.post('api/v1/chat2/getModels',
			{
				url: "getOfficialModels",
				page: page.value,
				keyword: ""
			}
		)
		// const res = await Api.getModels({
		// 	url: "getOfficialModels",
		// 	page: page.value,
		// 	keyword: ""
		// })
		console.log(res.data)
		tipList.value = res.data as ToolTipItem[]
	}
	//点击事件
	const onTipChange = (item : ToolTipItem) => {
		emits('change', item)
	}
	//获取图标
	const iconUrl = () => {
		const index = getRandomInt(0, 3)
		return IconArr[index]
	}
	onMounted(() => {
		getTips()
	})
</script>

<style lang="scss" scoped>
	.tip-con {
		display: flex;
		width: 100%;
		margin-bottom: 20rpx;
		flex-direction: column;

		.tools {
			font-size: 22rpx;
			display: flex;
			justify-content: flex-end;
			padding-bottom: 5rpx;

			.tools-item {
				display: flex;

				.more-text {
					margin-right: 10rpx;
				}
			}
		}

		.tip-wrapepr {
			display: flex;
			flex-wrap: nowrap;
			gap: 20rpx;

			.toolip-item {
				width: 200rpx;
				height: 90rpx;
				overflow: hidden;
				border-radius: 20rpx;
				padding: 6rpx 10rpx;
				display: flex;
				justify-content: center;
				flex-shrink: 0;
				flex-direction: column;
				background: white;

				.title {
					font-size: 22rpx;
					display: flex;
					align-items: center;

					.title-text {
						max-width: 150rpx;
						padding-bottom: 10rpx;
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
					}
				}

				.content {
					white-space: nowrap;
					overflow: hidden;
					display: block;
					max-width: 160rpx;
					font-size: 20rpx;
					text-overflow: ellipsis
				}
			}
		}
	}
</style>