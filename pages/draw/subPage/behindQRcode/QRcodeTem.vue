<template>
	<z-paging ref="pagingRef" :pagingStyle="{ background: 'rgb(246, 247, 249)',padding:'0 20rpx'}"
		:show-scrollbar="false">
		<template #top>
			<template v-if="!showOverlay">
				<CommonHeader :defindTitle="QRcodeParmas.title" />
			</template>
		</template>
		<view class="behindQRcode">
			<view class="behindQRcode_tabItems">
				<up-tabs customClass="customTabs" @change="changeTabs" lineColor="rgba(0,0,0,0)"
					:activeStyle="{background:'linear-gradient(to right,#314cd7,#ae1dfd)',color:'white',padding:'10rpx 30rpx', borderRadius: '40rpx'}"
					:inactiveStyle="{padding:'10rpx 30rpx'}" :current="RequestParmas.currentModes"
					:list="tabsData"></up-tabs>
				<view class="behindQRcode_history">
					<!-- 历史记录 -->
				</view>
			</view>

			<template v-if="RequestParmas.currentModes">
				<up-textarea height="300rpx" v-model="RequestParmas.textValue" placeholder="输入二维码内容  例如：已备案域名或合法的文本内容"
					count></up-textarea>
			</template>
			<template v-else>
				<ChangeImageItems v-model:RequestParmas="RequestParmas" />
			</template>

			<view class="behindQRcode_items">
				<view class="label">
					模型选择：
				</view>
				<view class="values">
					<view class="qrcodeItems">
						<template v-for="(items,index) in qrcodesLists" :key="index">
							<view :class="{qrcodeItems_single:true,activeItems:RequestParmas.seletedModel == items.id}">
								<image @click="RequestParmas.seletedModel = items.id " class="qrcodeItems_images"
									:src="items.thunmb" />
								<text class="qrcodeItems_single_text">{{items.title}}</text>
							</view>
						</template>
					</view>
				</view>
			</view>

			<view class="behindQRcode_items">
				<view class="label">
					明显程度（越小越容易扫描）：
				</view>
				<view class="values">
					<ImageLoraScale :stepList="[1,25,50,75,100]" v-model:sliderValue="RequestParmas.step" min='1'
						max='100' type="weight" />
				</view>
			</view>
		</view>
		<template #bottom>
			<view class="BtnGroup" v-if="!showOverlay">
				<up-button :custom-style="btnStyles" @click="onCreate">立即生成</up-button>
			</view>
		</template>
	</z-paging>
	<up-overlay :show="showOverlay">
		<view class="overlayMusicHeader">
			<view class="loadingMusicHeader" :style="{height: ScreenStore.navBarHeight + 'px' }">
				<view class="loadingMusicHeader_title">
					<up-icon @click="backPage" name="arrow-left"></up-icon>
					<text>等待二维码生成</text>
					<view class=""></view>
				</view>
			</view>
			<view class="loadingMusic">
				<view class="loadingMusic_loading">
					<template v-if="waitPages">
						<view class="waitPagespages">
							<image show-menu-by-longpress @click="previewImages" class="waitPagespages_images"
								:src="currentImages" />

							<view class="waitPagespages_bottom">
								<template v-for="(items,index) in resultImages" :key="index">
									<image @click="seletedImages(items)" show-menu-by-longpress
										class="waitPagespages_images" :src="items" />
								</template>
							</view>
						</view>
						<view class="waitPagespages_bottom_desc">
							点击预览图片长按保存图片
						</view>
					</template>
					<template v-else>
						<ZuiProgressCircle :range="[0, 360]" :position="progress" :ringWidth="20" :fixOverlay="true"
							:texture="gradientTexture" :direction="'clockwise'" :linecap="'round'">
							<view class="circle_view">
								<text class="circle_view_text">{{ (progress * 100).toFixed(0) }} %</text>
							</view>
						</ZuiProgressCircle>
						<text class="circle_view_desc">{{message}}</text>
					</template>
				</view>
			</view>
		</view>
	</up-overlay>

</template>

