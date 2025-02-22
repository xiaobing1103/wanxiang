<template>
	<z-paging :show-scrollbar="false" ref="srollRef"
		:pagingStyle="{ background: 'rgb(246, 247, 249)', padding: '0 30rpx' }">
		<template #top>
			<CommonHeader defindTitle="AI音频模型" />
		</template>
		<template v-if="!showChatBox">
			<view class="voiceModel">
				<view class="voiceModel_header">
					<up-tabs :list="changeTabsLists" :current="currentProject" @change="changeTabs"></up-tabs>
				</view>
				<template v-if="!currentProject">
					<view class="voiceLink">
						<view class="voiceLink_inputBox">
							<up-input placeholder="请粘贴要分析理解的链接" border="surround" v-model="linkVal" maxlength="20000">
								<template #prefix>
									<up-icon name="kefu-ermai" size="25"></up-icon>
								</template>
							</up-input>
						</view>
						<view class="voiceLink_desc">
							<text class="voiceLink_desc_text">部分网站会隐藏网站内容，结果可能不符合预期，请知悉</text>
						</view>
						<view class="voiceLink_buttonBox">
							<view class="voiceLink_buttonBox_button" @click="startFast">
								立即理解
							</view>
						</view>
					</view>
				</template>
				<template v-if="currentProject">
					<view class="voiceLink">
						<view class="voiceLink_uploadFile">
							<!-- #ifdef APP -->
							<upload-demo :count="1" @UploadCallback="UploadCallback" type="file">
								<template #defaultTemplate>
									<view class="voiceLink_uploadFile_box">
										<image class="voiceLink_uploadFile_imageIcon" :src="$assets.voiceModelIcon"
											mode="">
										</image>
										<text class="voiceLink_uploadFile_topText">点击此区域进行文件上传</text>
										<text
											class="voiceLink_uploadFile_bottomText">您可以上传.Acc、.Mp3、.Opus或.Wav格式的文件</text>
									</view>
								</template>
							</upload-demo>
							<!-- #endif -->
							<!-- #ifndef APP -->
							<up-upload :customStyle="{ width: '100%',display:'flex',alignItems:'center' }"
								:accept='accept' :previewImage="false" @afterRead="afterRead" @delete="deletePic"
								:fileList="fileList1" :maxCount="1" name="1" multiple>
								<view class="voiceLink_uploadFile_box">
									<image class="voiceLink_uploadFile_imageIcon" :src="$assets.voiceModelIcon" mode="">
									</image>
									<text class="voiceLink_uploadFile_topText">点击此区域进行文件上传</text>
									<text class="voiceLink_uploadFile_bottomText">您可以上传.Acc、.Mp3、.Opus或.Wav格式的文件</text>
								</view>
							</up-upload>
							<!-- #endif -->
						</view>
					</view>
				</template>
			</view>
		</template>
		<template v-else>
			<view class="DocChat_main">
				<ChatBox ref="ChatBoxRef" @passToGrandparent="handleValue" />
			</view>
		</template>
		<template #bottom>
			<imageModelChat @onCancel="onCancel" v-model:chatValue="chatValue" @onSend="onSend" />
		</template>
	</z-paging>
	<!-- #ifdef APP -->
	<ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore"
		@onFinish="finishCore" />
	<!-- #endif -->
</template>

