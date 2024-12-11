<template>
	<z-paging :scroll-with-animation="true" :show-scrollbar="false" ref="pagingRef" :pagingStyle="{padding:'0rpx'}">
		<template #top>
			<template v-if="!showOverlay">
				<MusicHeader v-model:currentPages="currentPages" />
			</template>
		</template>
		<view class="AIMusicTemplate">
			<template v-if="currentPages == 0">
				<DefaultMusicPages v-model:commonParmas="commonParmas" :style="{width:'100%'}"
					v-model:currentPages="currentPages" />
			</template>
			<template v-if="currentPages == 1">
				<DefaultMusicPages v-model:commonParmas="commonParmas" :style="{width:'100%'}"
					v-model:currentPages="currentPages" />
			</template>
			<template v-if="currentPages == 2">
				<MyCreateMusicPages v-model:playMuiscParmas="playMuiscParmas" :style="{width:'100%'}"
					v-model:currentPages="currentPages" v-model:succes="succes" @overPlays="overPlays" />
			</template>
		</view>
		<template #bottom>
			<view class="bottom" v-if="!showOverlay && currentPages !==2">
				<up-button
					:customStyle="{width:'50%',background:'linear-gradient(99.36deg, rgb(180, 88, 255) 0%, rgb(252, 106, 201) 100%)',height:'70rpx',color:'#fff',borderRadius:'35rpx'}"
					class="bottom_create" @click="beginCreate">开始创作</up-button>
			</view>
			<template v-if="playMuiscParmas.isPalyMusic">
				<NewCxAudioplay ref='CxAudioplayRef' v-model:succes="succes" v-model:num="num"
					v-model:list="playMuiscParmas.list" v-model:recorPath="playMuiscParmas.currentUrl" />
			</template>
		</template>
	</z-paging>
	<up-overlay :show="showOverlay">
		<view class="overlayMusicHeader">
			<view class="loadingMusicHeader" :style="{height: navBarHeight + 40+ 'px' }">
				<view :style="{paddingTop:menuButtonInfo?.top + 'px'}">
					<view class="loadingMusicHeader_title">
						<up-icon @click="backPage" name="arrow-left"></up-icon>
						<text>AI音乐创作</text>
						<view class="">

						</view>
					</view>
				</view>
				<view class="loadingMusic">
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
						<text>AI正在努力创作歌曲，预计4分钟...</text>
						<text>倒计时： {{ countdown }} 秒</text>
					</view>
				</view>
			</view>
		</view>
	</up-overlay>
</template>

