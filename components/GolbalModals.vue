<template>
	<up-modal showCancelButton confirmText="不再提示" :show="open" @cancel="open = false" :title="'边界AI平台' + '- 最近更新:'"
		@confirm="onConfirm">
		<view class="GolbalModal_Notice">
			<view class="GolbalModal_Notice_items" v-for="(items,index) in renderCode" :key="index">
				{{items}}
			</view>
		</view>
	</up-modal>
	<up-modal closeOnClickOverlay @close="closeLastModals" :showConfirmButton="false"
		:title="ScreenStore.lastDayDatas?.title || ''" :show="openlastModalisOpen">
		<view class="lastVipModalBox">
			<view class="lastVipModal">
				<view class="lastVipModal_overBox">
					<view class="pre-wrap">
						{{ScreenStore.lastDayDatas?.content_1}}
					</view>
					<view class="lastVipModal_middle">
						<view class="lastVipModal_middle_items">
							<image class="lastVipModal_middle_items_icon" :src="$assets.todayIcon" mode=""></image>
							<text>今天</text>
							<text>开通</text>
							<text>{{ScreenStore.lastDayDatas?.shop_name}}</text>
							<text
								class="lastVipModal_middle_items_text">￥{{ScreenStore.lastDayDatas?.shop_price}}</text>
						</view>
						<view class="lastVipModal_middle_items">
							<image class="lastVipModal_middle_items_icon" :src="$assets.zhangJia" mode=""></image>
							<text>明天</text>
							<text>开通</text>
							<text>{{ScreenStore.lastDayDatas?.shop_name}}</text>
							<view class="lastVipModal_middle_items_text">
								<view :style="{display:'flex',alignItems:'center'}">
									<text class="fontsize24">涨至</text>
									<image class="lastVipModal_middle_items_icon1" :src="$assets.zhangzhi" mode="">
									</image>
								</view>
								<view class="">
									￥{{ScreenStore.lastDayDatas?.shop_price_2}}
								</view>

							</view>
						</view>
					</view>
					<view class="pre-wrap">
						<rich-text :nodes="ScreenStore.lastDayDatas?.content_2"></rich-text>
					</view>
					<view class="pre-wrap">
						<rich-text :nodes="ScreenStore.lastDayDatas?.content_3"></rich-text>
					</view>
				</view>
			</view>
			<view class="elseTips">
				<view class="elseTips_time">
					距离涨价倒计时 <text :style="{color:'red'}">{{countdown}}</text>
				</view>
				<view @click="openActive" class="elseTips_rightRule">
					活动规则
				</view>
			</view>
			<view class="buttons">
				<view :style="{width:'100%'}">
					<up-button
						:customStyle="{height:'70rpx',border:'0rpx',width:'50%',background:'#ff4d4f',color:'white'}"
						@click="toVips">{{ScreenStore.lastDayDatas?.button}}</up-button>
				</view>
				<view class="buttons_text">
					<text> {{ScreenStore.lastDayDatas?.shop_name}}</text>
					<text class="buttons_text_price">￥{{ScreenStore.lastDayDatas?.shop_price}}</text>
				</view>
			</view>

		</view>
	</up-modal>
</template>

