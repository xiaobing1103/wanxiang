<template>
	<view class="loginback">
		<z-paging :pagingStyle="{ padding: '0 30rpx' }">
			<template #top>
				<view class="loginViewText">
					<view class="loginViewText_header">
						<image class="loginViewText_header_logo" src="../../static/logo.svg" mode=""></image>
						<span class="loginViewText_header_text">万象AI平台</span>
					</view>
					<view class="loginViewText_desc">
						<span class="loginViewText_desc_top">300+AI工具平台，点开即用，500万用户的选择</span>
						<span class="loginViewText_desc_main">适用人群：学生、教师、白领、自媒体工作者、内容创作者、公务员、设计师、产品经理等</span>
					</view>
				</view>
				<view class="loginView">
					<image class="loginView_image" src="//file.1foo.com/2024/07/29/d6a4cf1d7b7201b21145bac2893d8f46.png"
						mode="aspectFit">
					</image>
					<image class="loginView_image"
						src="http://file.1foo.com/2024/07/29/d1f6d7fac2dc1c30995dcbf005c59c69.png" mode="aspectFit">
					</image>
				</view>
				<view class="buttonGroup">
					<up-button :customStyle="{width: '70%',borderRadius:'40rpx',marginBottom:'20rpx'}" size="small"
						type="primary" text="账户用户登录" @click="toAccountLogin"></up-button>
					<up-button :customStyle="{width: '70%',borderRadius:'40rpx',marginBottom:'20rpx'}" size="small"
						type="success" text="一键登录"></up-button>
				</view>
				<LoginDecscriptions />
			</template>

		</z-paging>

	</view>
</template>

<script setup lang="ts">
	const toAccountLogin = () => {
		uni.navigateTo({
			url: '/pages/loginAccount/index'
		})
	}
</script>

<style lang="scss" scoped>
	.loginback {
		background-image: url('http://file.1foo.com/2024/07/29/af36f8c0ba1944af16deba5328d73e0d.png');
		background-position: -303px -478px;
		width: 100vw;
		height: 100vh;
	}

	.loginViewText {
		margin-top: 60rpx;

		&_header {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			&_logo {
				height: 60rpx;
				width: 100rpx;
			}

			&_text {
				font-weight: 800;
				margin-left: 20rpx;
			}
		}

		&_desc {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			&_top {
				font-size: 25rpx;
				padding: 10rpx 0;
			}

			&_main {
				font-size: 15rpx;
			}
		}
	}

	.loginView {
		display: flex;
		padding: 50rpx;
		box-sizing: border-box;

		&_image {
			// height: 500rpx;
		}
	}

	.buttonGroup {
		padding: 20rpx 0 !important;
	}
</style>