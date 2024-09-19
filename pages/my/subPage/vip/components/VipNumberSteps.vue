<template>
	<view class="VipNumberSteps">
		<view class="VipNumberSteps_headers">
			<view class="VipNumberSteps_headers_textbox">
				万象AI平台会员权益 · 办公会员VIP
			</view>
			<view class="VipNumberSteps_headers_buttonBox">
				<up-icon color="#974d1c" name="question-circle"></up-icon>
				<text class="VipNumberSteps_headers_buttonBox_text">有疑惑？联系客服</text>
			</view>
		</view>
		<view class="VipNumberSteps_middle">

		</view>
	</view>
</template>

<script setup lang="ts">
	import { onMounted } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	const { $api } = useGlobalProperties()
	onMounted(async () => {
		const vipLimitConfig = await $api.get('api/getconfig')
		console.log(vipLimitConfig)
	})
</script>

<style scoped lang="scss">
	.VipNumberSteps {
		margin: 25rpx;
		border: 1px solid rgba(202, 147, 128, 0.5);
		border-radius: 10px;

		&_headers {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10rpx;
			border-radius: 18rpx 18rpx 0 0;
			background: #fff7e5;
			font-size: 24rpx;

			&_textbox {
				background: linear-gradient(90deg, #612c08, #bf5b02);
				background-clip: text;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				font-weight: 700;
			}

			&_buttonBox {
				display: flex;
				align-items: center;
				background-color: #ffe4bd;
				color: #974d1c;
				border: 0;
				padding: 10rpx;
				border-radius: 10rpx;

				&_text {
					margin-left: 10rpx;
				}
			}

		}

		&_middle {

			padding: 20rpx;

		}
	}
</style>