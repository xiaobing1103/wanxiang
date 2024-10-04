<template>
	<view class="wrapper">
		<scroll-view :show-scrollbar="false" scroll-x style="flex-1">
			<view class="tooltip">
				<view v-for="(item,index) in rows" :key="index" class="row">
					<view v-for="(citem,cindex) in item" :key="cindex" :style="{background:citem.color}"
						class="toolip-item" @click="topath(citem.path)">
						<template v-if="citem.iconType == 'symbol'">
							<image class="toolip-item_images" :src="citem.url" mode=""></image>
						</template>
						<template v-if="citem.iconType == 'text'">
							<text>{{citem.icon}}</text>
						</template>
						<text class="name">{{citem.text}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	const topath = (path : string) => {
		uni.navigateTo({
			url: path
		})
	}
	const { $assets } = useGlobalProperties()
	interface ToolipItem {
		icon : string;
		text : string;
		color : string;
		path : string;
		url ?: string;
		iconType : 'text' | "symbol"
	}
	const tooTipList : ToolipItem[] = [
		{
			icon: '💯',
			text: 'AI长论文写作',
			color: '#ECF7EF',
			path: '/pages/function/subPage/longText/index',
			iconType: "text",

		},
		{
			icon: 'ppt',
			text: '一键生成PPT',
			color: '#FCF2E7',
			url: $assets.pptIcon,
			path: '/pages/function/subPage/ppt/index',
			iconType: "symbol"
		},
		{
			icon: 'human',
			text: '图片转卡通',
			color: '#EEF5FD',
			url: $assets.img2cartoonIcon,
			path: '/pages/draw/subPage/image2cartoon/index',
			iconType: "symbol"
		},
		{
			icon: 'hl',
			text: 'AI换脸',
			color: '#FCEDF2',
			url: $assets.AiChangeFace,
			path: '/pages/draw/subPage/aiFaceSwapping/index',
			iconType: "symbol"
		},
		{
			icon: 'xz',
			text: 'AI写真',
			color: '#FCF2E7',
			url: $assets.AishaShiIcon,
			path: '/pages/draw/subPage/aiPhotoShoots/index',
			iconType: "symbol"
		},
		{
			icon: '💼',
			text: '工作总结',
			color: '#FCF2E7',
			path: '/pages/function/subPage/AiDailyModel/index',
			iconType: "text"
		},
		{
			icon: '🌈',
			text: '线稿上色',
			color: '#ECF7EF',
			path: '/pages/draw/subPage/coloringLineArt/index',
			iconType: "text"
		},
		{
			icon: '🧠',
			text: '思维导图',
			color: '#EEF5FD',
			path: '/pages/function/subPage/AImapping/index',
			iconType: "text"
		}
	]

	const rows = computed<Array<ToolipItem[]>>(() => {
		const middle = Math.ceil(tooTipList.length / 2)
		const firstArray = tooTipList.slice(0, middle)
		const secondArray = tooTipList.slice(middle)
		return [firstArray, secondArray]
	})
</script>

<style scoped lang="scss">
	.wrapper {
		width: 100%;
		margin-top: 10rpx;
		display: flex;

		.tooltip {
			display: flex;
			flex-wrap: wrap;

			.row {
				flex-shrink: 0;
				display: flex;
				flex-wrap: nowrap;
			}

			.toolip-item {
				padding: 10rpx 20rpx;
				margin: 10rpx;
				align-items: center;
				justify-content: center;
				display: flex;
				flex-shrink: 0;
				font-size: 20rpx;
				border-radius: 40rpx;

				&_images {
					width: 25rpx;
					height: 25rpx;
				}

				.name {
					display: block;
					margin-left: 5rpx;
				}
			}
		}
	}
</style>