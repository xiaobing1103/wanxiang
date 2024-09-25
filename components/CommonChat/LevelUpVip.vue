<template>
	<up-overlay zIndex="999999" v-if="ChatStore.showlevelUpVip" :show=" ChatStore.showlevelUpVip">
		<view class="levelUpVip">

			<view class="levelUpVip_over">
				<view class="levelUpVip_closeBox">
					<view class="levelUpVip_closeBox_closeIcon">
						<up-icon @click="closeOverLay" size='20' name="close"></up-icon>
					</view>

				</view>
				<view class="levelUpVip_header">
					<view class="levelUpVip_header_title">
						升级会员
					</view>
				</view>
				<view class="levelUpVip_main" @click="toVipPath">
					{{
					ChatStore.showLevelUpVipContent
				}}
				</view>
				<view class="levelUpVip_footer">
					<view class="levelUpVip_footer_leftBox" @click="closeOverLay">
						取消
					</view>
					<view class="levelUpVip_footer_rightBox" @click="toVipPath">
						确认
					</view>
				</view>
			</view>
		</view>
	</up-overlay>
	<!-- 	<up-modal showCancelButton @cancel="ChatStore.setShowlevelUpVip(false)" @confirm="toVipPath" title="升级会员"
		:content='ChatStore.showLevelUpVipContent'></up-modal> -->
</template>

<script setup lang="ts">
	import { useChatStore } from '@/store';
	const ChatStore = useChatStore();
	const toVipPath = () => {
		const tabbarPages = ['/pages/function/index', '/pages/index/index', '/pages/draw/index', '/pages/my/index']
		const pages = getCurrentPages(); // 获取页面栈
		const currentPage = pages[pages.length - 1]; // 获取当前页面对象
		const currentRoute = '/' + currentPage.route; // 获取当前页面路径
		if (tabbarPages.includes(currentRoute)) {
			uni.showTabBar({
				success: () => {
					ChatStore.setShowlevelUpVip(false)
					uni.navigateTo({
						url: '/pages/my/subPage/vip/index'
					})
				}
			})
		} else {
			uni.navigateTo({
				url: '/pages/my/subPage/vip/index'
			})
		}

	}
	const closeOverLay = () => {
		ChatStore.setShowlevelUpVip(false)
		uni.showTabBar({
			success: () => {
				ChatStore.setShowlevelUpVip(false)
			}
		})
	}
</script>

<style lang="scss" scoped>
	.levelUpVip {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		&_closeBox {
			width: 100%;
			display: flex;
			justify-content: flex-end;

			&_closeIcon {
				padding: 10rpx 5rpx;
			}
		}

		&_over {
			width: 80%;
			height: max-content;
			border-radius: 15rpx;
			background-color: $uni-bg-color;
		}

		&_header {
			width: 100%;
			display: flex;
			justify-content: center;

			&_title {
				font-size: 30rpx;
				font-weight: 800;
			}
		}

		&_main {
			width: 100%;
			padding: 24rpx;
		}

		&_footer {
			display: flex;
			justify-content: center;
			margin: 20rpx 0;

			&_leftBox {
				padding: 10rpx 20rpx;
				background-color: $uni-bg-color-grey;
				border-radius: 15rpx;
				margin: 0 10rpx;
			}

			&_rightBox {
				padding: 10rpx 20rpx;
				background-color: $u-primary;
				border-radius: 15rpx;
				color: $uni-bg-color;
				margin: 0 10rpx;
			}
		}
	}
</style>