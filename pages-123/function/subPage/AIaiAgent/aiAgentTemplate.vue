<template>
	<view class="aiAgentTemplate">
		<view class="aiAgentTemplate_header">
			<view class="aiAgentTemplate_header_title">
				边界AI智能体
			</view>
			<view class="aiAgentTemplate_header_modes">
				<template v-for="(items,index) in aiAgentTemHeaderData" :key="index">
					<view class="aiAgentTemHeaderData" @click="toPages(items.id)">
						<view class="aiAgentTemHeaderData_left">
							<image class="aiAgentTemHeaderData_left_icon" :src="items.modeIcon" mode=""></image>
						</view>
						<view class="aiAgentTemHeaderData_right">
							<text>{{items.title}}</text>
							<text>{{items.desc}}</text>
						</view>
					</view>
				</template>
			</view>
		</view>
		<view class="aiAgentTemplate_hotContent">
			<view class="label">
				热门智能体
			</view>
			<z-swiper v-model="HotAiAgentTemDatas" :options="{autoplay:true,}">
				<z-swiper-item v-for="(items,index) in yfooList.slice(0,5)" :key="index">
					<ShowContentTem :hotColor="items.hotColor" :hotTextColor="items.hotTextColor" :index="index"
						:name="items.name" :description="items.description" :assistant_id="items.assistant_id"
						:avatar="items.avatar" :tags="items.tags" />
				</z-swiper-item>
			</z-swiper>
		</view>
		<view class="aiAgentTemplate_showHotContent">
			<view class="label">
				最近上新
			</view>
			<template v-for="(items,index) in yfooList.slice(5)" :key="index">
				<ShowContentTem :index="index" :name="items.name" :description="items.description"
					:avatar="items.avatar" :tags="items.tags" :assistant_id="items.assistant_id" />
			</template>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { aiAgentTemHeaderData, HotAiAgentTemDatas } from './datas'
	import zSwiper from '../CommonComponents/zebra-swiper/components/z-swiper/z-swiper'
	import zSwiperItem from '../CommonComponents/zebra-swiper/components/z-swiper-item/z-swiper-item'
	import { onMounted } from '../CommonComponents/sunny-video/components/sunny-video/vue-composition-api';
	import ShowContentTem from './ShowContentTem'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { ref } from 'vue';
	const { $api, $assets } = useGlobalProperties()
	onMounted(() => {
		getYfooList()
	})
	const yfooList = ref([])
	const colorConfig = [{ hotColor: 'red' }, { hotColor: 'rgb(255, 140, 26)', }, { hotColor: 'rgb(255, 191, 0)' }, { hotColor: 'rgb(237, 240, 253)', hotTextColor: 'rgb(132, 134, 145)' }, { hotColor: 'rgb(237, 240, 253)', hotTextColor: 'rgb(132, 134, 145)' }]
	const getYfooList = async () => {
		const yfooListReq = await $api.get('https://open.aichatapi.com/api/v1/chat/zhipu.assistant/yfoo.list')
		if (yfooListReq.code == 200) {
			yfooListReq.data = yfooListReq.data.map((items, index) => {
				return { ...items, ...colorConfig[index] }
			})
			yfooList.value = yfooListReq.data
		}

	}
	const toPages = (id : string) => {
		uni.navigateTo({
			url: '/pages/function/subPage/AIaiAgent/mainPages?id=' + id
		})
	}
</script>

<style lang="scss" scoped>
	.aiAgentTemplate {
		width: 100%;

		&_header {
			width: 100%;
			height: 260px;
			background: url('https://file.1foo.com/2024/11/14/217afd32154d87e97274b33ca6918c9c.png');
			background-position: -250rpx 0rpx;
			background-repeat: no-repeat;
			background-size: cover;
			margin: 0;
			padding: 0;
			background-position: center;

			&_title {
				color: #4644ff;
				font-size: 36rpx;
				font-weight: 900;
				padding: 30rpx;
			}

			&_modes {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				padding: 50rpx 0;

			}
		}

		&_hotContent {
			height: 100%;
			background: linear-gradient(180deg, #e8f6ee, white);
			overflow: hidden;
			padding: 20rpx;


		}

		&_showHotContent {
			padding: 0 20rpx;
		}
	}

	.label {
		font-weight: 800;
		padding: 10rpx 0;
	}

	.overflowBox {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		// display: flex;
		// flex-wrap: wrap;
		justify-content: space-around;
		overflow: hidden;
		max-width: 100%;
		min-width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		box-sizing: border-box;
	}

	.aiAgentTemHeaderData {
		background: #ffffff80;
		display: flex;
		backdrop-filter: blur(40px);
		margin: 20rpx;
		border-radius: 20rpx;
		font-size: 22rpx;
		padding: 15rpx;


		&_left {
			padding: 10rpx;

			&_icon {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
			}
		}

		&_right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}
</style>