<template>
	<z-paging :pagingStyle="{ background: 'rgb(246, 247, 249)'}" :show-scrollbar=" false">
		<template #top>
			<CommonHeader :defindTitle="parmas.title" />
		</template>
		<view class="TranslatePages">
			<view class="uploadFileTranslate">
				<view class="uploadFileTranslate_top" @click="changeLang">
					<view class="uploadFileTranslate_left">
						源语言
					</view>
					<view class="uploadFileTranslate_middle">
						→
					</view>
					<view class="uploadFileTranslate_right">
						{{currentLang}} <up-icon :style="{margin:'0 10rpx'}" name="arrow-down" size="15"></up-icon>
					</view>
				</view>
				<view class="uploadFileTranslate_content">
					<view class="translateContent">
						<view class="translateContent_top">
							点击上传需要翻译的文档
						</view>
						<view class="translateContent_middle">
							<up-button :customStyle="{margin:'0 20rpx',flex:1}" type="primary"
								@click="openImages">体验示例文档</up-button>
							<!-- #ifdef APP -->
							<UploadDemo :count="1" @UploadCallback="afterRead" type="file">
								<template #defaultTemplate>
									<up-button :customStyle="{margin:'0 20rpx',flex:1}" :disabled="isTransLateLoading"
										type="primary">上传文档</up-button>
								</template>
							</UploadDemo>
							<!-- #endif -->
							<!-- #ifndef APP -->
							<up-upload :customStyle="{width:'100%',display:'flex',alignItems:'center',}"
								:fileList="fileList1" @afterRead="afterRead" name="4" multiple accept="all"
								:maxCount="1">
								<up-button :customStyle="{margin:'0 20rpx',flex:1}" :disabled="isTransLateLoading"
									type="primary">上传文档</up-button>
							</up-upload>
							<!-- #endif -->
						</view>
						<view class="translateContent_buttom">
							<view class="translateContent_buttom_items">
								<text>支持格式：</text>
								<image :style="{width:'25rpx',height:'30rpx',padding:'0 5rpx '}"
									src="//file.1foo.com/2024/10/19/fcdf9e3eb07feae1362125abf6dc6f5e.svg" mode="">
								</image>
								<text> pdf (只支持扫描文件)</text>
								<template v-if="parmas.title == 'AI文档翻译2.0'">
									<image :style="{width:'25rpx',height:'30rpx',padding:'0 5rpx'}"
										src="//file.1foo.com/2024/10/19/b9d1db39b6e9d44dbfdda223ba59e258.svg" mode="">
									</image>word
								</template>
							</view>
							<view class="translateContent_buttom_items">
								支持语言: 中、英互译
							</view>
							<view class="translateContent_buttom_items">
								<text> 支持大小: 15MB、500页以内</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="fileLists"></view> -->

			<image @click="previewImages(images[seletedNum])" class="uploadFileTranslate_previewimage"
				:src="images[seletedNum]" mode="">
			</image>
			<view class="uploadFileTranslate_preview" :style="{color: index ==seletedNum ? '#0ba4b5':'' }"
				v-for="(items,index) in swiperList1" :key="index" @click="seletedIndex(index)">
				<view class="uploadFileTranslate_preview_title">
					{{items.title}}
				</view>
				<view class="uploadFileTranslate_preview_desc">
					{{items.desc}}
				</view>
			</view>
		</view>
	</z-paging>
	<up-popup :show="openPopup" round="15" @open="openPopup = true" @close="openPopup = false">
		<view class="upPopupLayout">
			<view class="upPopup" v-for="(items,index) in languages" :key="index"
				@click="currentLang = items;openPopup=false">
				<text :style="{color:  currentLang ==items ? '#2979ff':'' }">{{items}}</text>
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	// #ifdef APP
	import UploadDemo from '@/pages/index/subPage/components/UploadDemo.vue'
	// #endif
	import CommonHeader from '@/components/CommonHeader.vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { languages } from './type'
	import { onMounted, reactive, ref } from 'vue';
	import { uploadFileBefore } from '@/utils';
	import { useUserStore } from '@/store';
	import { saveFile } from './downLoadLocal';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	const currentLang = ref('英文')
	const props = defineProps<{ parmas : { title : string, type : string } }>()
	const openPopup = ref(false)
	const isTransLateLoading = ref(false)
	const { userInfo } = useUserStore()
	const taskId = ref('')
	const { $api } = useGlobalProperties()
	const { checkNumFun, checkSubmit, verifyTranslateTextLimit } = useStreamHooks()
	const changeLang = () => {
		openPopup.value = !openPopup.value
	}
	const maxNumber = ref()
	onMounted(async () => {
		const checkNumData = await checkNumFun('doc_length')
		if (checkNumData) {
			maxNumber.value = checkNumData.maxNumber
		}
	})
	const seletedNum = ref(0)
	const images = ['https://file.1foo.com/2024/10/19/e959ca7fe809f2afd37ef9786b9e320f.png', 'https://file.1foo.com/2024/10/19/93d5c5cd054849feda312db69936ba7f.png', 'https://file.1foo.com/2024/10/19/71840afbe53c43a75b9facc57d21fe9e.png', 'https://file.1foo.com/2024/10/19/c77ea7ec2a77c890ae45daf958176c1b.png']
	const seletedIndex = (index : number) => {
		seletedNum.value = index
	}
	const swiperList1 = reactive([
		{
			title: '排版格式还原,精确保留文档原貌',
			desc: '确保每一段、每个图表都与原文档完美匹配，无缝保留结构细节'
		},
		{
			title: '领先大模型：革新学术翻译',
			desc: '基于全球尖端大模型，确保翻译结果既忠实原意，也符合专业标准'
		},
		{
			title: '术语精准还原：纯正学术表达',
			desc: '覆盖逾800+学科、6000万+术语词汇库，赋予译文深度的学术支撑'
		},
		{
			title: '语境适应：理解复杂文本',
			desc: '不再是单词直译，能结合上下文，确保内容符合其特定领域的真实含义'
		},
	])
	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	let persent = 2
	const TaskLoop = async (task : string, type ?: string) => {
		return new Promise(async (resolve, reject) => {
			try {
				persent += 2
				if (persent == 100) {
					persent = 100
				}
				const typeName = type ? 'task_id' : 'task'
				let data = {
					[typeName]: task
				}
				const progressReq = await $api.post(type ? 'api/v1/doc/translate_query' : 'api/v1/pdf/progress', data, false, {}, { title: `正在翻译中, 进度${persent}% 请稍等...`, showLoading: true });

				if (type) {
					if (progressReq.code == 1) {
						await delay(2000);
						TaskLoop(task, type).then(resolve).catch(reject);
						return
					}
					if (progressReq.code === 0) {
						uni.$u.toast(progressReq.msg);
						resolve(progressReq);
					}
				} else {
					if (progressReq.code === 200) {
						if (progressReq.msg === '翻译中') {
							await delay(2000);
							TaskLoop(task, type).then(resolve).catch(reject);
							return
						}
						if (progressReq.msg === '翻译成功') {
							uni.$u.toast(progressReq.msg);
							resolve(progressReq);
						} else {
							uni.$u.toast('解析文档错误，请您重试，本次不会计算次数！');
							reject(new Error(`Unexpected message: ${progressReq.msg}`));
						}
					} else {
						uni.$u.toast('解析文档错误，请您重试，本次不会计算次数！');
						reject(new Error(`API error: ${progressReq.code}`));
					}
				}
			} catch (error) {
				reject(error);
			}
		});
	}
	const transLate20 = (returnDatas : {
		fileName : string,
		fileType : string,
		formdata : null,
		response : null,
		isJson : boolean,
		isWechatSendImages : boolean,
		originFormData : null | any
		maxNumber : number
	}) : string | boolean => {
		let formdata : any = null
		return new Promise(async (resolve, reject) => {
			let docTranslateReq = await $api.post('api/v1/doc/translate', returnDatas.originFormData, returnDatas.isJson, {}, null, returnDatas.isWechatSendImages)
			if (typeof docTranslateReq == 'string') {
				docTranslateReq = JSON.parse(docTranslateReq)
			}
			if (docTranslateReq.code == 0) {
				resolve(docTranslateReq.task_id)
			} else {
				uni.$u.toast('获取任务失败！')
				reject(false)
			}
		})
	}

	const afterRead = async (event : { file : any; }) => {
		if (isTransLateLoading.value) {
			uni.$u.toast('翻译执行中，请等待...')
			return
		}
		let fileTypeArr = ['pdf']
		if (props.parmas.title == 'AI文档翻译2.0') {
			fileTypeArr = ['pdf', 'docx']
		}
		const returnDatas = await uploadFileBefore(event, fileTypeArr, null, null, currentLang.value, maxNumber.value)
		console.log(returnDatas)
		if (!await checkNumFun('fun_doc_translate')) {
			return
		}
		if (returnDatas) {
			let ReadFileReq = await $api.post('api/v1/pdf/format_translate', returnDatas.formdata, returnDatas.isJosn, {}, null, returnDatas.isWechatSendImages)
			if (typeof ReadFileReq == 'string') {
				ReadFileReq = JSON.parse(ReadFileReq)
			}
			if (ReadFileReq.code == 0) {
				taskId.value = ReadFileReq.task_id
				isTransLateLoading.value = true
				await checkSubmit('fun_doc_translate')
				queryOneTranlate()
			}

			// if (ReadFileReq.code == 200) {
			// 	if (!verifyTranslateTextLimit(ReadFileReq.data)) {
			// 		uni.$u.toast('字数超出限制！')
			// 		return
			// 	}
			// 	if (props.parmas.type == 'TranslateTem20') {
			// 		const transLate20R = await transLate20(returnDatas)
			// 		isTransLateLoading.value = true
			// 		if (transLate20R) {
			// 			const TaskLoopPro = await TaskLoop(transLate20R as string, props.parmas.type)
			// 			if (TaskLoopPro) {
			// 				isTransLateLoading.value = false
			// 				saveFile(TaskLoopPro.url, returnDatas.fileType)
			// 				await checkSubmit('fun_doc_translate')
			// 			} else {
			// 				isTransLateLoading.value = false
			// 			}
			// 		}
			// 	} else {

			// 		let UploadPdfReq = await $api.post('api/v1/pdf/uploadPdf', returnDatas.formdata, returnDatas.isJosn, {}, null, returnDatas.isWechatSendImages)
			// 		if (typeof UploadPdfReq == 'string') {
			// 			UploadPdfReq = JSON.parse(UploadPdfReq)
			// 		}
			// 		if (UploadPdfReq.code == 200) {
			// 			const TranslateReq = await $api.post('api/v1/pdf/translate', {
			// 				dstLang: currentLang.value,
			// 				fileUrl: 'upload/' + UploadPdfReq.data.url,
			// 				format: returnDatas.fileType,
			// 				uid: userInfo.id + '',
			// 			})

			// 			if (TranslateReq.code == 200) {
			// 				isTransLateLoading.value = true
			// 				TaskLoop(TranslateReq.data).then(async (res) => {
			// 					isTransLateLoading.value = false
			// 					saveFile(res.data.url, returnDatas.fileType)
			// 					await checkSubmit('fun_doc_translate')
			// 				}).catch((err) => {
			// 					isTransLateLoading.value = false
			// 				})
			// 			} else {
			// 				uni.$u.toast('获取任务失败！')
			// 			}
			// 		} else {
			// 			uni.$u.toast(UploadPdfReq.msg)
			// 		}
			// 	}
			// } else {
			// 	uni.$u.toast(ReadFileReq.msg)
			// }
		}
	};
	// 	1.0	翻译查询
	const queryOneTranlate = async () => {
		let translateQuery = await $api.post('api/v1/pdf/format_translate_query', { task_id: taskId.value })
		console.log(translateQuery)
		if (translateQuery.code == -1) {
			uni.$u.toast(translateQuery.msg);
			return
		}
		if (translateQuery.code == 2) {
			uni.$u.toast(translateQuery.msg);
			await delay(2000)
			queryOneTranlate()
			return
		}
		if (translateQuery.code == 0) {
			uni.$u.toast('翻译' + translateQuery.msg + '！');
			isTransLateLoading.value = false
			getFile(translateQuery.result)
		}

	}

	const getFile = (url : string) => {
		uni.showLoading({
			title: '正在获取预览文件，请稍等....'
		})
		uni.downloadFile({
			url: url,
			success: function (downloadFileRes) {
				console.log('downloadFileRes', downloadFileRes)
				uni.openDocument({
					showMenu: true,
					filePath: downloadFileRes.tempFilePath,
					success: function (openDocumentRes) {
						console.log('openDocumentRes', openDocumentRes)
						uni.hideLoading()
					},
					fail: function (openDocumentErr) {
						console.log('openDocumentErr', openDocumentErr)
						uni.hideLoading()
					}
				})
			}
		})

	}

	const fileList1 = ref([]);

	const openImages = (e) => {
		uni.previewImage({
			urls: ['http://file.1foo.com/2024/10/29/04f9f08bf750fa9d4eefdebff381e8e7.png']
		})
	}
	const previewImages = (url : string) => {
		uni.previewImage({
			urls: [url]
		})
	}
