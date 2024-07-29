<template>
	<view class="LoginDecscriptions">
		<up-checkbox :customStyle="{marginBottom: '8px'}" shape="circle" label="同意用户协议与隐私条款" name="agree" usedAlone
			v-model:checked="aloneChecked">
			<template #label>
				我已阅读并同意<text class="LoginDecscriptions_link">《域方科技用户协议》</text><text
					class="LoginDecscriptions_link">《隐私协议》</text>
				<text class="LoginDecscriptions_link">《支付协议</text>
			</template>



		</up-checkbox>

	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	const aloneChecked = ref(false)
</script>

<style scoped lang="scss">
	.LoginDecscriptions {
		display: flex;
		justify-content: center;
		margin-top: 100rpx;
		font-size: 20rpx;

		&_link {
			color: $uni-color-primary;

		}
	}
</style>