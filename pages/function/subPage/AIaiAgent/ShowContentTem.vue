<template>
	<view class="HotContent" @click="toAiagent(assistant_id)">
		<view v-if="hotColor" class="HotContent_swiperPosition"
			:style="{color:hotTextColor|| 'white',background:hotColor||''}">
			{{index +1 }}
		</view>
		<view class="HotContent_icon">
			<image class="HotContent_icon_image" :src="avatar" mode=""></image>
		</view>
		<view class="HotContent_right">
			<view class="HotContent_title">
				{{name}}
			</view>
			<view class="HotContent_desc">
				{{description}}
			</view>
			<view class="HotContent_tips">
				<template v-for="(tip,index) in tags" :key="index">
					<view class="HotContent_tips_tip">
						{{tip.label}}
					</view>
				</template>
			</view>
		</view>

	</view>


</template>

<script setup lang="ts">
	const props = defineProps<{ assistant_id : string, index : number, name : string, description : string, avatar : string, tags : { label : string }[], hotTextColor ?: string, hotColor ?: string }>()
	const toAiagent = (id : string) => {
		uni.navigateTo({
			url: `/pages/function/subPage/AIaiAgent/mainPages?id=${id}`
		})
	}
</script>

<style scoped lang="scss">
	.HotContent {
		position: relative;
		display: flex;
		font-size: 24rpx;
		justify-content: flex-start;
		background-color: #fff;
		box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
		align-items: center;
		border-radius: 20rpx;
		padding: 10rpx;
		margin: 20rpx 5rpx;

		&_swiperPosition {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 10;
			padding: 10rpx;
			border-radius: 20rpx 0rpx 20rpx 0rpx;
		}

		&_icon {
			// padding: 10rpx 0;

			&_image {
				width: 200rpx;
				height: 200rpx;
				border-radius: 20rpx;
			}
		}


		&_right {
			height: 200rpx;
			padding: 0 15rpx;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
		}

		&_title {
			padding-bottom: 10rpx;
			font-size: 30rpx;
			white-space: nowrap;
			overflow: hidden;
			width: 280rpx;
			text-overflow: ellipsis;
			font-weight: 900;
		}

		&_desc {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			/* 限制为两行 */
			overflow: hidden;
			text-overflow: ellipsis;
			/* 设置盒子的宽度，可以根据需要调整 */

		}

		&_tips {
			width: 100%;
			display: flex;
			padding: 20rpx 0;

			&_tip {

				font-size: 20rpx;
				display: flex;
				justify-content: center;
				background-color: #e8e8e8;
				margin: 5rpx;
				padding: 5rpx;
				border-radius: 10rpx;
			}
		}
	}
</style>