<template>
	<z-paging :pagingStyle="{ background: 'rgb(246, 247, 249)'}" :show-scrollbar=" false">
		<template #top>
			<CommonHeader defindTitle="AI文档翻译" />
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
							<up-button :customStyle="{margin:'20rpx',width:'50%'}"
								class="translateContent_middle_button" type="primary"
								@click="openImages">体验示例文档</up-button>
							<view :style="{margin:'20rpx',width:'50%',background: isTransLateLoading ? '#c8c9cc': ''}"
								type="primary" class="translateContent_middle_button2">
								<up-upload :customStyle="{width:'100%',display:'flex',alignItems:'center'}"
									:fileList="fileList1" @afterRead="afterRead" name="4" multiple accept="all"
									:maxCount="1">上传文档
								</up-upload>
							</view>
						</view>
						<view class="translateContent_buttom">
							<view class="translateContent_buttom_items">
								<text>支持格式：</text>
								<image :style="{width:'25rpx',height:'30rpx',padding:'0 5rpx '}"
									src="//file.1foo.com/2024/10/19/fcdf9e3eb07feae1362125abf6dc6f5e.svg" mode="">
								</image>
								<text> pdf(只支持扫描文件)</text>
								<image :style="{width:'25rpx',height:'30rpx',padding:'0 5rpx'}"
									src="//file.1foo.com/2024/10/19/b9d1db39b6e9d44dbfdda223ba59e258.svg" mode="">
								</image>word
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
				<text>{{items}}</text>
			</view>
		</view>
	</up-popup>


</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { languages } from './type'
	import { reactive, ref } from 'vue';
	import { uploadFileBefore } from '@/utils';
	import { useUserStore } from '@/store';
	import { saveFile } from './downLoadLocal';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	const currentLang = ref('英文')
	const openPopup = ref(false)
	const isTransLateLoading = ref(false)
	const { userInfo } = useUserStore()
	const { $api } = useGlobalProperties()
	const { checkNumFun, checkSubmit, verifyTranslateTextLimit } = useStreamHooks()
	const changeLang = () => {
		openPopup.value = !openPopup.value
	}
	const seletedNum = ref(0)
	const images = ['//file.1foo.com/2024/10/19/e959ca7fe809f2afd37ef9786b9e320f.png', '//file.1foo.com/2024/10/19/93d5c5cd054849feda312db69936ba7f.png', '//file.1foo.com/2024/10/19/71840afbe53c43a75b9facc57d21fe9e.png', '//file.1foo.com/2024/10/19/c77ea7ec2a77c890ae45daf958176c1b.png']
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
	const TaskLoop = async (task) => {
		return new Promise(async (resolve, reject) => {
			try {
				persent += 2
				if (persent == 100) {
					persent = 100
				}
				const progressReq = await $api.post('api/v1/pdf/progress', { task: task }, false, {}, { title: `正在翻译中, 进度${persent}% 请稍等...`, showLoading: true });
				if (progressReq.code === 200) {
					if (progressReq.msg === '翻译中') {
						await delay(2000);
						TaskLoop(task).then(resolve).catch(reject);
					} else if (progressReq.msg === '翻译成功') {
						uni.$u.toast(progressReq.msg);
						resolve(progressReq);
					} else {
						reject(new Error(`Unexpected message: ${progressReq.msg}`));
					}
				} else {
					reject(new Error(`API error: ${progressReq.code}`));
				}
			} catch (error) {
				reject(error);
			}
		});
	}

	const afterRead = async (event : { file : any; }) => {
		if (!await checkNumFun('fun_doc_translate')) {
			return
		}
		await checkSubmit('fun_doc_translate')
		if (isTransLateLoading.value) {
			uni.$u.toast('翻译执行中，请等待...')
			return
		}
		const returnDatas = await uploadFileBefore(event)
		if (returnDatas) {
			let ReadFileReq = await $api.post('api/v1/files/file2text', returnDatas.formdata, returnDatas.isJosn, {}, null, returnDatas.isWechatSendImages)
			if (typeof ReadFileReq == 'string') {
				ReadFileReq = JSON.parse(ReadFileReq)
			}

			if (ReadFileReq.code == 200) {
				if (!verifyTranslateTextLimit(ReadFileReq.data)) {
					uni.$u.toast('字数超出限制！')
					return
				}
				let UploadPdfReq = await $api.post('api/v1/pdf/uploadPdf', returnDatas.formdata, returnDatas.isJosn, {}, null, returnDatas.isWechatSendImages)
				if (typeof UploadPdfReq == 'string') {
					UploadPdfReq = JSON.parse(UploadPdfReq)
				}
				if (UploadPdfReq.code == 200) {
					const TranslateReq = await $api.post('api/v1/pdf/translate', {
						dstLang: currentLang.value,
						fileUrl: 'upload/' + UploadPdfReq.data.url,
						format: returnDatas.fileType,
						uid: userInfo.id + '',
					})

					if (TranslateReq.code == 200) {
						isTransLateLoading.value = true
						TaskLoop(TranslateReq.data).then((res) => {
							isTransLateLoading.value = false
							saveFile(res.data.url, returnDatas.fileType)
						}).catch((err) => {
							isTransLateLoading.value = false
						})
					} else {
						uni.$u.toast('获取任务失败！')
					}
				} else {
					uni.$u.toast(UploadPdfReq.msg)
				}

			} else {
				uni.$u.toast(ReadFileReq.msg)
			}
		}




	};

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

		&_top {
			padding: 20rpx 0;
			text-align: center;
		}

		&_middle {
			display: flex;

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

			&_items {
				padding: 10rpx 0;
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