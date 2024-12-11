<template>
	<z-paging ref="pagingRef" :pagingStyle="{ background: 'rgb(246, 247, 249)'}" :show-scrollbar=" false">
		<template #top>
			<CommonHeader defindTitle="AI文言文翻译" />
		</template>
		<view class="TranslatePages">
			<view class="uploadFileTranslate">
				<view class="uploadFileTranslate_top">
					<view class="uploadFileTranslate_left">
						<text>{{currentLangFirst}}</text>

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
						<view class="translateContent_middle">
							<view class="translateContent_middle_top">
								<image class="translateContent_middle_top_image" v-for="(items,index) in docList"
									:src="items.icon" mode=""></image>
							</view>
							<view class="translateContent_middle_desc">
								支持PDF、Word、(.docx)、Excel或PowerPoint（.pptx）、txt 等格式文件
							</view>
							<up-upload
								:customStyle="{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}"
								:fileList="fileList1" @afterRead="afterRead" name="4" multiple accept="all"
								:maxCount="1">
								<view :style="{background: isTransLateLoading ? '#c8c9cc': ''}" type="primary"
									class="translateContent_middle_button2">
									上传文档
								</view>
							</up-upload>
						</view>
					</view>
				</view>
			</view>
			<view class=" bottomView">
				<view class="translateContent">
					<up-textarea height="200" v-model="textValue" placeholder="请输入或上传解析内容后翻译" count
						maxlength="2000"></up-textarea>
				</view>
			</view>
			<view class="bottomView">
				<view class="bottomView_title">
					<text class="bottomView_title_text">翻译结果</text>
				</view>
			</view>

			<view class="Zero">
				<zero-markdown-view :markdown="msgContent" />
			</view>
		</view>
		<template #bottom>
			<view class="bottom">
				<up-button @click="onFetchChat" size="mini" shape="circle" :hairline="false" type="primary"
					:customStyle="{padding:'30rpx',fontSize:'27rpx',margin:'10rpx'}"
					class="bottom_button">立即翻译</up-button>
				<up-button @click="copy" size="mini" shape="circle" :hairline="false" type="primary"
					:customStyle="{padding:'30rpx',fontSize:'27rpx',margin:'10rpx'}"
					class="bottom_button">复制结果</up-button>
			</view>
		</template>
	</z-paging>
	<up-picker @cancel="openPopup= false" :show="openPopup" :columns="[languages]" @confirm="confirmPicker" />
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { nextTick, reactive, ref } from 'vue';
	import { toCopyText, uploadFileBefore } from '@/utils';
	import { useUserStore, useChatStore } from '@/store';
	import { saveFile } from '../TranslatePages/downLoadLocal';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	const languages = ['文言文', '白话文']
	const currentLangFirst = ref('白话文')
	const currentLang = ref('文言文')
	const { streamRequest, isRecive } = useStreamHooks()
	const showpicker = ref(false)
	const textValue = ref('')
	const currentType = ref('')
	const msgContent = ref(`👆请在上面输入要翻译的内容`)
	const openPopup = ref(false)
	const isTransLateLoading = ref(false)
	const fileList1 = ref([]);
	const ChatStore = useChatStore()
	const pagingRef = ref(null)
	const { userInfo } = useUserStore()
	const { $api } = useGlobalProperties()
	// const { checkNumFun, checkSubmit } = useStreamHooks('fun_doc_translate')
	const changeLang = () => {
		openPopup.value = !openPopup.value
	}
	const changeTypeList = ref([])
	const onScroolToBottom = () => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
		})
	}
	const changeShowPicker = (items : Array<string>, index : string) => {
		currentType.value = index
		changePromise(items).then((res) => {
			showpicker.value = true
		})
	}

	const confirmPicker = ({ value }) => {
		currentLang.value = value[0]
		const nol = languages.find((items) => {
			return items !== value[0]
		})
		currentLangFirst.value = nol
		openPopup.value = false
	}

	const afterRead = async (event : { file : any; }) => {
		// if (await checkNumFun()) {
		if (isTransLateLoading.value) {
			uni.$u.toast('翻译执行中，请等待...')
			return
		}
		const returnDatas = await uploadFileBefore(event, ['pdf', 'txt', 'docx', 'pptx', 'excel'])
		if (returnDatas) {
			let ReadFileReq = await $api.post('api/v1/files/file2text', returnDatas.formdata, returnDatas.isJson, undefined, null, returnDatas.isWechatSendImages)
			if (typeof ReadFileReq == 'string') {
				ReadFileReq = JSON.parse(ReadFileReq)
			}
			if (ReadFileReq.code == 200) {
				uni.$u.toast('翻译成功,请查看翻译结果！')
				textValue.value = ReadFileReq.data
			} else {
				uni.$u.toast(ReadFileReq.msg)
			}


		}
		// }
	};

	const currentTypeList = ref([])
	const changePromise = (items) => {
		return new Promise((resolve, reject) => {
			changeTypeList.value = [items]
			resolve()
		})
	}

	const copy = () => {
		toCopyText(msgContent.value, '复制翻译结果成功！')
	}
	const docList = reactive(
		[
			{
				title: 'PDF文档',
				icon: '//file.1foo.com/2024/10/19/fcdf9e3eb07feae1362125abf6dc6f5e.svg'
			},
			{
				title: 'PDF文档',
				icon: '//file.1foo.com/2024/10/23/2dcd04b6dab91a55fb8c00102bcd1cf0.svg'
			},
			{
				title: 'DOC文档',
				icon: '//file.1foo.com/2024/10/19/b9d1db39b6e9d44dbfdda223ba59e258.svg'
			},
		]
	)
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

	const onFetchChat = async (content ?: string) => {
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		const prompt = `我想使用一个能够将 ${currentLangFirst.value} 翻译为现代语言（${currentLang.value}）的工具，注释说明：在翻译过程中，遇到一些特殊的词汇、成语或者历史背景，可以在译文中添加注释，帮助读者理解。
" +
"1.  词汇选择：要求机器在翻译过程中使用更为文雅、古朴的词汇，以体现文言文的特色。例如，将现代汉语中的“手机”翻译为“机”，将“电视”翻译为“映像”。
" +
"
" +
"2.  句式调整：要求机器在翻译过程中，根据文言文的语法结构和表达习惯对句子进行调整。例如，将现代汉语中的“我爱你”翻译为“吾爱你”，将“他去了北京”翻译为“彼往京师”。
" +
"
" +
"3.  语言风格：要求机器在翻译过程中，模仿文言文的典雅、简约、含蓄等风格。例如，将现代汉语中的“我很开心”翻译为“予怀欣欣”。
" +
"
" +
"4.  文化内涵：在翻译过程中，要求机器充分考虑文言文中的文化内涵，尽量使之符合历史背景和语境。例如，将现代汉语中的“国庆节”翻译为“庆典”，并将相关描述调整为符合文言文表达的方式。
" +
"
" +
"5.  修辞手法：要求机器在翻译过程中运用一些文言文的修辞手法，如对仗、排比、借代等，以增加文言文的韵味。例如，将现代汉语中的“大海”翻译为“沧海”，以借用“沧海一粟”的成语形象表达大海的辽阔。
" +
"
" +
"6.  韵律调整：要求机器在翻译过程中，根据文言文的韵律规律对句子进行调整，使其更具韵律感。例如，将现代汉语中的“明天见”翻译为“明日相逢”。
" +
"
" +
"总之，在将白话文翻译为文言文时，可以通过以上形式和描述要求机器按照文言文的表达习惯和风格进行翻译，使译文更加贴近文言文的特点。当然，目前机器翻译的智能化水平仍有待提高，无法完全达到人工翻译的效果。但在不断优化算法和技术进步的过程中，机器翻译的效果会逐步提升。
`
		const questions = [
			{
				role: 'user',
				content: textValue.value

			}
		]

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
		font-size: 27rpx;
		flex-direction: column;



		&_top {
			display: flex;
			text-align: center;
			justify-content: space-between;
			align-items: center;
		}

		&_left {
			padding: 10rpx 40rpx;
			border-radius: 10rpx;
			border: 1rpx solid #ccc;
			display: flex;
		}

		&_right {
			padding: 10rpx 40rpx;
			border-radius: 10rpx;
			border: 1rpx solid #ccc;
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

		&_top {
			padding: 20rpx 0;
			text-align: center;
		}

		&_middle {
			display: flex;
			flex-direction: column;

			padding: 30rpx;

			&_top {
				display: flex;
				justify-content: center;

				&_image {
					margin: 0 20rpx;
					width: 80rpx;
					height: 100rpx;
				}
			}

			&_desc {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 20rpx;
				text-align: center;
			}

			&_content {}

			&_button {}

			&_button2 {
				background-color: $aichat-border-color;
				margin: 30rpx;
				padding: 20rpx 100rpx;
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


	.seletedTypeBox {
		display: flex;

		width: max-content;

	}

	.Zero {
		background-color: #fff;
		min-height: 400rpx;
		margin: 30rpx;
		padding: 15rpx;
		border-radius: 15rpx;
		border: 1rpx solid #ccc;
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
	}
</style>