<template>
	<z-paging :scroll-with-animation="true" :show-scrollbar="false" ref="pagingRef" :pagingStyle="{padding:'0 40rpx'}">
		<template #top>
			<template v-if="!SoraPromptPramas.showVideo">
				<CommonHeader :defindTitle="allParmas.title" />
			</template>
		</template>

		<view class="AIVideoCommon">
			<view class="AIVideoCommon_tabs">
				<up-tabs :current="allParmas.currentPages" lineColor="rgba(0,0,0,0)"
					:inactiveStyle="{padding:'10rpx 30rpx'}"
					:activeStyle="{background:'linear-gradient(to right,#314cd7,#ae1dfd)',color:'white',padding:'10rpx 30rpx', borderRadius: '40rpx'}"
					customClass="customTabs" :list="list1" @change="changeTabs"></up-tabs>
				<view class="AIVideoCommon_history" @click="toVideoHistory">
					历史记录
				</view>
			</view>
		</view>
		<template v-if="!allParmas.currentPages">
			<SoraPrompt v-model:SoraPromptPramas="SoraPromptPramas" :currentPages="allParmas.currentPages" />
		</template>
		<template v-if="allParmas.currentPages">
			<SoraPrompt v-model:SoraPromptPramas="SoraPromptPramas" :currentPages="allParmas.currentPages" />
		</template>
		<template #bottom>
			<template v-if="!SoraPromptPramas.showVideo">
				<view class="bottom">
					<up-button @click="createVideo"
						:customStyle="{width:'80%',height:'70rpx',background: 'linear-gradient(to right,#314cd7,#ae1dfd)',color:'white',border:'0rpx', borderRadius: '35rpx'}">开始创作</up-button>
				</view>
			</template>
		</template>
	</z-paging>
	<VideoItems v-model:SoraPromptPramas="SoraPromptPramas" />
	<up-modal @confirm="SoraPromptPramas.openModal = false" :show="SoraPromptPramas.openModal" title="温馨提示">
		<view class="Tipsmodal">
			{{Tips}}
		</view>
	</up-modal>

</template>

<script setup lang="ts">
	import { onMounted, reactive, ref, nextTick } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue';
	import SoraPrompt from './SoraPrompt.vue'
	import VideoItems from './VideoItems.vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { VideoVmodalType, Tips } from './datas';
	import { useMusicStore, useChatStore } from '@/store';
	import { useStreamHooks } from '@/hooks/useStreamHooks';

	const MusicStore = useMusicStore()
	const { streamRequest, isRecive , streamSpark } = useStreamHooks()
	const { $api } = useGlobalProperties()
	const queryId = ref('')
	const ChatStore = useChatStore()
	const allParmas = defineModel<{ title : string, currentPages : number }>('allParmas')
	const list1 = reactive([
		{ name: '文生视频' },
		{ name: '图生视频' },
	])
	const toVideoHistory = () => {
		uni.navigateTo({
			url: '/pages/function/subPage/TextCreateVideo/videoHistory/index'
		})
	}
	const SoraPromptPramas = reactive<VideoVmodalType>({
		showVideo: false,
		playVideo: '',
		prompt: '',
		restNum: 0,
		openModal: false,
		openVipModal: false,
		cover_image_url: '',
		isQuery: false,
		image_url: undefined,
		aloneChecked: false
	})

	const changeTabs = ({ index }) => {
		allParmas.value.currentPages = index
	}

	const createVideo = async () => {
		if (!allParmas.value.currentPages && !SoraPromptPramas.prompt) {
			uni.$u.toast('请先输入灵感描述词！')
			return
		}
		if (allParmas.value.currentPages && !SoraPromptPramas.image_url) {
			uni.$u.toast('请先上传生成图片！')
			return
		}
		await onFetchChat(SoraPromptPramas.prompt)



	}
	onMounted(() => {
		getCounts()
	})
	const getCounts = async () => {
		const countReq = await $api.post('api/v1/video/count', {})
		if (countReq.code == 200) {
			SoraPromptPramas.restNum = countReq.data
		}
	}

	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	const queryVideo = async () => {
		const queryReq = await $api.post('api/v1/video/query', { id: queryId.value })
		if (queryReq.code == 200) {
			if (queryReq.data.task_status == "PROCESSING") {
				await delay(5000)
				queryVideo()
			}
			if (queryReq.data.task_status == "SUCCESS") {
				SoraPromptPramas.cover_image_url = queryReq.data.video_result[0].cover_image_url
				SoraPromptPramas.playVideo = queryReq.data.video_result[0].url
				queryReq.data.video_result[0].title = SoraPromptPramas.prompt
				MusicStore.addVideoHistoryData(queryReq.data.video_result[0])
				SoraPromptPramas.isQuery = false
			}
		}
	}


	const onFetchChat = async (content : string) => {
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		const questions = [
			{
				role: 'user',
				content
			}
		]
		const data = {
			model_id: "196a424d-a5d7-ceb1-8205-c3007e6525ce",
			params: JSON.stringify(questions),
			prompt: null,
		}
		SoraPromptPramas.prompt = ''
		let newStr = ''
		const streamOptions = {
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage: async (text : string) => {
				newStr += text
				SoraPromptPramas.prompt  =await streamSpark(newStr)
			},
			async onfinish() {
				console.log('成功')
				nextTick(async () => {
					const datas = {
						model: "cogvideox",
						prompt: SoraPromptPramas.prompt,
						image_url: SoraPromptPramas.image_url
					}
					const VideoCreateReq = await $api.post('api/v1/video/create', datas)
					if (VideoCreateReq.code == 200) {
						queryId.value = VideoCreateReq.data.id
						getCounts()
						SoraPromptPramas.isQuery = true
						SoraPromptPramas.showVideo = true
						await delay(2000)
						queryVideo()
					} else {
						uni.$u.toast(VideoCreateReq.msg)
					}
				})

			},
			onerror(err) {
				if (err.includes('请升级会员')) {
					ChatStore.setShowLevelUpVipContent(err)
					ChatStore.setShowlevelUpVip(true)
				}
				console.log(err, "错误")
			},
			checkNumsType: 'fun'
		}
		streamRequest(streamOptions)
	}
</script>


<style scoped lang="scss">
	.bottom {
		width: 100%;
		padding: 20rpx 0;
	}

	.AIVideoCommon {
		display: flex;
		flex-direction: column;

		&_tabs {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		&_history {
			font-size: 27rpx;
			color: #314cd7;
		}
	}

	.customTabs {
		border: 2rpx solid #314cd7;
		border-radius: 50rpx;
		margin: 20rpx 0;
		font-size: 27rpx;
	}

	.header {
		display: flex;
		justify-content: flex-start;
		padding: 20rpx 50rpx;
	}

	.Tipsmodal {
		overflow-y: scroll;
		height: 700rpx;
		white-space: pre-line;
	}
</style>