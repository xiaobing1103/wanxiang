<template>
	<z-paging ref="pagingRef" :pagingStyle="{ background: 'rgb(246, 247, 249)',padding:'0 20rpx'}"
		:show-scrollbar=" false">
		<template #top>
			<CommonHeader defindTitle="智能体对话" />
			<template v-if="AiAgentChats.agentItem">
				<view class="header">
					<ChangeAigent style="width: 100%;" :icon="AiAgentChats.agentItem?.avatar"
						:title="AiAgentChats.agentItem?.name" @onToggle="onToggle" />
					<up-icon @click="AiAgentChats.setOpenHistoryModal(true)" color="#4955f5" name="clock"></up-icon>
				</view>
			</template>
		</template>
		<AIAgentChatBox ref="AIAgentChatBoxRef" v-model:mainParmas="mainParmas" />
		<template #bottom>
			<view class="chatBoxLayout">
				<MessageSendBox @onSend="onSend" v-model:mainParmas="mainParmas" />
			</view>
		</template>
	</z-paging>
	<up-popup round="10" :show="mainParmas.openUpLoadFileModal" @close="mainParmas.openUpLoadFileModal = false">
		<view class="uploadFileBox">
			<view class="uploadFileBox_tips">
				<up-alert type="warning" :show-icon="true"
					description="支持上传文件(最多3个,每个4MB)接收.pdf,.doc,.xlsx,.ppt,.txt,.jpeg,.png,.docx格式"></up-alert>
			</view>
			<view class="uploadFileBox_content">
				<template v-if="mainParmas.fileList.length < 3 ">
					<!-- #ifdef APP -->
					<UploadDemo :count="1" @UploadCallback="afterRead" type="file">
						<template #defaultTemplate>
							<view class="UploadBox">
								<view class="UploadBox_image">
									<image class="UploadBox_image_content" :src="$assets.uploadFileIcon" mode="">
									</image>
								</view>
								<view class="UploadBox_text">
									点击上传文件
								</view>
							</view>
						</template>
					</UploadDemo>
					<!-- #endif -->

					<!-- #ifndef APP -->
					<up-upload :previewImage="false"
						:customStyle="{display:'flex',alignItems:'center',width:'100%',height:'150rpx'}" accept="all"
						:fileList="mainParmas.fileList" @afterRead="afterRead" @delete="deletePic" name="5"
						:maxCount="3">
						<view class="UploadBox">
							<view class="UploadBox_image">
								<image class="UploadBox_image_content" :src="$assets.uploadFileIcon" mode=""></image>
							</view>
							<view class="UploadBox_text">
								点击上传文件
							</view>
						</view>
					</up-upload>
					<!-- #endif -->

				</template>
			</view>
			<view class="uploadFileBox_previewBox">
				<template v-for="(items ,index) in mainParmas.fileList" :key="index">
					<view class="uploadFileBox_previewBox_items">
						<image class="uploadFileBox_previewBox_items_image"
							:src="FileIconMap[items.name.split('.').pop()] ||items.url" mode=""></image>
						<view class="uploadFileBox_previewBox_items_rightBox">
							<view class="uploadFileBox_previewBox_items_rightBox_name">
								<text
									class="uploadFileBox_previewBox_items_rightBox_name_overflow">{{items.name.split('.')[0]}}</text>
								<text
									class="uploadFileBox_previewBox_items_rightBox_name_houzui">.{{items.name.split('.')[1]}}</text>
							</view>
							<view class="uploadFileBox_previewBox_items_rightBox_staus">
								<up-loading-icon v-if="items.loadding == 'loadding'"></up-loading-icon>
								<up-icon v-if="items.loadding == 'error'" name="close" color="red" size="20"></up-icon>
								<up-icon v-if="items.loadding == 'complete'" name="checkbox-mark" color="#50a14f"
									size="20"></up-icon>
								{{items.message}}
							</view>
						</view>
						<view @click="deletePic(index)" class="uploadFileBox_previewBox_items_icon">
							<up-icon name="close" color="#2979ff" size="20"></up-icon>
						</view>
					</view>
				</template>
			</view>
		</view>
	</up-popup>
	<AigentChangeItems />
	<AiAgentHistory />
	<!-- #ifdef APP -->

	<ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore"
		@onFinish="finishCore" />
	<!-- #endif -->
</template>

