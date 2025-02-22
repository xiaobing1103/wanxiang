<template>
	<up-overlay :show="SoraPromptPramas.showVideo">
		<view class="up-overlay">
			<view class="header" :style="{height: ScreenStore.navBarHeight + 'px' }">
				<view>
					<up-icon @click="SoraPromptPramas.showVideo = false" name="close" color="#2979ff"
						size="28"></up-icon>
				</view>
			</view>
			<view class="VideoBox">
				<view v-if="SoraPromptPramas.isQuery" class="loadingMusic">
					<view class="loadingMusic_loading">
						<view class="shaft-load3">
							<view class="shaft1"></view>
							<view class="shaft2"></view>
							<view class="shaft3"></view>
							<view class="shaft4"></view>
							<view class="shaft5"></view>
							<view class="shaft6"></view>
							<view class="shaft7"></view>
							<view class="shaft8"></view>
							<view class="shaft9"></view>
							<view class="shaft10"></view>
						</view>
					</view>
					<view class="loadingMusic_desc">
						<text>AI正在努力创作视频，预计4分钟...</text>
						<text>倒计时： {{countdown}} 秒</text>
					</view>
				</view>
				<SunnyVideo v-else :src="SoraPromptPramas.playVideo" />
			</view>
		</view>
	</up-overlay>
</template>

<script setup lang="ts">
	import { useScreenStore } from '@/store';
	import { storeToRefs } from 'pinia';
	import SunnyVideo from '../sunny-video/components/sunny-video/sunny-video.vue'
	import { onUnload } from '@dcloudio/uni-app';
	import { VideoVmodalType } from './datas';
	import { onMounted, ref } from 'vue';
	const SoraPromptPramas = defineModel<VideoVmodalType>('SoraPromptPramas')
	const ScreenStore = useScreenStore()
	const countdown = ref(240);
	// 模拟倒计时
	onMounted(() => {
		startCountdown()
	})
	let interval
	const startCountdown = () => {
		interval = setInterval(() => {
			countdown.value--;
			if (countdown.value === 0) {
				clearInterval(interval);
				countdown.value = 240
			}
		}, 1000);
	};
	onUnload(() => {
		clearInterval(interval);
	})
</script>