<script setup lang="ts">
	import ZuiProgressCircle from '../ZuiProgressCircle/components/zui-progress-circle/zui-progress-circle.vue'
	import CommonHeader from '@/components/CommonHeader.vue';
	import { QRcodeParmasInterface, tabsData, btnStyles, RequestParmasInterface, requestReq, gradientTexture } from './types'
	import ChangeImageItems from './ChangeImageItems'
	import ImageLoraScale from '../ChangeView/ImageLoraScale'
	import { ref, reactive, onMounted } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useScreenStore } from '@/store';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { storeToRefs } from "pinia"
	const waitPages = ref(false)
	const ScreenStore = useScreenStore()

	const { checkNumFun, checkSubmit } = useStreamHooks()
	const props = defineProps<{ QRcodeParmas : QRcodeParmasInterface }>()
	const { $api, $assets } = useGlobalProperties()
	const qrcodesLists = ref([])
	const resultImages = ref([])
	const message = ref('')
	const progress = ref(0.01)
	const showOverlay = ref(false)
	const currentImages = ref('')
	const parmas = reactive(requestReq)
	const RequestParmas = reactive<RequestParmasInterface>({
		currentModes: 0,
		textValue: '',
		imageUrl: '',
		seletedModel: '',
		step: 24,
		FileMode: ''
	})
	const changeTabs = ({ index }) => {
		RequestParmas.currentModes = index
	}
	const backPage = () => {
		showOverlay.value = false
	}
	const seletedImages = (url : string) => {
		currentImages.value = url
	}
	const previewImages = (url : string) => {
		uni.previewImage({
			urls: [currentImages.value]
		})
	}

	const onCreate = async () => {
		waitPages.value = false
		if (!RequestParmas.seletedModel) {
			uni.$u.toast('请先选择模型！')
			return
		}
		if (!RequestParmas.currentModes && !RequestParmas.imageUrl) {
			uni.$u.toast('请先上传图片！')
			return
		}
		if (RequestParmas.currentModes && !RequestParmas.textValue) {
			uni.$u.toast('请先上传二维码文字内容！')
			return
		}
		let QRcodeImageReq = null
		if (!RequestParmas.currentModes) {
			let formdata : any = null
			let isjson = false
			let isWeChatSendImages = false
			// #ifdef H5
			formdata = new FormData()
			formdata.append('file', RequestParmas.FileMode)
			// #endif

			// #ifdef MP-WEIXIN || APP
			formdata = { file: RequestParmas.FileMode }
			isjson = true
			isWeChatSendImages = true
			// #endif
			if (!await checkNumFun('draw_qrcode')) {
				return
			}
			QRcodeImageReq = await $api.post('https://open.aichatapi.com/api/v1/qrcode/free.scan', formdata, isjson, {}, null, isWeChatSendImages)
			if (QRcodeImageReq.code !== 200) {
				uni.$u.toast('请先上传正确的二维码图片！')
				return
			}

			// QRcodeImageReq = await $api.post('api/v1/ocr/qrcode', formdata, isjson, {}, null, isWeChatSendImages)
			if (typeof QRcodeImageReq == 'string') {
				QRcodeImageReq = JSON.parse(QRcodeImageReq)
			}
		}

		if (RequestParmas.currentModes || QRcodeImageReq.code == 200) {
			const qrcodeInfoReq = await $api.get(`api/v1/img/qrcode_info?id=${RequestParmas.seletedModel}`)
			if (qrcodeInfoReq.code == 200) {
				const QrcodesaddReq = await $api.post('api/v1/img/qrcodes_add', { ...qrcodeInfoReq.data.state, text: RequestParmas.currentModes ? RequestParmas.textValue : QRcodeImageReq.data })
				if (QrcodesaddReq.code == 200) {
					const newparma = { ...qrcodeInfoReq.data.param }
					const sendParmas = {
						qrcode: QrcodesaddReq.data,
						text: RequestParmas.currentModes ? RequestParmas.textValue : QRcodeImageReq.data,
						brightness_weight: newparma.bright,
						brightness_start: newparma.bright_start,
						brightness_end: newparma.bright_end,
						qrocde_weight: newparma.weight,
						qrcode_start: newparma.weight_start,
						qrcode_end: newparma.weight_end,
						model: newparma.model,
						prompt: newparma.prompt,
						negative_prompt: newparma.negative_prompt,
						simpler: newparma.simpler,
						seed: newparma.seed,
						cfg_scale: newparma.cfg_scale,
						sampler_name: newparma.newparma,
						width: newparma.width,
						height: newparma.height,
						loraId: "",
						loraScale: 66,
						num: 2
					}
					const txt2qrcodeReq = await $api.post('api/v1/img/txt2qrcode', sendParmas)
					await checkSubmit('fun')
					if (txt2qrcodeReq.code == 200) {
						QueryTask(txt2qrcodeReq.data.task_id)
						showOverlay.value = true
					} else {
						uni.$u.toast(txt2qrcodeReq.msg)
					}
				} else {
					uni.$u.toast(QrcodesaddReq.msg)
				}
			} else {
				uni.$u.toast(qrcodeInfoReq.msg)
			}
		} else {
			uni.$u.toast(QRcodeImageReq.msg)
		}
	}

	const QueryTask = async (task_id : string) => {
		const QueryReq = await $api.get('api/v1/img/query', { task_id })
		if (QueryReq.code == 200) {
			const data = QueryReq.data
			let r = (data.queue + 1) * 2;
			if (data.wait_for > r) {
				r = data.wait_for;
			}
			const m = parseInt(((data.wait_for / r) * 100).toString());
			if (data.state == '0') {
				message.value = '正在排队，预计需要' + r + '秒';
				progress.value = m / 100;
				await delay(5000)
				QueryTask(task_id)
			}
			if (data.state == '1') {
				message.value = '生成成功，正在取回图片，预计需要5-10秒';
				progress.value = m / 100;
				await delay(5000)
				QueryTask(task_id)
			} else if (data.state === '1' && data.do_use > 60) {
				await delay(3000)
				message.value = '请求超时，请重试....';

			}
			if (data.state == '2') {
				message.value = '生成成功,正在加载图片....';
				progress.value = m / 100;
				waitPages.value = true
				await delay(2000)
				resultImages.value = data.images
				currentImages.value = data.images[0]
			}

			if (data.state == '3') {
				message.value = '';
				uni.$u.toast('生成二维码失败，请重试....')
				await delay(3000)
				showOverlay.value = false
			}

		}
	}
	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	onMounted(() => {
		getQrcodeList()
	})


	const getQrcodeList = async () => {
		const qrcodesReq = await $api.get('api/v1/img/qrcodes')
		if (qrcodesReq.code == 200) {
			qrcodesLists.value = qrcodesReq.data
		} else {
			uni.$u.toast(qrcodesLists.msg)
		}
	}
