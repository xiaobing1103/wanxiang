<template>
	<up-overlay :show="showOverlay">
		<view class="aaOverlay">
			<view class="aaOverlay_main">
				<view class="aaOverlay_main_header">
					<up-icon name="close" @click="closeOverLay"></up-icon>
				</view>
				<view class="aaOverlay_main_title">
					<view class="aaOverlay_main_title_left">
						<view class="aaOverlay_main_title_left_top">
							今日数据看板 <image @click="refershModeCountData" class="aaOverlay_main_title_left_top_image"
								:src="$assets.reloadIcon" mode="">
							</image>
						</view>
						<view class="aaOverlay_main_title_left_bottom">
							数据更新至 {{currentTime}}
						</view>
					</view>
					<view class="aaOverlay_main_title_right">
						<view
							:style="{background:userStore.userInfo?.vip !== 0 ? '#fdecd4' : '#ecf5ff',color:userStore.userInfo?.vip !== 0 ? '#7a330c' : ''}"
							class="aaOverlay_main_title_right_button">
							<image class="aaOverlay_main_title_right_button_image" :src="$assets.huangGuanIcon" mode="">
							</image>
							{{userStore.userInfo?.vipType}}
						</view>
					</view>
				</view>
				<view class="aaOverlay_main_content">
					<template v-if="mainContents">
						<template v-for="(items,index) in mainContents" :key="index">
							<view class="aaOverlay_main_content_items">
								<view class="aaOverlay_main_content_items_name">
									<view class="aaOverlay_main_content_items_name_label" :style="{fontWeight:'800'}">
										{{items.name}}
									</view>
									<view class="aaOverlay_main_content_items_name_value" v-if="items.balance">
										剩余 <text :style="{color: 'red',fontWeight:'800' }">{{items.balance}}</text>
										（{{items.maxNumber}} 次/天）
									</view>
								</view>
								<view class="childLabels">
									<!-- 		<text> 子功能：</text>
									<up-icon name="question-circle-fill" @click="showalert(index+'')">

									</up-icon> -->

								</view>

								<view class="aaOverlay_main_content_items_child"
									v-for="(newitems,indexa) in items?.children" :key="indexa">
									<view class="aaOverlay_main_content_items_name">
										<view class="aaOverlay_main_content_items_name_label">
											{{newitems.name}}
										</view>
										<view class="aaOverlay_main_content_items_name_value">
											剩余 <text
												:style="{color: '#e3008c',fontWeight:'800' }">{{newitems.balance}}</text>
											（{{newitems.maxNumber}} 次/天）
										</view>
									</view>

								</view>
							</view>
						</template>

					</template>

				</view>
			</view>
		</view>
	</up-overlay>
</template>

<script setup lang="ts">
	import { computed, onMounted, ref, watch } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { debounce, formatDate } from '@/utils';
	import { useUserStore } from '@/store';
	const userStore = useUserStore()
	const showOverlay = defineModel<boolean>('showOverlay')
	const { $api, $assets } = useGlobalProperties()
	const currentTime = ref(formatDate(new Date()))
	const mainContents = ref()
	watch(showOverlay, (newdata, olddata) => {
		if (newdata) {
			refershModeCountData()
		}
	})
	const getData = async () => {
		const res = await $api.post('api/v1/number2/all', {})
		if (res.code == 200) {

			return res.data
		}

	}
	const isAlertVisible = ref({
		chat: false,
		draw: false,
		fun: false
	})
	const showalert = (index : string) => {
		isAlertVisible.value[index] = true;
	}
	//获取数据面板数据
	const refershModeCountData = debounce(async () => {
		const groupMap = {
			chat: {
				name: '基础功能',
				description: '已列举的子功能次数在消耗本身次数的同时也消耗基础对话次数，未列举的子功能只消耗基础对话次数。例如：AI对话4.0模型消耗自身次数的同时也消耗基础对话次数；如未列举的普通模型只消耗基础对话次数。',
				children: []
			},
			draw: {
				name: 'AI绘画',
				description: '已列举的子功能次数在消耗本身次数的同时也消耗AI绘画次数，未列举的子功能只消耗AI绘画次数',
				children: []
			},
			fun: {
				name: 'AI功能',
				description: '已列举的子功能次数在消耗本身次数的同时也消耗AI功能次数，未列举的子功能只消耗AI功能次数。',
				children: []
			},
			other: {
				name: '其他功能',
				children: []
			}
		}
		try {

			const datas = await getData()
			currentTime.value = formatDate(new Date())
			for (let key in datas) {
				const [moduleKey, name] = key.split('_')
				const targetGroup = groupMap[moduleKey] || groupMap.other
				name
					? targetGroup.children.push(datas[key])
					: (
						groupMap[moduleKey] = { ...groupMap[key], key, ...datas[key], children: [] }
					)
			}

			console.log(groupMap)
			mainContents.value = groupMap
		} catch (err) {
			// message.error('数据面板数据获取失败!')

		}
	}, 1000)


	const closeOverLay = () => {
		showOverlay.value = false
	}
</script>

<style lang="scss" scoped>
	.aaOverlay {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;

		&_main {
			background-color: $uni-bg-color;
			width: 80%;
			height: 80%;
			border-radius: 20rpx;
			padding: 20rpx;
			display: flex;

			flex-direction: column;

			&_content {
				overflow-y: scroll;
				font-size: 27rpx;
				flex: 1;

				&_items {
					padding: 15rpx 0;

					&_name {
						display: flex;
						justify-content: space-between;

						&_label {}
					}
				}
			}

			&_header {
				padding: 10rpx 20rpx;
				display: flex;
				justify-content: flex-end;
			}

			&_title {

				display: flex;
				justify-content: space-between;

				&_left {
					display: flex;
					flex-direction: column;

					&_top {
						font-size: 30rpx;
						font-weight: 800;
						padding: 10rpx 0;
						display: flex;
						align-items: center;

						&_image {
							width: 28rpx;
							height: 28rpx;
							margin-left: 30rpx;
						}
					}

					&_bottom {
						font-size: 20rpx;
						color: #ccc;
					}
				}

				&_right {
					font-size: 27rpx;
					display: flex;
					align-items: center;

					&_icon {}


					&_button {
						display: flex;
						align-items: center;

						background-color: $u-primary-light;
						border-radius: 10rpx;
						align-items: center;
						color: $uni-color-title;
						padding: 10rpx 25rpx;

						&_image {
							width: 25rpx;
							height: 25rpx;
							margin-right: 10rpx;
						}
					}
				}
			}
		}
	}

	.childLabels {
		display: flex;
	}
</style>