<style lang="scss" scoped>
	.up-overlay {
		width: 100%;
		height: 100%;
		background-color: #fff;
	}

	.header {
		display: flex;
		justify-content: flex-start;
		padding: 20rpx 50rpx;
		align-items: flex-end;
	}

	.VideoBox {
		display: flex;
		width: 100%;
		height: 80%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.loadingMusic {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		padding: 200rpx 0;

		&_desc {
			display: flex;
			font-weight: 800;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}

	/* Shaft 3 */
	.shaft-load3 {
		position: relative;
		width: 100px;
		height: 100px;
	}

	.shaft-load3>view {
		background: transparent;
		border: 4px solid transparent;
		border-color: transparent transparent transparent #506248;
		-webkit-border-radius: 100%;
		-moz-border-radius: 100%;
		border-radius: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate"(" -50%, -50%")";
		-moz-transform: translate"(" -50%, -50%")";
		-ms-transform: translate"(" -50%, -50%")";
		-o-transform: translate"(" -50%, -50%")";
		transform: translate"(" -50%, -50%")";
		-webkit-transform: translate(-50%, -50%) rotate(0);
		-moz-transform: translate(-50%, -50%) rotate(0);
		-ms-transform: translate(-50%, -50%) rotate(0);
		-o-transform: translate(-50%, -50%) rotate(0);
		transform: translate(-50%, -50%) rotate(0);
		-webkit-animation: loading3 2s infinite ease-in-out;
		-moz-animation: loading3 2s infinite ease-in-out;
		-o-animation: loading3 2s infinite ease-in-out;
		animation: loading3 2s infinite ease-in-out;
	}

	.shaft-load3 .shaft1 {
		-webkit-animation-delay: 0.1s;
		-moz-animation-delay: 0.1s;
		-o-animation-delay: 0.1s;
		animation-delay: 0.1s;
		width: 20px;
		height: 20px;
	}

	.shaft-load3 .shaft2 {
		-webkit-animation-delay: 0.2s;
		-moz-animation-delay: 0.2s;
		-o-animation-delay: 0.2s;
		animation-delay: 0.2s;
		width: 25px;
		height: 25px;
	}

	.shaft-load3 .shaft3 {
		-webkit-animation-delay: 0.3s;
		-moz-animation-delay: 0.3s;
		-o-animation-delay: 0.3s;
		animation-delay: 0.3s;
		width: 30px;
		height: 30px;
	}

	.shaft-load3 .shaft4 {
		-webkit-animation-delay: 0.4s;
		-moz-animation-delay: 0.4s;
		-o-animation-delay: 0.4s;
		animation-delay: 0.4s;
		width: 35px;
		height: 35px;
	}

	.shaft-load3 .shaft5 {
		-webkit-animation-delay: 0.5s;
		-moz-animation-delay: 0.5s;
		-o-animation-delay: 0.5s;
		animation-delay: 0.5s;
		width: 40px;
		height: 40px;
	}

	.shaft-load3 .shaft6 {
		-webkit-animation-delay: 0.6s;
		-moz-animation-delay: 0.6s;
		-o-animation-delay: 0.6s;
		animation-delay: 0.6s;
		width: 45px;
		height: 45px;
	}

	.shaft-load3 .shaft7 {
		-webkit-animation-delay: 0.7s;
		-moz-animation-delay: 0.7s;
		-o-animation-delay: 0.7s;
		animation-delay: 0.7s;
		width: 50px;
		height: 50px;
	}

	.shaft-load3 .shaft8 {
		-webkit-animation-delay: 0.8s;
		-moz-animation-delay: 0.8s;
		-o-animation-delay: 0.8s;
		animation-delay: 0.8s;
		width: 55px;
		height: 55px;
	}

	.shaft-load3 .shaft9 {
		-webkit-animation-delay: 0.9s;
		-moz-animation-delay: 0.9s;
		-o-animation-delay: 0.9s;
		animation-delay: 0.9s;
		width: 60px;
		height: 60px;
	}

	.shaft-load3 .shaft10 {
		-webkit-animation-delay: 1s;
		-moz-animation-delay: 1s;
		-o-animation-delay: 1s;
		animation-delay: 1s;
		width: 65px;
		height: 65px;
	}

	@-webkit-keyframes loading3 {
		50% {
			-webkit-transform: translate(-50%, -50%) rotate(360deg);
			-moz-transform: translate(-50%, -50%) rotate(360deg);
			-ms-transform: translate(-50%, -50%) rotate(360deg);
			-o-transform: translate(-50%, -50%) rotate(360deg);
			transform: translate(-50%, -50%) rotate(360deg);
			border-color: transparent transparent rgba(143, 165, 132, 0.1) #8fa584;
		}

		75% {
			border-color: rgba(143, 165, 132, 0.1) transparent transparent #8fa584;
		}
	}

	@-moz-keyframes loading3 {
		50% {
			-webkit-transform: translate(-50%, -50%) rotate(360deg);
			-moz-transform: translate(-50%, -50%) rotate(360deg);
			-ms-transform: translate(-50%, -50%) rotate(360deg);
			-o-transform: translate(-50%, -50%) rotate(360deg);
			transform: translate(-50%, -50%) rotate(360deg);
			border-color: transparent transparent rgba(143, 165, 132, 0.1) #8fa584;
		}

		75% {
			border-color: rgba(143, 165, 132, 0.1) transparent transparent #8fa584;
		}
	}

	@-o-keyframes loading3 {
		50% {
			-webkit-transform: translate(-50%, -50%) rotate(360deg);
			-moz-transform: translate(-50%, -50%) rotate(360deg);
			-ms-transform: translate(-50%, -50%) rotate(360deg);
			-o-transform: translate(-50%, -50%) rotate(360deg);
			transform: translate(-50%, -50%) rotate(360deg);
			border-color: transparent transparent rgba(143, 165, 132, 0.1) #8fa584;
		}

		75% {
			border-color: rgba(143, 165, 132, 0.1) transparent transparent #8fa584;
		}
	}

	@keyframes loading3 {
		50% {
			-webkit-transform: translate(-50%, -50%) rotate(360deg);
			-moz-transform: translate(-50%, -50%) rotate(360deg);
			-ms-transform: translate(-50%, -50%) rotate(360deg);
			-o-transform: translate(-50%, -50%) rotate(360deg);
			transform: translate(-50%, -50%) rotate(360deg);
			border-color: transparent transparent rgba(143, 165, 132, 0.1) #8fa584;
		}

		75% {
			border-color: rgba(143, 165, 132, 0.1) transparent transparent #8fa584;
		}
	}
</style>