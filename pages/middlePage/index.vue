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
		</template>
		<view class="middlePage">
			fewfewfew废物费威风威风危废物
		</view>
		<template #bottom>
			<m-tabbar native ref="tabbarRef" safeBottom>
				<template v-slot:tabbar_index_2>
					<view class="custom_style">
						<view class="custom_style_icon">
							<image class="custom_style_icon_image" :src="$assets.DeepSeekModelIcon" mode=""></image>
							<image class="custom_style_icon_hotimage" :src="$assets.IndexHotIcon" mode=""></image>
						</view>
					</view>
				</template>
			</m-tabbar>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app'
	import { computed, nextTick, onMounted, ref } from 'vue'
	import CommonHeader from '@/components/CommonHeader.vue';
	const isIOS = ref(false)
	const tabbarRef = ref(null)
	// onLoad(() => {

	// 	tabbarRef.value.reload()
	// })
</script>

<style lang="scss" scoped>
	.middlePage {}

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