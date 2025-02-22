<template>
	<z-paging>
		<template #top>
			<CommonHeader :defindTitle="'关于'+AppStrName" />
		</template>
		<view class="AboutWe">
			<view class="AboutWe_main">
				<image class="AboutWe_main_iamge" src="../../../../static/logo.svg" mode=""></image>
				<text class="AboutWe_main_text">{{AppStrName}}ai平台</text>
				<text class="AboutWe_main_text">v1.1.1</text>
				<text class="AboutWe_main_text">channel：self</text>
			</view>
		</view>
	</z-paging>
</template>

<script setup lang="ts">
	import { AppStrName } from '@/http';


	import CommonHeader from '@/components/CommonHeader.vue'
</script>

<style lang="scss" scoped>
	.AboutWe {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 90vh;

		&_main {
			flex: 1;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			&_iamge {
				width: 200rpx;
				height: 100rpx;
			}

			&_text {
				font-size: 27rpx;
			}
		}
	}
</style>