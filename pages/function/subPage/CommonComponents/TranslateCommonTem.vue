<template>
	<z-paging :scroll-with-animation="true" :show-scrollbar="false" ref="pagingRef" :pagingStyle="{padding:'24rpx'}">
		<template #top>
			<CommonHeader :defindTitle="publicMethods.title" />
		</template>
		<view class="TranslateCommonTem">
			<ChangeLangs v-model:currentLang="currentLang" />
			<view class="uploadBox">
				<up-upload :customStyle="{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}"
					:fileList="fileList1" @afterRead="afterRead" name="4" multiple accept="all" :maxCount="1">
					<view class="uploadBoxmain">
						<view class="uploadBoxmain_title">
							<view class="uploadBoxmain_title_image"
								v-for="(items,index)  in publicMethods.uploadImageSrc" :key="index">
								<image class="uploadBoxmain_title_image_items" :src="items" mode=""></image>
							</view>
						</view>
						<view class="uploadBoxmain_desc">
							支持pdf, txt, docx, pptx, excel 等格式编码的文件
						</view>
						<view class="uploadBoxmain_elseDesc">
							(部分音频内容比较多,可能Ai无法理解)
						</view>
						<view class="uploadBoxmain_button">
							<up-button size="mini" :customStyle="{width:'50%',borderRadius:'15rpx',height:'50rpx'}"
								type="primary">点击上传文档</up-button>
						</view>

					</view>
				</up-upload>
			</view>
			<view class="Zero_title">
				<text>翻译结果</text>
				<view class="Zero_title_copy">
					<up-button @click="toCopy" :customStyle="{height:'60rpx'}" type="primary">复制结果</up-button>
				</view>

			</view>
			<view class="Zero">
				<zero-markdown-view :markdown="msgContent" />

			</view>
			<CommonViewer />
		</view>
	</z-paging>
</template>

<script setup lang="ts">
	import { publicMethodsType } from './types';
	import CommonHeader from '@/components/CommonHeader.vue'
	import CommonViewer from './CommonViewer'
	import ChangeLangs from './ChangeLangs'
	import { toCopyText, uploadFileBefore } from '@/utils';
	import { nextTick, reactive, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { useChatStore } from '@/store';
	const ChatStore = useChatStore()
	const fileList1 = ref([]);
	const currentLang = ref('英文')
	const msgContent = ref(`👉此处为翻译结果显示区域`)
	const { streamRequest, isRecive, verifyTranslateTextLimit } = useStreamHooks()
	const pagingRef = ref(null)
	const isTransLateLoading = ref(false)
	const { $api } = useGlobalProperties()
	const props = defineProps<{ publicMethods : publicMethodsType }>()
	const afterRead = async (event : { file : any; }) => {
		if (isTransLateLoading.value) {
			uni.$u.toast('翻译执行中，请等待...')
			return
		}
		const exampleFiles = reactive(['pdf', 'txt', 'docx', 'pptx', 'excel'])
		const returnDatas = await uploadFileBefore(event, exampleFiles)
		if (returnDatas) {

			let ReadFileReq = await $api.post('api/v1/files/file2text', returnDatas.formdata, returnDatas.isJson, undefined, null, returnDatas.isWechatSendImages)
			if (typeof ReadFileReq == 'string') {
				ReadFileReq = JSON.parse(ReadFileReq)
			}

			if (ReadFileReq.code == 200) {
				if (!verifyTranslateTextLimit(ReadFileReq.data)) {
					uni.$u.toast('字数超出限制！')
					return
				}
				uni.$u.toast('翻译成功,请查看翻译结果！')
				onFetchChat(ReadFileReq.data)
			} else {
				uni.$u.toast(ReadFileReq.msg)
			}
		}
		// }
	};
	const toCopy = () => {
		toCopyText(msgContent.value)
	}

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
</script>

<style scoped lang="scss">
	.TranslateCommonTem {}

	.uploadBox {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 30rpx 0;
	}

	.uploadBoxmain {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		border: 1rpx dashed #ccc;
		border-radius: 15rpx;
		padding: 20rpx;
		font-size: 27rpx;

		&_title {
			display: flex;


			&_image {
				padding: 20rpx;

				&_items {
					width: 80rpx;
					height: 80rpx;
				}
			}
		}

		&_desc {
			text-align: center;
		}

		&_elseDesc {
			font-size: 24rpx;
			color: #ccc;
		}

		&_button {
			width: 100%;
			padding-top: 40rpx;
		}
	}

	.Zero {
		min-height: 200rpx;
		border-radius: 15rpx;
		border: 1rpx solid #ccc;
		margin: 40rpx 0;
		padding: 15rpx;

		&_title {
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: space-between;

			&_copy {
				width: 20%;
			}
		}
	}
</style>