</script>

<style lang="scss">
	.TranslatePages {
		padding: 30rpx 0;
		display: flex;
		flex-direction: column;

		&_rightBox {
			flex: 1;
		}
	}

	.uploadFileTranslate {
		padding: 0 30rpx;
		display: flex;
		width: 100%;
		flex-direction: column;

		&_previewimage {
			width: 100%;
			height: 500rpx;
		}

		&_preview {
			box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
			margin: 20rpx 20rpx;
			padding: 20rpx;
			border-radius: 20rpx;


			&_title {
				font-size: 27rpx;
				font-weight: 800;
			}

			&_desc {
				font-size: 24rpx;
				color: #888;
			}
		}

		&_top {
			display: flex;
			text-align: center;
		}

		&_middle {
			padding: 0 10rpx;
		}

		&_right {
			display: flex;
			align-items: center;
		}

		&_content {
			padding: 30rpx;
			margin: 30rpx 0;
			border-radius: 15rpx;
			border: 1rpx dashed #888;
		}
	}

	.upPopupLayout {
		padding: 30rpx;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	.upPopup {
		display: flex;
		justify-content: center;
		padding: 20rpx;
	}

	.translateContent {
		width: 100%;
		padding: 20rpx;
		flex-direction: column;
		align-items: center;
		display: flex;

		&_top {
			padding: 20rpx 0;
			text-align: center;
		}

		&_middle {
			display: flex;
			justify-content: space-between;
			width: max-content;

			&_button {
				margin: 20rpx;

			}

			&_button2 {
				width: 50%;
				background-color: $aichat-border-color;
				margin: 20rpx;
				display: flex;
				align-items: center;
				color: white;
				border-radius: 10rpx;
				font-size: 27rpx;
			}
		}

		&_buttom {
			padding: 20rpx 0;
			font-size: 27rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			&_items {
				padding: 10rpx 0;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.overlayBox {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.noData {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 500rpx;

		&_image {
			width: 100%;
			height: 400rpx;
		}

	}
</style>