<script setup lang="ts">
	// #ifdef APP 
	import ChatSSEClient from "@/components/gao-ChatSSEClient/gao-ChatSSEClient.vue";
	import UploadDemo from '../components/UploadDemo.vue'
	// #endif

	import { computed, nextTick, onMounted, ref } from 'vue';

	import imageModelChat from '../CommonChat/imageModelChat.vue';
	import CommonHeader from '@/components/CommonHeader.vue'
	import ChatBox from '../CommonChat/ChatBox.vue';
	import { useChatStore } from '@/store';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { generateUUID } from '@/tools/uuid';
	import { ItemMessage } from '@/type/chatData';
	import { storeToRefs } from 'pinia';
	import { limitFileSize } from '@/utils'
	import { currentModelReversParmas, exParmas, modelTypes } from '../../../chat/chatConfig';
	import { commonModel } from '@/config/modelConfig';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { isPureLink } from '@/utils';
	const chatValue = ref('');
	const uploadOptions = ref({
	})
	const XeUpload = ref(null)

	const UploadCallback = (e) => {
		console.log(e)
		afterRead(e)
	}
	const accept = computed(() => {
		// #ifdef MP-WEIXIN
		return 'all'
		// #endif
		// #ifdef APP
		return 'image'
		// #endif
		return 'file'
	})
	const changeTabsLists = ref([
		{ name: '音频链接理解' },
		{ name: '音频文件导入' },
	])
	const linkVal = ref('')
	const description = ref('')
	const currentProject = ref(0)
	const fileList1 = ref([])
	const showChatBox = ref(false)
	const ChatBoxRef = ref<InstanceType<typeof ChatBox>>(null);
	const ChatStore = useChatStore();
	const { model, selectChatId } = storeToRefs(ChatStore);
	const { $api, $assets } = useGlobalProperties()
	const { setChatInfo } = ChatStore;
	const { streamRequest, isRecive, onCancelRequest, streamSpark,
		// #ifdef APP
		openCore, errorCore, messageCore, finishCore, chatSSEClientRef
		// #endif
	} = useStreamHooks();
	const onCancel = () => {
		onCancelRequest()
		ChatStore.setLoadingMessage(false)
	}
	const readFile = (res) => {
		console.log('文件内容', res)
	}
	const startFast = async () => {
		let resvideo : any
		showChatBox.value = true
		if (isPureLink(linkVal.value)) {
			resvideo = await $api.post('api/v1/media/mediaLink2txt', { file_url: linkVal.value })
			if (resvideo.code == "0") {
				onSend(resvideo.text, null, [{ role: 'user', content: '我的内容是：' + resvideo.text }])
			} else {
				uni.$u.toast(resvideo.msg);
				showChatBox.value = false
			}
		} else {
			resvideo = await $api.post('api/v1/media/getShortViedo', { url: linkVal.value })
			if (resvideo.code == 200) {
				const res = await $api.post('api/v1/media/mediaLink2txt', { file_url: resvideo.data.medias[0].resource_url })
				if (res.code == "0") {
					onSend('请理解我发送的音频链接', null, [{ role: 'user', content: '我的内容是：' + res.text }])
				} else {
					uni.$u.toast(res.msg);
					showChatBox.value = false
				}
			} else {
				uni.$u.toast(resvideo.msg);
				showChatBox.value = false
			}
		}
	}
	const srollRef = ref(null);
	const handleValue = (value : any) => {
		const messages = ChatBoxRef.value.getPrevSingelMessage(value.msgId);
		onSend(messages.message, value);
	};

	const changeTabs = ({ index }) => {
		currentProject.value = index
	}
	const scrollToBottom = () => {
		nextTick(() => {
			if (srollRef.value) {
				srollRef.value.scrollToBottom();
			}
		});
	};

	function checkFileType(fileName : string) {
		// 定义允许上传的文件扩展名
		const allowedExtensions = ['acc', 'mp3', 'opus', 'wav'];
		// 获取文件的扩展名	
		const fileExtension = fileName.split('.').pop().toLowerCase();
		// 检查文件扩展名是否在允许的列表中
		if (allowedExtensions.includes(fileExtension)) {
			return true; // 文件类型允许
		} else {
			return false; // 文件类型不允许
		}
	}
	// 删除图片
	const deletePic = (event : { index : number; }) => {
		fileList1.value.splice(event.index, 1);
	};
	// 新增图片
	const afterRead = async (event : { file : any; }) => {
		console.log(event)
		if (!limitFileSize(event, '音频')) return
		// const isMap = Object.prototype.toString.call(event) === '[object Map]';
		// if (isMap) {
		// 	for (const [key, value] of event.entries()) {
		// 		console.log(key, value);
		// 	}
		// }
		let fileName = ''
		let formdata : any = null
		// #ifdef H5
		fileName = event.file[0].name
		// #endif
		// #ifdef MP-WEIXIN
		fileName = event.file[0].name
		// #endif
		// #ifdef APP
		fileName = event[0].name
		// #endif
		if (!checkFileType(fileName)) {
			uni.$u.toast('只支持上传音频格式acc, mp3, opus, wav！');
			return
		}
		showChatBox.value = true
		// #ifdef MP-WEIXIN
		formdata = { file: event.file[0].url }
		// #endif
		// #ifdef APP
		formdata = { file: event[0].url }
		// #endif
		// #ifdef H5
		formdata = new FormData()
		formdata.append('file', event.file[0].file)
		// #endif
		const descriptionReq = await descriptionImage(formdata)
		console.log(descriptionReq)
		if (descriptionReq) {
			description.value = descriptionReq
			onSend(fileName, null, [{ role: 'user', content: '我的内容是：' + descriptionReq }])
		} else {
			uni.$u.toast(descriptionReq.msg);
		}
	};

	const descriptionImage = async (formData : string) => {
		let res : any
		// #ifdef H5
		res = await $api.post('api/v1/media/audioFile2txt', formData)
		// #endif
		// #ifdef MP-WEIXIN || APP
		res = await $api.post('api/v1/media/audioFile2txt', formData, true, {}, null, true)
		// #endif
		if (typeof res == 'string') {
			res = JSON.parse(res)
		}
		return new Promise((resolve, reject) => {
			if (res.code == "0") {
				resolve(res.text || '音频没有任何内容')
			} else {
				uni.$u.toast('音频理解失败，请重新生成！');
				currentProject.value = 0
				reject(null)
			}
		})
	}

	const saveHistory = (id : string, currentMessage : ItemMessage) => {
		setChatInfo(id, currentMessage);
	};

	const onSend = async (
		val,
		config : { currentAsk : string; msgId : string } = {
			currentAsk: '默认',
			msgId: ''
		},
		extraMessage ?: any
	) => {
		if (!val) {
			uni.$u.toast('请先输入内容！');
			return;
		}
		if (!description.value) {
			uni.$u.toast('请先上传音频或音频网址内容！');
			return;
		}
		const msgId = generateUUID();
		const msgObj : ItemMessage = { id: msgId, state: 'ok', target: 'user', message: val, messageType: 'text' };
		ChatBoxRef.value.addMessage(msgId, msgObj);

		saveHistory(selectChatId.value, msgObj);
		const requestData = [
			...(Array.isArray(extraMessage) && extraMessage.length ? extraMessage : []),
		];
		const historyMessages = ChatBoxRef.value.getAllHistoryMessage(requestData, msgId)
		const reqData = {
			// prompt: `请以中文回复我 官方设置的${config.currentAsk}角度，适用于日常生活工作的询问与回答，权重均衡`,
			prompt: `我希望你根据我提供的音频内容进行总结，并以此音频内容来回答问题}`,
			type: modelTypes[model.value],
			...exParmas[model.value],
			[currentModelReversParmas[model.value] || 'params']: historyMessages,
		};
		const options = {
			url: commonModel[model.value].ModelApi,
			method: 'POST',
			data: reqData
		};
		scrollToBottom();
		chatValue.value = '';
		handleStream(options);
	}
	onMounted(() => {
		ChatStore.setModel('voice')
	})
	async function handleStream(options) {
		let result = '';
		let newStr = '';
		const id = generateUUID();
		ChatBoxRef.value.addMessage(id, { id: id, state: 'waite', target: 'assistant', message: result, messageType: 'text' });
		ChatStore.setLoadingMessage(true);
		const LoadingConfig = {
			showLoading: false,
			title: '加载中...'
		};
		const requestOptions = {
			url: options.url,
			data: options.data,
			onmessage: async (text : UniApp.RequestSuccessCallbackResult) => {
				newStr += text;
				result = await streamSpark(newStr)
				ChatBoxRef.value.setMessage(id, { id: id, state: 'ok', target: 'assistant', message: result, messageType: 'text' });
				scrollToBottom();
			},
			onerror: (err) => {
				console.log(err);
				const currentMessage = ChatBoxRef.value.getSingelMessage(id);
				if (currentMessage.state == 'waite') {
					ChatBoxRef.value.deleteMessage(id)
				}
				if (err.includes('请升级会员')) {
					ChatStore.setShowLevelUpVipContent(err)
					ChatStore.setShowlevelUpVip(true)
				}
			},
			onfinish: (response) => {
				const currentMessage = ChatBoxRef.value.getSingelMessage(id);
				// 存历史记录
				saveHistory(selectChatId.value, currentMessage);
				ChatStore.setLoadingMessage(false);
			},
			LoadingConfig
		};
		streamRequest(requestOptions);
	}