<script setup lang="ts">
	// #ifdef APP
	import ChatSSEClient from "@/components/gao-ChatSSEClient/gao-ChatSSEClient.vue";
	import UploadDemo from '@/pages/index/subPage/components/UploadDemo.vue'
	// #endif
	import AiAgentHistory from './AiAgentHistory.vue'
	import AigentChangeItems from './AigentChangeItems.vue'
	import ChangeAigent from './ChangeAigent.vue'
	import AIAgentChatBox from './AIAgentChatBox.vue'
	import CommonHeader from '@/components/CommonHeader.vue';
	import MessageSendBox from './MessageSendBox.vue';
	import { onMounted, reactive, ref, onUnmounted } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { FileIconMap, accepetFileTypes } from './datas'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { uploadFileBefore } from '@/utils';
	import { generateUUID } from '@/tools/uuid';
	import { useAiAgentChats, useChatStore } from '@/store'
	import { useStreamHooks } from '@/hooks/useStreamHooks'
	import { FileItem, MainPagesInterFace } from '@/store/aiAgentChats';
	const AIAgentChatBoxRef = ref<InstanceType<typeof AIAgentChatBox>>(null);
	const ChatStore = useChatStore();
	const { isRecive, streamRequest, setIsRecive, onCancelRequest, streamSpark,
		// #ifdef APP
		openCore, errorCore, messageCore, finishCore, chatSSEClientRef
		// #endif
	} = useStreamHooks()
	const { $api, $assets } = useGlobalProperties()
	const AiAgentChats = useAiAgentChats()
	const mainParmas = reactive<MainPagesInterFace>({
		openUpLoadFileModal: false,
		chatValue: '',
		fileList: [],
		isRecive,
		setIsRecive,
		streamRequest,
		onCancelRequest,
		streamSpark
	})

	// 新增图片
	const afterRead = async (event : { file : { name : string; }; }) => {
		console.log(event)
		let newFile = null
		// #ifdef APP
		newFile = { ...event[0] }
		newFile.file = [{ ...event[0], loadding: 'loadding', message: '上传中', }]
		// #endif
		// #ifndef APP
		newFile = { ...event }
		newFile.file = [{ ...event.file, loadding: 'loadding', message: '上传中', }]
		// #endif
		const Files = await uploadFileBefore(newFile, accepetFileTypes, 4194304, '内容大小超出限制,不能上传超过4mb大小的文件！', null, null, 'file2text')
		if (Files) {
			mainParmas.fileList.push(newFile.file[0])
			let FileReqs = await $api.post('https://open.aichatapi.com/api/v1/chat/zhipu.assistant/yfoo.file', Files.formdata, Files.isJson, {}, null, Files.isWechatSendImages)
			if (typeof FileReqs == 'string') {
				FileReqs = JSON.parse(FileReqs)
			}
			const len = mainParmas.fileList.length - 1
			if (FileReqs.code == 200) {
				mainParmas.fileList[len].message = Files.fileType + ' ' + bytesToKB(FileReqs.data.bytes) + 'KB'
				mainParmas.fileList[len].loadding = 'complete'
				mainParmas.fileList[len].type = Files.fileType
				mainParmas.fileList[len].id = FileReqs.data.id
			} else {
				mainParmas.fileList[len].message = '上传文件失败，请手动删除此文件！'
				mainParmas.fileList[len].loadding = 'error'
			}
		}
	};
	const bytesToKB = (bytes : number) => {
		return (bytes / 1024).toFixed(2); // 保留两位小数
	}
	// 删除图片
	const deletePic = (index : number) => {
		mainParmas.fileList.splice(index, 1);
	}

	const onSend = (value : string) => {
		AIAgentChatBoxRef.value?.onSendMessage(value, mainParmas.fileList)
	}


	const onCancel = () => {
	}
	onLoad(async (query) => {
		if (query.id !== AiAgentChats.agentId) {
			AiAgentChats.setAgentId(query.id)
			AiAgentChats.setCurrentConversation_id(null)
		}
		AiAgentChats.setMessageList([])
	});

	onMounted(async () => {
		AiAgentChats.setCurrentConversation_id(null)
		await getLists()
	})

	onUnmounted(() => {
		console.log('卸载页面！')
		AiAgentChats.setCurrentConversation_id(null)
		AiAgentChats.setMessageList([])
	})
	const onToggle = (e) => {
		console.log(e)
	}

	const getLists = async () => {
		const listReq = await $api.get('https://open.aichatapi.com/api/v1/chat/zhipu.assistant/yfoo.list')
		if (listReq.code == 200) {
			AiAgentChats.setAgentList(listReq.data)
			const curAgent = listReq.data.find((item : { assistant_id : string; }) => item.assistant_id == AiAgentChats.agentId)
			AiAgentChats.setAgentItem(curAgent)
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.chatBoxLayout {
		padding: 30rpx 0;
		/* #ifdef MP-WEIXIN */
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.uploadFileBox {
		padding: 30rpx;
		/* #ifdef MP-WEIXIN */
		padding-bottom: env(safe-area-inset-bottom);

		/* #endif */
		&_tips {
			font-size: 25rpx;
		}

		&_content {
			margin: 30rpx 0;
		}

		&_previewBox {
			display: flex;
			flex-direction: column;

			&_items {
				display: flex;
				align-items: center;
				margin: 10rpx;
				padding: 10rpx;
				border: 1rpx dashed #ccc;
				border-radius: 15rpx;
				position: relative;

				&_image {
					width: 100rpx;
					margin-right: 20rpx;
					height: 100rpx;
				}

				&_rightBox {
					display: flex;
					flex-direction: column;
					font-size: 24rpx;
					flex: 1;
					justify-content: center;

					&_name {
						display: flex;
						justify-content: flex-start;

						&_overflow {
							max-width: 400rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						&_houzui {}

					}

					&_staus {
						display: flex;
					}
				}

				&_icon {
					// position: absolute;
					top: 0;
					right: 0;
				}
			}
		}
	}

	.UploadBox {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 150rpx;
		width: 100%;
		height: 150rpx;
		border: 1rpx dashed #ccc;
		border-radius: 20rpx;
		flex-direction: column;
		font-size: 27rpx;

		&_image {
			padding: 20rpx 0;

			&_content {
				width: 50rpx;
				height: 50rpx;
			}
		}
	}
</style>