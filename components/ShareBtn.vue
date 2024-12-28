<template>
	<view class="sharebtn">
		<view class="uni-share">
			<view class="uni-share-content">
				<view v-for="(item, index) in bottomData" :key="index" class="uni-share-content-box"
					@click='btnShare(index)'>
					<view class="uni-share-content-image">
						<image :src="item.icon" class="content-image" />
					</view>
					<text class="uni-share-content-text">{{ item.text }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bottomData: [{
						text: '微信',
						icon: 'http://file.1foo.com/2024/12/28/a448dbf7c4f4fa72c3a9aad2783e8310.png',
						name: 'wx'
					},
					{
						text: '朋友圈',
						icon: 'http://file.1foo.com/2024/12/28/7a57a9600c4894ca8f083bd65da5fee6.png',
						name: 'copy'
					},
					{
						text: 'QQ',
						icon: 'http://file.1foo.com/2024/12/28/881c989364b65d57e96212b411a0db95.png',
						name: 'qq'
					},
					{
						text: '复制',
						icon: 'http://file.1foo.com/2024/12/28/e0b4808c3b582cd67c0a5bf62c20f8e3.png',
						name: 'copy'
					}
				],
				// sharedataTemp: {
				// 	type: 0,
				// 	strShareUrl: "https://uniapp.dcloud.io",
				// 	strShareTitle: "分享标题",
				// 	strShareSummary: "分享总结",
				// 	strShareImageUrl: "/static/sharemenu/copyurl.png"
				// }
			}
		},
		props: ["sharedataTemp"],
		// onLoad() {
		// 	console.log('sharedataTemp',this.sharedataTemp);
		// },
		methods: {
			btnShare(ind) {
				console.log(ind);
				var strProvider = "",
					strScene = "",
					mytype = '';
				switch (ind) {
					case 0:
						strProvider = "weixin"
						strScene = "WXSceneSession"
						mytype = 0
						break;
					case 1:
						strProvider = "weixin"
						strScene = "WXSceneTimeline"
						uni.share({
							provider: strProvider,
							scene: strScene,
							type: this.sharedataTemp.type,
							summary: this.sharedataTemp.strShareSummary,
							success: function(res) {
								console.log("success:" + JSON.stringify(res));

							},
							fail: function(err) {
								console.log("fail:" + JSON.stringify(err));
							}
						})
						return
						break;

					case 2:
						strProvider = "qq"
						mytype = 1
						break;
					case 3:
						let str = null
						if (this.sharedataTemp.type == 1) {
							str = this.sharedataTemp.strShareSummary
						} else {
							str = this.sharedataTemp.strShareUrl
						}
						uni.setClipboardData({
							data: this.sharedataTemp.strShareUrl,
							complete() {
								uni.showToast({
									title: "已复制到剪贴板"
								})
							}
						})
						break;
				}
				if (strProvider != "") { //点击了0-3序号的这4个按钮
					uni.share({
						provider: strProvider,
						scene: strScene,
						type: this.sharedataTemp.type,
						href: this.sharedataTemp.strShareUrl,
						title: this.sharedataTemp.strShareTitle,
						summary: this.sharedataTemp.strShareSummary,
						imageUrl: this.sharedataTemp.strShareImageUrl,
						success: function(res) {
							console.log("success:" + JSON.stringify(res));
						},
						fail: function(err) {
							console.log("fail:" + JSON.stringify(err));
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	/* 底部分享 */
	.sharebtn {
		.uni-share {
			width: 690rpx;
			margin: 30rpx;
			border-radius: 30rpx;
			/* #ifndef APP-NVUE */
			display: flex;
			flex-direction: column;
			/* #endif */
			background-color: #fff;

			.uni-share-content {
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: center;
				overflow-x: scroll;
				padding: 15px 50rpx;

				.uni-share-content-box {
					/* #ifndef APP-NVUE */
					display: flex;
					/* #endif */
					flex-direction: column;
					align-items: center;
					// width: 25%;
					// justify-content: space-between;
					margin-right: 60rpx;

					&:nth-last-child(1) {
						margin-right: 0;
					}

					.uni-share-content-image {
						/* #ifndef APP-NVUE */
						display: flex;
						/* #endif */
						flex-direction: row;
						justify-content: center;
						align-items: center;
						width: 90rpx;
						height: 90rpx;
						overflow: hidden;
						border-radius: 10rpx;

						.content-image {
							width: 90rpx;
							height: 90rpx;
						}
					}

					&:nth-last-child(1) {
						.uni-share-content-image .content-image {
							width: 50rpx !important;
							height: 50rpx !important;
						}
					}

					.uni-share-content-text {
						font-size: 26rpx;
						color: #333;
						padding-top: 5px;
						padding-bottom: 10px;
					}
				}
			}
		}
	}
</style>