</script>

<style lang="scss" scoped>
	.voiceModel {
		padding: 25rpx;

		&_header {
			display: flex;
			justify-content: center;

		}
	}

	.voiceLink {
		width: 100%;
		background-color: $uni-bg-color;
		padding: 30rpx;
		border-radius: 20rpx;
		margin: 70rpx 0;

		&_uploadFile {
			width: 100%;

			&_box {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				flex-direction: column;
			}

			&_imageIcon {
				width: 150rpx;
				height: 150rpx;

			}

			&_topText {
				padding: 10rpx 0;
				font-size: 27rpx;
			}

			&_bottomText {
				padding: 25rpx 0;
				font-size: 25rpx;
				color: $aichat-text-color;
			}
		}

		&_inputBox {
			border: 1rpx solid $uni-border-color;
			background-color: $u-primary-light;
			border-radius: 15rpx;
			margin: 30rpx 0;
		}

		&_desc {

			font-size: 27rpx;

			color: $aichat-text-color;
			margin: 50rpx 0;

			&_text {
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
			}
		}

		&_buttonBox {
			padding: 40rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			&_button {
				width: 80%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 30rpx;
				padding: 10rpx 20rpx;
				border-radius: 1.09375rem !important;
				height: 60rpx !important;
				color: #ffffff !important;
				background: linear-gradient(to right, #1cd8ba, #06c0f9);
				cursor: pointer;
			}
		}
	}
</style>