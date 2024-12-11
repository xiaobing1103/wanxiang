<template>
	<view class="LoginDecscriptions">
		<up-checkbox :customStyle="{ marginBottom: '8px' }" shape="circle" label="" name="agree" usedAlone
			v-model:checked="aloneChecked">
			<template #label>

			</template>
		</up-checkbox>
		<text> <text @click="aloneChecked = !aloneChecked">我已阅读并同意</text>
			<text class="LoginDecscriptions_link" @click="topath('/pages/my/subPage/PrivacyPolicy/index')">《隐私协议》</text>
			和<text class="LoginDecscriptions_link"
				@click="topath('/pages/my/subPage/UserAgreement/index')">《支付协议》</text></text>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	const aloneChecked = defineModel<number>('aloneChecked');
	const topath = (path : string) => {
		uni.navigateTo({
			url: path
		})
	}
</script>

<style scoped lang="scss">
	.LoginDecscriptions {
		display: flex;
		justify-content: center;
		padding: 50rpx 0;
		font-size: 27rpx;

		align-items: center;

		&_link {
			color: $uni-color-primary;
		}
	}
</style>