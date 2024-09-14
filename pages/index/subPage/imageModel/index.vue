<template>
	<z-paging :show-scrollbar="false" ref="srollRef"
		:pagingStyle="{ background: 'rgb(246, 247, 249)', padding: '0 30rpx' }">
		<template #top>
			<CommonHeader defindTitle="AI图文模型" />
		</template>
		<template v-if="!showChatBox">
			<view class="imageModel">
				<view class="imageModel_header">
					通用模型（支持识别文字）
				</view>
				<view class="imageModel_viewBox" v-for="(items,index) in imagesList" :key="index">
					<up-upload :previewImage="false" @afterRead="afterRead" @delete="deletePic" :fileList="fileList1"
						:maxCount="1" name="1" multiple>
						<view class="imageModel_view">
							<image class="imageModel_view_image" :src="items.imgSrc" mode=""></image>
							<text class="imageModel_view_text">{{items.title}}</text>
						</view>
					</up-upload>
				</view>
			</view>
			<view class="imageModel">
				<view class="imageModel_header">
					普通模型（不含文字，只做描述）
				</view>

				<up-upload :previewImage="false" @afterRead="afterRead" @delete="deletePic" :fileList="fileList1"
					:maxCount="1" name="1" multiple>
					<view class="imageModel_girdBox">
						<view class="imageModel_viewBox" v-for="(items,index) in simpleModels" :key="index">
							<view class="imageModel_view">
								<image class="imageModel_view_image" :src="items.imgSrc" mode=""></image>
								<text class="imageModel_view_text">{{items.title}}</text>
							</view>
						</view>
					</view>
				</up-upload>

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
</template>

<script setup lang="ts">
	import { nextTick, onMounted, ref } from 'vue';
	import imageModelChat from '@/components/CommonChat/imageModelChat.vue';
	import { simpleModels, imagesList, imageDesception } from './data';
	import CommonHeader from '@/components/CommonHeader.vue'
	import ChatBox from '@/components/CommonChat/ChatBox.vue';
	import { useChatStore } from '../../../../store';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { generateUUID } from '../../../../tools/uuid';
	import { ItemMessage } from '../../../../type/chatData';
	import { storeToRefs } from 'pinia';
	import { currentModelReversParmas, exParmas, modelTypes } from '../../../chat/chatConfig';
	import { commonModel } from '../../../../config/modelConfig';
	import { fileToBase64WithHeader, weChatTempPathToBase64 } from '../../../../utils';
	import { useGlobalProperties } from '../../../../hooks/useGlobalHooks';
	const chatValue = ref('');
	const fileList1 = ref([])
	const showChatBox = ref(false)
	const ChatBoxRef = ref<InstanceType<typeof ChatBox>>(null);
	const ChatStore = useChatStore();
	const { model, selectChatId } = storeToRefs(ChatStore);
	const { $api } = useGlobalProperties()
	const { setChatInfo } = ChatStore;
	const { streamRequest, isRecive, onCancelRequest } = useStreamHooks();
	const onCancel = () => {
		onCancelRequest()
		ChatStore.setLoadingMessage(false)
	}
	const srollRef = ref(null);
	const handleValue = (value : any) => {
		const messages = ChatBoxRef.value.getPrevSingelMessage(value.msgId);
		onSend(messages.message, value);
	};
	const scrollToBottom = () => {
		nextTick(() => {
			if (srollRef.value) {
				srollRef.value.scrollToBottom();
			}
		});
	};
	function checkFileType(fileName : string) {
		// 定义允许上传的文件扩展名
		const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
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
		let fileName = ''
		let base64 : any = null
		// #ifdef H5
		fileName = event.file[0].name
		// #endif
		// #ifdef MP-WEIXIN
		fileName = event.file[0].url
		// #endif
		if (!checkFileType(fileName)) {
			uni.$u.toast('只支持上传图片格式png, jpg, jpeg, gif, webp！');
			return
		}
		const temUrl = event.file[0].url
		showChatBox.value = true
		// #ifdef MP-WEIXIN
		base64 = await weChatTempPathToBase64(temUrl)
		// #endif
		// #ifdef H5
		base64 = await fileToBase64WithHeader(event.file[0].file)
		// #endif
		const description = await descriptionImage(base64)

		if (description) {
			const parmas = [
				{ role: 'system', content: imageDesception },
				{ role: 'user', content: description },
			]
			const msgId = generateUUID();
			const msgObj : ItemMessage = { id: msgId, state: 'ok', target: 'user', message: temUrl, messageType: "image" };
			ChatBoxRef.value.addMessage(msgId, msgObj);
			onSend('请描述这张图片内容', undefined, parmas)
		}
	};

	const descriptionImage = async (base64 : string) => {
		const res = await $api.post('api/v1/ocr/descriptionImage', { image: base64 })
		return new Promise((resolve, reject) => {
			if (res.code == 200) {
				resolve(res.data)
			} else {
				uni.$u.toast('图片理解失败，请重试！');
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
		const msgId = generateUUID();
		const msgObj : ItemMessage = { id: msgId, state: 'ok', target: 'user', message: val, messageType: 'text' };
		ChatBoxRef.value.addMessage(msgId, msgObj);

		saveHistory(selectChatId.value, msgObj);
		const requestData = [
			...(Array.isArray(extraMessage) && extraMessage.length ? extraMessage : []),
			{
				role: 'user',
				content: val
			}
		];
		const historyMessages = ChatBoxRef.value.getAllHistoryMessage(requestData, msgId)
		const reqData = {
			// prompt: `请以中文回复我 官方设置的${config.currentAsk}角度，适用于日常生活工作的询问与回答，权重均衡`,
			prompt: null,
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
		ChatStore.setModel('image')

	})
	async function handleStream(options) {
		let result = '';
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
			onmessage: (text : UniApp.RequestSuccessCallbackResult) => {
				result += text;
				ChatBoxRef.value.setMessage(id, { id: id, state: 'ok', target: 'assistant', message: result, messageType: 'text' });
				scrollToBottom();
			},
			onerror: (err) => {
				console.log(err);
				const currentMessage = ChatBoxRef.value.getSingelMessage(id);
				if (currentMessage.state == 'waite') {
					ChatBoxRef.value.deleteMessage(id)
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

<style lang="scss">
	.imageModel {
		padding: 25rpx;
		display: flex;
		flex-direction: column;

		&_header {
			font-weight: 800;
			font-size: 27rpx;
		}

		&_viewBox {
			display: flex;
			width: 100%;
		}

		&_girdBox {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-gap: 20rpx;
		}

		&_view {
			display: flex;
			align-items: center;
			flex-direction: column;
			padding: 20rpx 0;
			width: max-content;

			&_image {
				width: 150rpx;
				height: 200rpx;
			}

			&_text {
				text-align: center;
				font-size: 25rpx;
				padding: 10rpx 0;
			}
		}
	}
</style>