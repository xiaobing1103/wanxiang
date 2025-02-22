<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<template v-if="!showOverlay">
				<CommonHeader defindTitle="真人转3D" />
			</template>
		</template>
		<view class="aiRever3D">
			<ChangeFaceUploadImage noUseCorpImage v-model:images="parmas.imageUrl" v-model:FileMode="parmas.FileMode" />
			<Revers3DTem v-model:parmas="parmas" />
		</view>
		<template #bottom>
			<template v-if="!showOverlay">
				<up-button :customStyle="btnStyles" @click="create3D">开始生成</up-button>
			</template>
		</template>
	</z-paging>
	<up-overlay z-index="10" :show="showOverlay">
		<view class="overlayMusicHeader">
			<view class="loadingMusicHeader" :style="{height: ScreenStore.navBarHeight + 'px' }">
				<view class="loadingMusicHeader_title">
					<up-icon @click="backPage" name="arrow-left"></up-icon>
					<text>等待图片生成</text>
					<view class=""></view>
				</view>

			</view>
			<view class="loadingMusic">
				<view class="loadingMusic_loading">
					<template v-if="waitPages">
						<view class="waitPagespages">
							<image @click="previewImage(CurrentImages)" show-menu-by-longpress
								class="waitPagespages_images" :src="CurrentImages" mode="aspectFit" />
							<view class="waitPagespages_bottom">
								<template v-for="(items,index) in parmas.showImg" :key="index">
									<image @click="CurrentImages = items" show-menu-by-longpress
										class="waitPagespages_bottom_images" :src="items" mode="aspectFit" />
								</template>

							</view>
							<view class="tips">
								<up-button @click="saveImages">保存图片</up-button>
							</view>
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
	import CommonHeader from '@/components/CommonHeader.vue'
	import ChangeFaceUploadImage from '../CommonChangeFace/ChangeFaceUploadImage.vue'
	import Revers3DTem from './Revers3DTem.vue'
	import ZuiProgressCircle from '../ZuiProgressCircle/components/zui-progress-circle/zui-progress-circle.vue'
	import { reactive, ref } from 'vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks'
	import { parmasTypes } from './types'
	import { useStreamHooks } from '@/hooks/useStreamHooks'
	import { useScreenStore } from '@/store';
	import { storeToRefs } from "pinia"
	import { downloadBase64Image } from '@/utils/downLoadLocal';
	import { downloadReport } from '@/utils'
	const ScreenStore = useScreenStore()
	const gradientTexture = [
		[
			45,
			'#FF66B2',
			'#6A0D91'
		],
		[
			135,
			'#E0F7FA',
			'#00796B'
		]
	];
	const { checkNumFun, checkSubmit } = useStreamHooks()
	const { $api } = useGlobalProperties()
	const showOverlay = ref(false)
	const showupOverlay = ref(false)
	const waitPages = ref(false)
	const progress = ref(0.01)
	const message = ref('')
	const CurrentImages = ref('')
	const btnStyles = {
		margin: "30rpx auto",
		height: '70rpx',
		borderRadius: '100rpx',
		border: '0rpx',
		width: '70%',
		color: 'white',
		background: 'linear-gradient(to right, rgb(49, 76, 215), rgb(174, 29, 253))'
	};
	const parmas = reactive<parmasTypes>({
		seletedNumber: 1,
		face_restoration: 0,
		hand_restoration: 0,
		denoising_strength: 6,
		steps: 20,
		batch_size: 1,
		imageUrl: '',
		prompt: '',
		FileMode: null,
		width: '',
		height: '',
		showImg: []
	})
	const previewImage = (url : string) => {
		uni.previewImage({
			urls: [url],
		})
	}
	const create3D = async () => {
		if (!parmas.FileMode) {
			uni.$u.toast('请先上传本地图片！');
			return
		}
		const PromptPromise = await imgPropmt()
		if (!PromptPromise) {
			uni.$u.toast('prompt解析失败请重新解析！');
			return
		}
		if (checkNumFun('draw')) {
			const img3DPro = await img3D()
			if (!img3DPro) {
				uni.$u.toast('3D模型解析失败请重新解析！');
				return
			}
			queryTask(img3DPro)
		}
	}

	const imgPropmt = () => {
		return new Promise(async (resolve, reject) => {
			let formdata : any = null
			let isJson = false
			let isWechatSendImages = false
			// #ifdef H5
			formdata = new FormData()
			formdata.append('img', parmas.FileMode)
			// #endif
			// #ifdef MP-WEIXIN ||  APP
			formdata = { img: parmas.FileMode }
			isJson = true
			isWechatSendImages = true
			// #endif
			let imgPropmtReq = null
			imgPropmtReq = await $api.post('api/v1/img/prompt', formdata, isJson, {}, null, isWechatSendImages)
			if (typeof imgPropmtReq == 'string') {
				imgPropmtReq = JSON.parse(imgPropmtReq)
			}
			if (imgPropmtReq.code == 0) {
				parmas.prompt = imgPropmtReq.data
				parmas.width = imgPropmtReq.width
				parmas.height = imgPropmtReq.height
				resolve(true)
			} else {
				reject(false)
			}
		})
	}

	const img3D = () => {
		return new Promise(async (resolve, reject) => {
			const data = {
				"lora": {
					"lora_prompt": "<lora:kk-3d:1>,3D,kk(3d character),"
				},
				"loraId": "",
				"option": {
					"sd_checkpoints_limit": 5,
					"CLIP_stop_at_last_layers": 2,
					"sd_model_checkpoint": "IP DESIGN _ 3D可爱化模型_V4.0.safetensors"
				},
				"param": {
					"batch_size": parmas.batch_size,
					"face_restoration": parmas.face_restoration,
					"hand_restoration": parmas.hand_restoration,
					"denoising_strength": parmas.denoising_strength / 10,
					"width": parmas.width,
					"steps": parmas.steps,
					"height": parmas.height,
					"prompt": "1boy, male focus, glasses, solo, shirt, black hair, smile, realistic, white shirt, looking at viewer, upper body, blurry, blurry background, collared shirt",
					"init_images": [parmas.imageUrl],
					"cfg_scale": 7,
					"inpainting_mask_invert": 1,
					"negative_prompt": "EasyNegative,ng_deepnegative_v1_75t",
					"sampler_name": "DPM++ 2M",
					"scheduler": "Karras",
					"seed": -1,
					"translate": 0
				}
			}
			const Ima3dReq = await $api.post('api/v1/img/3d', data)
			if (Ima3dReq.code == 0) {
				progress.value = 0
				showOverlay.value = true
				waitPages.value = false
				resolve(Ima3dReq.task_id)
			} else {
				reject(false)
			}
		})
	}
	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	const queryTask = async (taskId : string) => {
		const queryReq = await $api.post('api/v1/img/3d_query', { task_id: taskId })
		if (queryReq.code == 1) {
			await delay(3000)
			queryTask(taskId)
			progress.value += 5 / 100;
			message.value = queryReq.msg
			return
		}
		if (queryReq.code == 2) {
			await delay(3000)
			queryTask(taskId)
			message.value = queryReq.msg
			return
		}
		if (queryReq.code == 0) {
			await checkSubmit('draw')
			waitPages.value = true
			parmas.showImg = queryReq.msg.images
			CurrentImages.value = queryReq.msg.images[0]
		}
		message.value = queryReq.msg
	}
	const backPage = () => {
		showOverlay.value = false
	}
	const saveImages = () => {
		// #ifdef H5
		downloadBase64Image(CurrentImages.value, '下载')
		// #endif
		// #ifdef MP-WEIXIN || APP
		downloadReport(CurrentImages.value).then((res) => {
			uni.$u.toast(res);
		}).catch((err) => {
			console.log(err)
			uni.$u.toast(err);
		})
		// #endif

	}
</script>


<style lang="scss" scoped>
	.aiRever3D {
		display: flex;
		flex-direction: column;
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

			height: 300rpx;
			margin: 20rpx;
		}

		&_bottom {
			width: 100vw;
			display: grid;
			overflow: scroll;
			margin: 20px 0;
			grid-template-columns: repeat(4, 1fr);

			&_images {
				padding: 20rpx;
				height: 200rpx;
				width: 160rpx;
			}
		}
	}

	.tips {
		font-size: 30rpx;
		font-weight: 800;
	}
</style>