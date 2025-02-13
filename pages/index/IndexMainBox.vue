<template>
	<view class="IndexMainBox">
		<text> 你好 <template v-if="UserStore.userInfo?.nick">
				{{',' + UserStore.userInfo?.nick}}
			</template> </text>
		<text> 准备好了吗？我随时可以开始哦！</text>
	</view>
	<view class="Contents">
		<view class="items" v-for="(items,index) in NavMenuData" :key="index">
			<view class="head">
				<view class="icon">
					<image class="iconCon" :src="items.head.icon" mode=""></image>
				</view>
				<view class="middle">
					<text class="Title">{{items.head.title}}</text>
					<text class="Desc">{{items.head.description}}</text>
				</view>
				<view class="right" @click="toPath(items.head.redirect)">
					进入专区 >
				</view>
			</view>

			<scroll-view :show-scrollbar="false" scroll-x>
				<view class="middleView">
					<view class="middleViewCon" v-for="(banners,index) in items.bannerList" :key="index">
						<image class="middleImg" :src="banners.poster" mode=""></image>
						<view class="middleViewText">
							<text class="middleViewBanners">{{banners.name}}</text>
							<view class="">
								<text v-for="item in banners.star" class="middleViewStar" :key="item">⭐</text>
							</view>

						</view>
					</view>

				</view>
			</scroll-view>
			<scroll-view scroll-x :show-scrollbar="false">
				<view class="middleViewBottom">
					<view class="BottomContent" v-for="(menus,index) in items.menuList" :key="index">
						<image class="middleViewMeunsIcon" :src="menus.icon" mode=""></image>
						<text class="middleViewMeunsIconText">{{menus.name}}</text>
					</view>
				</view>
			</scroll-view>

		</view>
	</view>

</template>

<script setup lang="ts">
	import { NavMenuData } from './data';
	import { useUserStore } from '@/store';

	const UserStore = useUserStore()


	const toPath = (url : string) => {
	}
</script>

<style lang="scss" scoped>
	.IndexMainBox {
		display: flex;
		flex-direction: column;
		padding: 0 40rpx;
		font-weight: 700;
		margin: 20rpx 0	;
	}

	.Contents {
		padding: 0 40rpx;

		.items {
			display: flex;
			flex-direction: column;
			border-radius: 15rpx;
			margin: 25rpx 0;

			.head {
				display: flex;
				background: linear-gradient(90deg, #0112f71a, #4b88f700);
				padding: 10rpx;
				border-radius: 25rpx 0 0 10rpx;

				.icon {
					.iconCon {
						width: 50rpx;
						height: 50rpx;
						margin-right: 15rpx;
					}
				}

				.middle {
					display: flex;
					flex-direction: column;
				}

				.right {
					color: #6965ea;
					display: flex;
					align-items: center;
					font-size: 22rpx;
					flex: 1;
					justify-content: flex-end;
				}

				.Title {
					font-weight: 700;
					font-size: 30rpx;
				}

				.Desc {
					font-size: 24rpx;
					color: #888;
				}
			}

			.middleView {
				display: flex;
				flex-wrap: nowrap;
				gap: 20rpx;

				.middleViewCon {
					margin: 20rpx 0;

					.middleImg {
						width: 400rpx;
						height: 250rpx;
						border-radius: 20rpx;

					}
				}


				.middleViewText {
					font-size: 28rpx;
					display: flex;
					flex-direction: column;

					.middleViewBanners {
						margin-bottom: 15rpx;
					}
				}


			}
		}
	}

	.middleViewBottom {
		display: grid;
		grid-template-columns: repeat(7, 250rpx);
		grid-template-rows: auto auto;
		gap: 15rpx;

		.BottomContent {

			display: flex;

			.middleViewMeunsIcon {
				width: 35rpx;
				height: 35rpx;
				margin-right: 15rpx;


			}

			.middleViewMeunsIconText {
				font-size: 28rpx;
			}

		}
	}
</style>