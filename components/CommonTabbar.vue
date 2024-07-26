<template>
	<view>
		<up-tabbar :value="indexValue" :fixed="true" :placeholder="false" :safeAreaInsetBottom="false">
			<up-tabbar-item text="首页" icon="home" @click="topath"></up-tabbar-item>
			<up-tabbar-item text="绘画" icon="photo" @click="topath"></up-tabbar-item>
			<up-tabbar-item @click="topath">
				<view class="custom_style">
					<image class="custom_style_icon" src="/static/plus.svg" mode="aspectFit"></image>
				</view>
			</up-tabbar-item>
			<up-tabbar-item text="功能库" icon="play-right" @click="topath"></up-tabbar-item>
			<up-tabbar-item text="我的" icon="account" @click="topath"></up-tabbar-item>
		</up-tabbar>
		<!-- <m-tabbar :ref="tabbarRef" fixed fill current="111" :tabbar="tabbar">
			<template v-slot:tabbar_index_2>
				<view class="custom_style">
					<image class="custom_style_icon" src="/static/plus.svg" mode="aspectFit"></image>
				</view>
			</template>
		</m-tabbar> -->
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	// const tabbar = ref(TabbarConfig)
	const tabbarRef = ref()
	const props = defineProps<{ indexValue : number }>()
	tabbarRef.value?.setTabBarBadge({
		index: 0,
		text: '10'
	})

	const topath = (e : number) => {
		console.log(e)
		const filterArr = ["/pages/index/index", "/pages/draw/index", "/pages/chat/index", "/pages/function/index", "/pages/my/index"]
		uni.switchTab({
			url: filterArr[e],
		})

	}
	// tabbarRef.value?.setTabBarBadge({
	// 	index: 0,
	// 	text: 'text',
	// 	pagePath: 'newPagePath',
	// 	iconPath: '/path/to/iconPath',
	// 	selectedIconPath: '/path/to/selectedIconPath'
	// })

	// nextTick(() => {
	// 	tabbarRef.value?.setTabBarBadge({
	// 		index: 0,
	// 		text: '10'
	// 	})
	// })
	// nextTick(() => {
	// 	tabbarRef.value?.reload()
	// })

	// const onLoad = () => {
	// 	// #ifdef MP-JD || MP-WEIXIN
	// 	uni.hideHomeButton()
	// 	// #endif
	// }
</script>

<style lang="scss">
	.custom_style {
		background-color: #fff !important;

		&_icon {
			font-size: 80rpx;
			width: 40rpx;
			height: 40rpx;
			padding: 5rpx 40rpx;
			border-radius: 30rpx;
			display: flex;
			border: 2px solid #000;
			justify-content: center;
			align-items: center;
		}
	}
</style>