</script>

<style lang="scss" scoped>
	.BtnGroup {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.label {
		font-size: 28rpx;
		font-weight: 800;
		padding-top: 20rpx;
	}

	.customTabs {
		// border: 2rpx solid #314cd7;
		border-radius: 50rpx;
		margin: 20rpx 0;
		justify-content: center;
		font-size: 27rpx;
	}

	.values {
		padding: 20rpx 0;
		font-size: 27rpx;
		height: 100%;
	}

	.noData {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 400rpx;

		&_image {
			width: 100%;
			height: 400rpx;
			padding: 0rpx 0;
		}

	}

	.behindQRcode {
		padding: 10rpx 0;

		&_tabItems {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 27rpx;
			color: $aichat-border-color;
		}
	}

	:deep(.u-tabs__wrapper__nav) {
		justify-content: center;

	}

	:deep(.u-tabs__wrapper__nav__item) {
		// padding: 0 50rpx
	}

	.qrcodeItems {
		display: flex;
		flex-wrap: wrap;


		&_single {
			display: flex;
			flex-direction: column;
			position: relative;
			margin: 10rpx;
			overflow: hidden;
			border-radius: 15rpx;

			border: 2rpx solid rgba(0, 0, 0, 0);

			&_text {
				font-size: 27rpx;
				position: absolute;
				bottom: 0;
				display: block;
				width: 100%;
				text-align: center;
				background-color: rgba(0, 0, 0, 0.5);
				color: white;
				padding: 5rpx 0;

			}
		}

		&_images {
			width: 150rpx;
			height: 150rpx;



		}
	}

	.activeItems {
		border: 3rpx solid rgb(174, 29, 253);
	}


	.overlayMusicHeader {
		width: 100%;
		height: 100%;
		background-color: #fff;

	}

	.loadingMusicHeader {
		font-weight: 800;
		font-size: 30rpx;
		display: flex;
		align-items: flex-end;

		&_title {
			padding: 18rpx;
			display: flex;
			justify-content: space-between;
			width: 100%;
		}
	}

	.loadingMusic {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		padding: 20rpx 0;

		&_loading {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		&_desc {
			display: flex;
			font-weight: 800;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}

	.circle_view {
		display: flex;
		align-items: center;
		flex-direction: column;
		height: 100%;
		justify-content: center;


		&_text {
			font-size: 40rpx;
			font-weight: 1000;
		}

		&_desc {
			display: block;
			margin: 50rpx 0;
			font-size: 30rpx;
			text-align: center;
		}
	}

	.waitPagespages {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		&_images {
			width: 300rpx;
			height: 300rpx;
			margin: 20rpx;
		}

		&_desc {
			display: flex;
			justify-content: center;
		}

		&_bottom {
			width: 100vw;
			display: grid;
			overflow: scroll;
			margin: 20px 0;
			grid-template-columns: repeat(4, 1fr);

		}
	}
</style>