<script setup lang="ts">
	import { nextTick, ref, reactive, onMounted } from 'vue';
	import MusicHeader from './MusicHeader.vue'
	// import CxAudioplay from '../cx-audio-play/cx-audio-play.vue'
	import NewCxAudioplay from '../cx-audio-play/index.vue'
	import MyCreateMusicPages from './MyCreateMusicPages.vue'
	import DefaultMusicPages from './DefaultMusicPages.vue'
	import { debounce } from '@/utils';
	import { useUserStore, useCounterStore, useMusicStore } from '@/store';
	import { commonParmasType } from '../types';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { storeToRefs } from "pinia"
	import { deepClone } from '@/utils/deepClone';
	const { checkNumFun, checkSubmit } = useStreamHooks()
	//  #ifdef MP-WEIXIN
	const system = useCounterStore()
	const { statusBarHeight, menuButtonInfo, navBarHeight } = storeToRefs(system)
	statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight
	menuButtonInfo.value = uni.getMenuButtonBoundingClientRect()
	navBarHeight.value = menuButtonInfo.value.height + statusBarHeight.value + 10
	// #endif
	const num = ref(0)
	const MusicStore = useMusicStore()
	const CxAudioplayRef = ref(null)
	const UserStore = useUserStore()
	const pagingRef = ref(null)
	const countdown = ref(240);
	const queryxun = ref('')
	const showOverlay = ref(false)
	const { $api } = useGlobalProperties()
	const runTask = ref([])

	const succes = ref(false)
	const playMuiscParmas = reactive({
		list: [],
		isPalyMusic: false,
		currentUrl: '',

	})

	const overPlays = (boo : boolean) => {
		num.value = playMuiscParmas.list.findIndex((item) => item == playMuiscParmas.currentUrl)
		if (boo) {
			CxAudioplayRef.value?.plays('play')
		} else {
			CxAudioplayRef.value?.plays('pause')
		}
	}

	const commonParmas = reactive<commonParmasType>({
		prompt: '',
		title: '',
		tags: [],
		make_instrumental: 0,
		mv: 'chirp-v3-5',

	})
	const backPage = () => {
		showOverlay.value = false
	}
	// 模拟倒计时
	const startCountdown = () => {
		const interval = setInterval(() => {
			countdown.value--;
			if (countdown.value === 0) {
				clearInterval(interval);
				console.log('132');
			}
		}, 1000);
	};
	const beginCreate = async () => {

		sendFormDataFun()
	}
	//滚动到底部
	const onScroolToBottom = debounce(() => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
		})
	}, 500)
	const props = defineProps<{ publicMethods : any }>()
	const currentPages = ref(0)
	onMounted(() => {
		currentPages.value = props.publicMethods.currentPages
	})
	const sendFormDataFun = async () => {
		if (currentPages.value == 0) {
			if (!commonParmas.title) {
				uni.$u.toast('请先输入歌曲名称！')
				return
			}
		}
		if (!commonParmas.prompt || commonParmas.prompt.length >= 200) {
			uni.$u.toast('请先输入歌词描述,且字数不得超过200字！')
			return
		}
		if (commonParmas.tags.length == 0) {
			commonParmas.tags = ''
		}

		if (!await checkNumFun('fun_music')) {
			return
		}
		await checkSubmit('fun_music')
		let formdata : commonParmasType | FormData
		commonParmas.make_instrumental = commonParmas.make_instrumental ? 1 : 0
		const sendTags = commonParmas.tags.toString()
		let isformDataRequest = true;
		let isWeChatSendImages = false;
		// #ifdef H5
		formdata = new FormData()
		for (const key in commonParmas) {
			if (key !== 'tags') {
				if (commonParmas[key]) {
					formdata.append(key, commonParmas[key])
				}
				if (key == 'make_instrumental') {
					formdata.append(key, commonParmas[key])
				}
			}

		}
		if (sendTags) {
			formdata.append('tags', sendTags)
		}
		formdata.append('appid', UserStore?.userInfo?.appid)
		formdata.append('uid', UserStore.userInfo?.id)
		// #endif

		// #ifdef MP-WEIXIN
		formdata = deepClone(commonParmas)
		formdata.tags = sendTags
		formdata.uid = UserStore.userInfo?.id
		formdata.appid = UserStore?.userInfo?.appid
		// #endif

		const createReq = await $api.post('api/v1/music/custom_create', formdata, isformDataRequest, {}, null, isWeChatSendImages);
		if (createReq.code == 200) {
			showOverlay.value = true
			startCountdown()
			runTask.value = createReq.data
			queryMusic(runTask.value[0])
			queryxun.value = runTask.value[0]
		}
	}
	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	const queryMusic = async (recivedQueryArr : string[]) => {

		const MusicQuery = await $api.post('api/v1/music/query', { task_id: recivedQueryArr })
		if (MusicQuery.code == 200) {
			if (MusicQuery.data.code !== -1) {
				if (MusicQuery.data.code == 1) {
					await delay(4000);
					uni.$u.toast(MusicQuery.data.msg)
					queryMusic(recivedQueryArr)
				}
				if (MusicQuery.data.code == 0) {
					if (MusicQuery.data.task_id == queryxun.value) {
						MusicStore.addMusicHistoryData(MusicQuery.data)
						queryMusic(runTask.value[1])
						return
					}
					MusicStore.addMusicHistoryData(MusicQuery.data)
					uni.$u.toast(MusicQuery.data.msg)
					showOverlay.value = false
					currentPages.value = 2

				}
			}
		} else {
			uni.$u.toast('请求失败，请重试')
			showOverlay.value = false
		}
	}
</script>

<style lang="scss" scoped>
	.AIMusicTemplate {
		display: flex;
		width: 100%;
		padding: 24rpx;
		height: 100%;
	}

	.bottom {
		padding: 20rpx;
		width: 100%;

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

	.overlayMusicHeader {
		width: 100%;
		height: 100%;
		background-color: #fff;

	}

	.loadingMusicHeader {

		font-weight: 800;
		font-size: 30rpx;

		&_title {
			padding: 18rpx;
			display: flex;
			justify-content: space-between;

		}
	}
</style>