<script setup lang="ts">
	import { onUnload } from '@dcloudio/uni-app';
	import { onMounted, ref, watch } from 'vue';
	import { useGlobalProperties } from '../hooks/useGlobalHooks';
	import { useScreenStore } from '@/store'
	const { $api, $assets } = useGlobalProperties()
	const ScreenStore = useScreenStore()
	const open = ref(false)
	const renderCode = ref([])

	const openlastModalisOpen = ref(false)
	const countdown = ref('00时00分00秒')
	let countdownTimer;
	const openActive = () => {
		uni.navigateTo({
			url: '/pages/my/subPage/ActiveRule/index'
		})
	}
	// 定义一个函数来更新倒计时
	function updateCountdown() {
		const currentTime = new Date().getTime();
		const endTime = ScreenStore?.lastDayDatas?.end_time * 1000;
		if (endTime < currentTime) {
			countdown.value = '00时00分00秒';
			clearInterval(countdownTimer);
		} else {
			let timeDifference = endTime - currentTime;
			const hours = Math.floor(timeDifference / (1000 * 60 * 60));
			const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
			const formattedHours = newPadStart(hours.toString(), 2, '0');
			const formattedMinutes = newPadStart(minutes.toString(), 2, '0');
			const formattedSeconds = newPadStart(seconds.toString(), 2, '0');
			countdown.value = `${formattedHours}时${formattedMinutes}分${formattedSeconds}秒`;
			countdownTimer = setTimeout(updateCountdown, 1000);
		}
	}
	const closeLastModals = () => {
		ScreenStore.setLastModalisOpen(false)
		openlastModalisOpen.value = false
	}
	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	watch(() => ScreenStore.lastModalisOpen, async (val) => {
		console.log(' ScreenStore.lastModalisOpen', val)
		if (val) {
			await delay(15000)
			openlastModalisOpen.value = true
			updateCountdown();
		} else {
			openlastModalisOpen.value = false
			if (countdownTimer) {
				clearInterval(countdownTimer);
			}
		}
	});


	// 组件卸载前清除定时器
	onUnload(() => {
		if (countdownTimer) {
			clearInterval(countdownTimer);
		}
	});
	function newPadStart(targetString, length, padCharacter) {
		if (targetString.length >= length) {
			return targetString;
		}
		let pad = '';
		for (let i = 0; i < length - targetString.length; i++) {
			pad += padCharacter;
		}
		return pad + targetString;
	}
	const toVips = () => {
		uni.navigateTo({
			url: '/pages/my/subPage/vip/index'
		})
	}
	updateCountdown();
	onMounted(() => {
		getNotice()

	})


	const sign = ref<string>('')
	const getNotice = async () => {
		const NoticeReq = await $api.get('api/v1/app/getNotice')
		if (NoticeReq.code == 200) {
			renderCode.value = NoticeReq.data.split('\n')
			sign.value = NoticeReq?.sign
			const flag = ScreenStore.NotificationSign !== sign.value || !ScreenStore.NotificationSign ? true : false
			open.value = flag

		}
	}
	const onConfirm = () => {
		ScreenStore.setNotificationSign(sign.value)
		open.value = false
	}
</script>

<style lang="scss" scoped>
	.GolbalModal_Notice {
		display: flex;
		flex-direction: column;
		font-size: 24rpx;
		max-height: 600rpx;
		overflow: scroll;
	}


	.lastVipModal {
		font-size: 24rpx;
		display: flex;
		flex-direction: column;
		max-height: 800rpx;
		overflow-y: scroll;
		justify-content: flex-start;

		&_overBox {}

		&_middle {
			margin: 20rpx 0;
			padding: 20rpx;
			border-radius: 15rpx;
			border: 1rpx solid #ccc;
			display: flex;
			flex-direction: column;

			&_items {
				display: flex;
				margin: 10rpx 0;
				justify-content: space-between;
				align-items: center;

				&_icon {
					width: 40rpx;
					height: 35rpx;

				}

				&_icon1 {
					width: 15rpx;
					height: 35rpx;
					display: inline-block;
					align-items: center;
				}

				&_text {
					color: red;
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;
				}
			}
		}
	}

	.pre-wrap {
		white-space: pre-line;
	}

	.fontsize24 {
		font-size: 22rpx;
	}

	.lastVipModalBox {
		display: flex;
		flex-direction: column;
	}

	.elseTips {
		font-size: 25rpx;
		font-weight: 1000;
		padding: 10rpx;
		margin: 10rpx 0;
		display: flex;
		border: 1rpx solid #ccc;
		border-radius: 15rpx;
		justify-content: space-between;

		&_rightRule {
			color: #888;
			text-decoration: underline;
		}
	}

	.buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 27rpx;

		&_text {
			padding: 10rpx;
			color: #888;
			display: flex;

			&_price {
				text-decoration: line-through;
				padding: 0 10rpx;
			}
		}
	}
</style>