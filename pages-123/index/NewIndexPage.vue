<template>
	<z-paging ref="srollRef" safe-area-inset-bottom :show-scrollbar="false" :pagingStyle="{ 		
    // backgroundImage:`url(${$assets.OverBGImage})`, 
    backgroundRepeat: 'repeat',
    padding: '0',
    backgroundSize: 'cover',
    backgroundPosition: '-491px 0px'
  }">
		<template #top>
			<CommonHeader />
			<NewIndexHeader />
			<!-- <NewIndexTabbar /> -->
			<NewIndexModelChange />
		</template>
		<up-transition :show="KeyHight > 0" mode="fade-up">
			<view class="mask" @touchmove.prevent></view>
		</up-transition>
		<view class="content-wrapper">
			<template v-if="ChatStore.isShowSearchTabbar == 'HomeTemPlate'">
				<HomeSections />
			</template>
			<template v-if="ChatStore.isShowSearchTabbar == 'DeepSeekTemplate'">
				<DeepSeekModelSelect :isPopup="false" @select="handleModelSelect" />
			</template>
			<template v-if="ChatStore.isShowSearchTabbar == 'AiAgentTemplate'">
			</template>
		</view>
		<template #bottom>
			<template v-if="ChatStore.isShowSearchTabbar == 'HomeTemPlate'">
				<!-- #ifdef MP-WEIXIN -->
				<template v-if="isIOS">
					<view class="fixedBox" :style="{bottom:`${KeyHight > 0 ? KeyHight : safeBottom}px`}">
						<HomeChatBox v-model:KeyHight="KeyHight" />
						<ChangeModelButton />
					</view>
				</template>
				<template v-else>
					<view :class="{fixedBox:KeyHight}" :style="{bottom:`${KeyHight}px`}">
						<HomeChatBox v-model:KeyHight="KeyHight" />
						<ChangeModelButton />
					</view>
				</template>
				<!-- #endif -->
				<!-- #ifdef APP || H5 -->
				<view :class="{fixedBox:KeyHight}" :style="{bottom:`${KeyHight}px`}">
					<HomeChatBox v-model:KeyHight="KeyHight" />
					<ChangeModelButton />
				</view>
				<!-- #endif -->
				<m-tabbar ref="tabbarRef" :native="true" :current="0" safeBottom>
					<template v-slot:tabbar_index_2>
						<view class="custom_style">
							<view class="custom_style_icon">
								<image class="custom_style_icon_image" :src="$assets.DeepSeekModelIcon"
									mode="aspectFit"></image>
								<image class="custom_style_icon_hotimage" :src="$assets.IndexHotIcon" mode="aspectFit">
								</image>
							</view>
						</view>
					</template>
				</m-tabbar>
			</template>
		</template>
	</z-paging>


</template>

<script setup lang="ts">
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { computed, nextTick, onMounted, ref } from 'vue'
	import NewIndexHeader from './NewIndexHeader.vue'
	import NewIndexTabbar from './NewIndexTabbar.vue'
	import HomeChatBox from './HomeChatBox.vue'
	import { useChatStore, useScreenStore } from '@/store'
	import HomeSections from './ChangeHome/HomeSections.vue'
	import NewIndexModelChange from './NewIndexModelChange.vue'
	import ChangeModelButton from './ChangeModelButton/index.vue'
	import DeepSeekModelSelect from './DeepSeekModelSelect.vue'
	import CommonHeader from '@/components/CommonHeader.vue'
	const ChatStore = useChatStore()
	const KeyHight = ref<number>(0)
	const isIOS = ref(false)
	const tabbarRef = ref(null)

	onLoad(() => {
		const system = uni.getSystemInfoSync()
		// #ifdef MP-WEIXIN
		isIOS.value = system.platform === 'ios'
		// #endif 
	})

	onMounted(() => {
		if (tabbarRef.value) {
			tabbarRef.value.reload()
		}
	})

	const safeBottom = ref(0)
	const handleModelSelect = (key : string) => {
		ChatStore.setModel(key)
		ChatStore.changeSelectChatId('')
		uni.navigateTo({
			url: '/pages/index/subPage/AllChatPage/index'
		})
	}

	onMounted(() => {
		const systemInfo = uni.getSystemInfoSync()
		const tabBarHeight = 50 // tabbar的基础高度，根据实际调整
		const safeAreaBottom = systemInfo.safeAreaInsets?.bottom || 0
		// #ifdef MP-WEIXIN
		safeBottom.value = tabBarHeight + safeAreaBottom
		// #endif
		// #ifdef H5
		safeBottom.value = tabBarHeight
		// #endif
	})
</script>

<style lang="scss" scoped>
	.content-wrapper {
		// #ifdef MP-WEIXIN
		padding-bottom: calc(204rpx + env(safe-area-inset-bottom));
		// #endif
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.1);
		z-index: 900; // 确保在输入框之下，在其他内容之上
		transition: opacity 0.3s;
		/* 禁止滚动穿透 */
		touch-action: none;
		/* #ifdef H5 */
		cursor: default;
		/* #endif */
	}

	.fixedBox {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background-color: #fff;
		overflow: hidden;
		transition: bottom 0.3s ease; // 添加过渡效果
		/* #ifdef MP-WEIXIN */
		box-sizing: border-box;
		/* #endif */
	}

	.custom_style {
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;

		&_icon {
			// font-size: 80rpx;
			width: 90rpx;
			height: 90rpx;
			border-radius: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			// margin-top: -40rpx;
			&_image {
				width: 98rpx;
				height: 70rpx;
			}

			&_hotimage {
				position: absolute;
				width: 32rpx;
				height: 20rpx;
				right: -20rpx;
				top: -5rpx;
			}
		}
	}
</style>