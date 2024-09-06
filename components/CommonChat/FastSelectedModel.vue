<template>
	<view class="fastSeleted">
		<view class="buttonBox" v-for="(item,index) in allTags" :key="index">
			<view class="buttonBox_box" :style="{background: '#'+ item.bgColor}">
				<view class="icon">
					<span class="icon_textIcon" v-if="item.icon">{{item.icon}}</span>
					<image class="icon_imageIcon" v-if="item.src" :src="item.src"></image>

				</view>
				<view class="text">
					<span>{{item.text}}</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import ppt from '@/static/ppt.svg'
	import anime from '@/static/anime.svg'
	import changeFace from '@/static/changeFace.svg'
	import changeCloles from '@/static/changeCloles.svg'
	const allTags = [{
			text: 'AI长论文写作',
			icon: '💯',
			bgColor: 'ECF7EF',
			path: "/pages/function/subPage/longText/index"
		},
		{
			text: '一键生成PPT',
			src: ppt,
			bgColor: 'FCF2E7',
			path: "/pages/function/subPage/ppt/index"
		},
		{
			text: '图片转卡通',
			src: anime,
			bgColor: 'EEF5FD',
			path: "/pages/function/subPage/longText/index"
		},
		{
			text: 'AI换脸',
			src: changeFace,
			bgColor: 'FCEDF2'
		},
		{
			text: 'AI图表生成',
			icon: '📊',
			bgColor: 'ECF7EF'
		},
		{
			text: 'AI写真',
			src: changeCloles,
			bgColor: 'FCF2E7'
		}
	]
</script>

<style scoped lang="scss">
	.fastSeleted {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		box-sizing: border-box;
		grid-gap: 50rpx;
		overflow-x: scroll;
	}

	.buttonBox {
		height: 40rpx;
		width: max-content;

		&_box {
			display: flex;
			font-size: 20rpx;
			padding: 20rpx;
			border-radius: 15rpx;
			box-sizing: border-box;
			align-items: center;
		}

		.icon {
			max-height: 40rpx;

			&_textIcon {
				max-height: 30rpx;
				max-width: 100rpx;
				margin-right: 10rpx;
				display: flex;
				align-items: center;
			}

			&_imageIcon {
				max-height: 30rpx;
				max-width: 30rpx;
				margin-right: 10rpx;
				display: flex;
				align-items: center;
			}

		}

		.text {
			width: max-content;
		}
	}

	.fastSeleted {
		padding: 20rpx;
		box-sizing: border-box;

	}
</style>