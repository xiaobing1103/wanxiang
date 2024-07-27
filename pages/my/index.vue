<template>
	<view class="content">
		<!-- <CommonHeader /> -->
		<view class="myView">
			<view class="">
				带我去带我去带我去的武器
			</view>
		</view>
		<CommonTabbar :indexValue="4" />
	</view>
</template>

<script setup lang="ts">
	import CommonTabbar from '@/components/CommonTabbar.vue'
	import CommonHeader from '@/components/CommonHeader.vue'
</script>

<style lang="scss">
	.content {}

	.myView {
		height: calc(100vh - 50px);
		background-image: url("../../static/myBackGround.png");
		background-repeat: no-repeat;
		/* 不重复背景图像 */
		background-size: 100% 100%;
		/* 背景图像宽度和高度都设置为视口或容器的 100% */
		background-position: center;
		/* 确保背景图像居中显示 */
	}
</style>