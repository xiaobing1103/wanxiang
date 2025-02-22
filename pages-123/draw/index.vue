<template>
	<z-paging :show-scrollbar="false" v-model="ImageList" @query="getImages" ref="paging">
		<template #top>
			<CommonHeader />
		</template>
		<view class="body">
			<MenuCardItem @change="toPage(item)" v-for="(item,index) in menuList" :key="index" :data="item" />
		</view>
		<view class="imageBox">
			<view class="imageBox_title">
				灵感工坊
			</view>
			<view class="imageLists">
				<ImageShowcasePlaza :ImageList="ImageList" />
			</view>
		</view>
		<template #bottom>
			<m-tabbar native safeBottom>
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
	import ImageShowcasePlaza from './ImageShowcasePlaza'
	import CommonHeader from '@/components/CommonHeader.vue'
	import MenuCardItem from './menuItem.vue'
	import { ImageListDTO, menuList } from './data'
	import type { MenuItem } from '@/pages/function/type.ts'
	import { ref } from 'vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks'
	import { onLoad } from '@dcloudio/uni-app'
	const { $api } = useGlobalProperties()
	const paging = ref(null)
	// 创建响应式数据

	const toPage = (item : MenuItem) => {
		if (!item.path) {
			uni.$u.toast('尚未开放')
			return
		}
		uni.navigateTo({
			url: item.path
		})
	}
	const ImageList = ref<ImageListDTO[]>([])
	const getImages = async (pageNo : number = 1, pageSize ?: number) => {
		const res = await $api.get<ImageListDTO[]>('api/v1/img/publishs', {
			page: pageNo
		})
		if (res.code == 200) {
			paging.value.complete(res.data)

		} else {
			paging.value.complete(false);
		}
	}
	// onLoad((options : any) => {
	// 	uni.hideTabBar()
	// })
</script>
<style lang="scss" scoped>
	.body {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		box-sizing: border-box;
		padding: 30rpx;
	}

	.desc {
		font-size: 24rpx;
		text-align: center;
		display: block;
		width: 100%;
		color: $u-info-disabled;
	}

	.imageBox {
		padding: 30rpx;

		&_title {
			font-size: 40rpx;
			font-weight: 800;
			padding: 30rpx 0;
		}
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