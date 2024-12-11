<template>
	<z-paging ref="pagingRef" :pagingStyle="{ background: 'rgb(246, 247, 249)'}" :show-scrollbar=" false">
		<template #top>
			<CommonHeader defindTitle="AI录音翻译" />
		</template>
		<view class="TranslatePages">
			<view class="uploadFileTranslate">
				<view class="uploadFileTranslate_top">
					<view class="uploadFileTranslate_left">
						自动检测源语言
					</view>
					<view class="uploadFileTranslate_middle">
						→
					</view>
					<view class="uploadFileTranslate_right" @click="changeLang">
						{{currentLang}} <up-icon :style="{margin:'0 10rpx'}" name="arrow-down" size="15"></up-icon>
					</view>
				</view>
				<view class="uploadFileTranslate_content">
					<view class="translateContent">
						<up-upload :customStyle="{width:'100%',display:'flex',alignItems:'center'}"
							:fileList="fileList1" @afterRead="afterRead" name="4" multiple accept="all" :maxCount="1">
							<view class="translateContent_middle">
								<image class="translateContent_middle_image"
									src="http://file.1foo.com/2024/11/02/e367cd9a2a7d50de530301e90babbc3c.png">
								</image>
								<text
									class="translateContent_middle_text1">支持MP3,AAC,OPUS,WAV等格式编码的音频,支持20mb以内且时长不超过1小时的音频文件</text>
								<text class="translateContent_middle_text2">(部分音频内容比较多,可能Ai无法理解)</text>
								<up-button
									:customStyle="{width:'40%',borderRadius:'15rpx',height:'60rpx',marginBottom:'15rpx'}"
									type="primary">上传文档</up-button>
							</view>
						</up-upload>
					</view>
				</view>

			</view>
			<view class="bottomView">
				<view class="bottomView_title">
					<text class="bottomView_title_text">翻译结果</text>
					<view class="bottomView_title_button">
						<up-button :customStyle="{width:'30%'}" type="primary" size="mini"
							@click="copy">复制结果</up-button>
							
					</view>

				</view>
			</view>

			<view class="Zero">
				<zero-markdown-view :markdown="msgContent" />
			</view>
			<view class="uploadFileTranslate">
				<view class="translateContent">
					<view class="translateContent_overView">
						<view class="translateContent_title">
							来自一些内测用户的评价：
						</view>
						<view class="translateContent_overText" v-for="(items,index) in showViewText" :key="index">
							<text class="translateContent_overText_items">{{items}}</text>
						</view>
					</view>
				</view>
			</view>

		</view>
	</z-paging>

	<up-popup :show="openPopup" round="15" @open="openPopup = true" @close="openPopup = false">
		<view class="upPopupLayout">
			<view class="upPopup" v-for="(items,index) in languages" :key="index"
				@click="currentLang = items; openPopup = false">
				<text>{{items}}</text>
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { languages } from '../TranslatePages/type'
	import { ref, nextTick } from 'vue';
	import { toCopyText, uploadFileBefore } from '@/utils';
	import { useChatStore } from '@/store';
	import { saveFile } from '../TranslatePages/downLoadLocal';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	const currentLang = ref('英文')
	const { streamRequest, isRecive } = useStreamHooks()
	const pagingRef = ref(null)
	const ChatStore = useChatStore()
	const msgContent = ref(`👆请在上面上传要翻译的文档内容`)
	const openPopup = ref(false)
	const isTransLateLoading = ref(false)
	const { $api } = useGlobalProperties()
	// const { checkNumFun, checkSubmit } = useStreamHooks('fun_doc_translate')
	const changeLang = () => {
		openPopup.value = !openPopup.value
	}
	const fileList1 = ref([])

	const onFetchChat = async (content ?: string) => {
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		const prompt = `你现在作为一个翻译师，请帮我将该内容翻译为${currentLang.value}`
		const questions = [
			{
				role: 'user',
				content

			}
		]
		const onScroolToBottom = () => {
			nextTick(() => {
				pagingRef.value.scrollToBottom()
			})
		}
		const data = {
			ask: JSON.stringify(questions),
			prompt,
			type: 'zhipu'
		}
		msgContent.value = ''
		const streamOptions = {
			url: 'api/v1/chat2/zhipu',
			data: data,
			onmessage(text) {
				msgContent.value += text
				onScroolToBottom()
			},
			onfinish() {
				console.log('成功')
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
	const showViewText = [
		'用户评价:我觉得这个AI机器翻译功能在 将白话文翻译为文言文的时候，词汇选择 和句式调整方面表现得相当不错。它能够 有效地使用文言文中的词汇，同时对现代 汉语句子进行调整，使译文更符合文言文 的语法结构和表达习惯',
		'用户评价:这个A机器翻译功能在模仿文 言文的语言风格和文化内涵方面还有一些 不足，译文常常显得有些生硬，缺乏文青 文的典雅和含蓄。希望它能够更注重修辞 手法和韵律调整，使译文更具韵味和文言 文的特色。',
		'用户评价:总体来说，这个AI机器翻译功 能在白话文翻译为文言文的过程中已经取 得了一定进展，但仍然需要进一步的改 进。希望未来能够通过技术的不断升级 使其能够更好地模拟文言文的风格和特 点，以提供更加优质的翻译服务。'
	]


	const copy = () => {
		toCopyText(msgContent.value, '复制翻译结果成功！')
	}


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
		// if (await checkNumFun()) {
		if (isTransLateLoading.value) {
			uni.$u.toast('翻译执行中，请等待...')
			return
		}
		const returnDatas = await uploadFileBefore(event, ['mp3', 'aac', 'opus', 'wav'])
		if (returnDatas) {
			let ReadFileReq = await $api.post('api/v1/media/audioFile2txt', returnDatas.formdata, returnDatas.isJosn, {}, null, returnDatas.isWechatSendImages)
			if (typeof ReadFileReq == 'string') {
				ReadFileReq = JSON.parse(ReadFileReq)
			}
			if (ReadFileReq.code == '0') {
				onFetchChat(ReadFileReq.text)
			} else {
				uni.$u.toast(ReadFileReq.msg)
			}
		}
		// }
	};
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



		&_top {
			font-size: 27rpx;
			display: flex;
			text-align: center;
			justify-content: space-between;
			align-items: center;
		}

		&_left {
			padding: 10rpx;
			border-radius: 10rpx;
			border: 1rpx solid #ccc;
		}

		&_right {
			padding: 10rpx;
			border-radius: 10rpx;
			border: 1rpx solid #ccc;
		}

		&_middle {
			padding: 0 50rpx;

		}

		&_right {
			display: flex;
			align-items: center;
		}

		&_content {
			margin: 30rpx 0;
			border-radius: 15rpx;
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
		border: 1rpx #ccc solid;
		border-radius: 20rpx;
		overflow: hidden;
		background-color: #fff;


		&_overView {
			padding: 20rpx;
		}

		&_title {
			font-size: 27rpx;
			font-weight: 800;
		}

		&_overText {
			padding: 20rpx 0;
			font-size: 27rpx;
		}

		&_top {
			padding: 20rpx 0;
			text-align: center;
		}

		&_middle {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;


			&_image {
				width: 200rpx;
				margin: 30rpx;
				height: 200rpx;
			}

			&_text1 {
				font-size: 25rpx;
				text-align: center;
				padding: 20rpx;
			}

			&_text2 {
				font-size: 24rpx;
				color: #ccc;
				padding: 20rpx;
			}

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


	.seletedType {
		font-size: 27rpx;
		padding: 10rpx;
		border: 1rpx solid #ccc;
		border-radius: 15rpx;
		margin: 0 20rpx;

		&_items {
			display: flex;
			align-items: center;
		}
	}



	.Zero {
		background-color: #fff;
		min-height: 400rpx;
		margin: 30rpx;
		padding: 15rpx;
		border-radius: 15rpx;
		border: 1rpx solid #ccc;
		font-size: 27rpx;
	}

	.bottom {
		margin: 30rpx;
		display: flex;

		&_button {

			// padding: \;
		}
	}

	.bottomView {

		padding: 0 30rpx;
		margin: 20rpx 0;

		&_title {

			display: flex;
			justify-content: space-between;

			&_button {
				display: flex;
				justify-content: flex-end;
			}
		}
	}
</style>