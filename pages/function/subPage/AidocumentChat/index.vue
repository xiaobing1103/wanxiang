<template>
	<z-paging ref="srollRef" :pagingStyle="{padding:'24rpx'}">
		<template #top>
			<CommonHeader defindTitle="AI文档对话" />
		</template>
		<view class="ppt-con">
			<view class="upload_file">
				<view class="upload_file_header">
					<up-tabs :current="currentProject" :list="list1" @click="changeProject"></up-tabs>
				</view>
				<template v-if="currentProject == 0">
					<view class="upload_file_title">
						文档上传
					</view>
					<view class="upload_file_main">
						<up-upload :previewImage="false" :accept="accept" @afterRead="afterRead" @delete="deletePic"
							:fileList="fileList1" :maxCount="1" name="1" multiple>
							<view class="up-upload-box">

								<view class="upload_file_main_com">
									<view class="upload_file_main_comBox">
										<view class="upload_file_main_comBoxList" v-for="(items,index) in docList"
											:key="index">
											<image class="upload_file_main_com_icons" :src="items.icon" mode=""></image>
											<text class="upload_file_main_com_texts">{{items.title}}</text>
										</view>
									</view>
									<text class="upload_file_main_com_top">请点击上传文档</text>
									<text
										class="upload_file_main_com_bottom">您可以上传PDF、Word、Excel、PPTX或ePub文件，快速获取文档总结与分析</text>
								</view>
							</view>
						</up-upload>
					</view>
					<view class="create-type">
						<view class="create-type_header">
							<image class="create-type_header_image"
								src="//file.1foo.com/2023/12/29/56f121704e2a971031cd66633fd286b4.svg" mode=""></image>
							我的文档列表 <text class="create-type_header_text">（最多保存七天）</text>
						</view>
						<view class="input-box">
							<template v-if="fileList.length>0">
								<view class="input-box_fileListBox" v-for="(items,index) in fileList" :key="index">

									<view class="input-box_fileListBox_leftBox">
										<image class="input-box_fileListBox_images" :src="getIcon(items?.name)"
											mode="" />
										<view class="input-box_fileListBox_items"
											@click="seletedFileSearch(items.file_id)">
											<view class="input-box_fileListBox_items">{{items?.name}}</view>
											<view>{{getStatus(items.status, items.chunk_num, items.complete_chunk_num)}}
											</view>
										</view>
									</view>
									<view class="input-box_fileListBox_rightBox">
										<up-icon @click="showModal(items.file_id)" size="20" name="close"></up-icon>
									</view>
								</view>
							</template>
							<template v-else>
								<view class="nofileList">
									现在没有上传文档，请先去上传文档
								</view>
							</template>
						</view>
					</view>
				</template>
				<template v-if="currentProject == 1">
					<DocChatVue :scrollToBottom="scrollToBottom" :currentFileSearch="currentFileSearch"
						ref="DocChatVueRef" />
				</template>
				<template v-if="currentProject == 2">
					131231321
				</template>
			</view>
		</view>
	</z-paging>
	<up-modal showCancelButton @cancel="show = false" @confirm="deleteFile" :show="show" title="删除文件"
		content="是否删除此文件？">
	</up-modal>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, nextTick, computed } from 'vue'
	import CommonHeader from '@/components/CommonHeader.vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { iconUrls } from './data'
	import { useCounterStore } from '@/store';
	import useChatStore from '@/store/chat';
	import DocChatVue from './components/DocChat.vue';
	import { storeToRefs } from 'pinia';
	import { generateUUID } from '@/tools/uuid';
	import { commonModel } from '@/config/modelConfig';
	const accept = computed(() => {
		// #ifdef H5
		return 'file'
		// #endif
		// #ifdef MP-WEIXIN
		return 'all'
		// #endif
	})

	const srollRef = ref(null)
	const seletedId = ref('')
	const show = ref(false)
	const DocChatVueRef = ref(null)
	const list1 = reactive([
		{ name: '文档上传' },
		{ name: '文档对话' },
		{ name: '使用教程' },
	]);

	const currentProject = ref(0)
	const ChatStore = useChatStore();
	// #ifdef MP-WEIXIN
	const system = useCounterStore()
	const { menuButtonInfo, navBarHeight } = storeToRefs(system)
	// #endif
	const docList = reactive([{
		title: 'DOC文档',
		icon: '//file.1foo.com/2023/11/06/ef9fbb611df1426d6e3909da3f5324da.png'
	},
	{
		title: 'PDF文档',
		icon: '//file.1foo.com/2023/11/06/af288b5ee7d03e055a52ecff4b680858.png'
	},
	{
		title: 'CSV文档',
		icon: '//file.1foo.com/2023/11/06/3c69a8ef4ceb28442b4233361a28e060.png'
	},
	{
		title: 'PPT文档',
		icon: '//file.1foo.com/2023/11/06/8a40b46bbcc9b10d7fcbbca08b8c8c99.png'
	},
	{
		title: 'PUB文档',
		icon: '//file.1foo.com/2023/11/06/25ca3372d739680d19564d170e536bcf.png'
	},
	])
	const scrollToBottom = () => {
		nextTick(() => {
			if (srollRef.value) {
				srollRef.value.scrollToBottom();
			}
		});
	};

	const showModal = (id : string) => {
		seletedId.value = id
		show.value = true
	}
	const deleteFile = async () => {
		const res = await $api.post('api/v1/doc/fileDelete', { file_id: seletedId.value })
		if (res.code == 200) {
			show.value = false
			await getfilelist()
			uni.$u.toast('删除成功！')
		} else {
			uni.$u.toast('删除失败！')
		}
	}
	const fileList1 = ref([])
	// 删除图片
	const deletePic = (event : { index : number; }) => {
		fileList1.value.splice(event.index, 1);
	};
	function checkFileType(fileName : string) {
		// 定义允许上传的文件扩展名
		const allowedExtensions = ['doc', 'docx', 'csv', 'ppt', 'pdf', 'txt'];
		// 获取文件的扩展名	
		const fileExtension = fileName.split('.').pop().toLowerCase();
		// 检查文件扩展名是否在允许的列表中
		if (allowedExtensions.includes(fileExtension)) {
			return true; // 文件类型允许
		} else {
			return false; // 文件类型不允许
		}
	}
	const currentFileSearch = ref({})
	const seletedFileSearch = async (fileId : string) => {
		const parmas = {
			file_id: fileId,
			query: "总结和问题"
		}
		const fileSearchRes = await $api.post('api/v1/doc/fileSearch', parmas)
		if (fileSearchRes.code == 200) {
			const list = fileSearchRes.data.find((items : { file_id : string; }) => items.file_id == fileId)
			currentFileSearch.value = list;
			currentProject.value = 1;
			ChatStore?.changeSelectChatId(generateUUID());
			setTimeout(() => {
				if (DocChatVueRef.value) {
					DocChatVueRef.value.onSend(list.question)
				}
			}, 100)

		} else {
			uni.$u.toast('文件查询失败！')
		}
	}
	const changeProject = (e) => {
		currentProject.value = e.index
	}
	// 新增图片
	const afterRead = async (event : { file : any; }) => {
		if (checkFileType(event.file[0].name)) {
			let formData : FormData | any
			let file2textRes : any
			// #ifdef H5
			formData = new FormData()
			formData.append('file', event.file[0].file)
			file2textRes = await $api.post('api/v1/files/file2text', formData)
			// #endif
			// #ifdef MP-WEIXIN
			formData = { file: event.file[0].url }
			file2textRes = await $api.post('api/v1/files/file2text', formData, true, {}, null, true)
			// #endif
			if (typeof file2textRes == 'string') {
				file2textRes = JSON.parse(file2textRes)
			}
			if (file2textRes.code == 200) {
				const parmas = {
					file: {
						name: event.file[0].name,
						download_url: file2textRes.url,
						content: file2textRes.data,
						size: event.file[0].size
					}
				}

				const uploadFileRes = await $api.post('api/v1/doc/uploadFile', parmas)
				if (uploadFileRes.code == 200) {
					checkFileUploadStatus()
				}
			}
		} else {
			uni.$u.toast('不支持的格式类型！')
		}

	};

	async function checkFileUploadStatus() {
		const interval = setInterval(async () => {
			const status = await getfilelist(); // 调用 getfilelist 并获取第一条数据的 status
			if (status === 2) {
				clearInterval(interval);
				uni.$u.toast('文件上传完成');
			} else if (status === 0) {
				uni.$u.toast('文件上传处理中...');
			} else {
				uni.$u.toast('文件状态异常');
			}
		}, 2000); // 每隔 2 秒检查一次状态
	}

	const { $api } = useGlobalProperties()
	const contentStr = ref('')
	const fileList = ref([])
	const getfilelist = async () => {
		const fileRes = await $api.get('api/v1/doc/fileList');
		if (fileRes.code == 200) {
			fileList.value = fileRes.data;

			return fileRes.data.length > 0 ? fileRes.data[0].status : null;
		}
		return null;
	}
	onMounted(() => {
		getfilelist()
		ChatStore?.setModel('doc')
	})

	const getIcon = (file_name : string) => {
		const splist = file_name.split('.')
		const fileExtension : string = splist[splist.length - 1]
		const iconUrl = iconUrls[fileExtension] || iconUrls['other']
		return iconUrl
	}
	const getStatus = (status : number, chunk_num ?: number, complete_chunk_num ?: number) => {
		switch (status) {
			case 0:
				return '等待向量化数据'
			case 1: {
				let msg = '正在向量化数据'
				if (chunk_num && complete_chunk_num) {
					msg += '：' + Math.floor((complete_chunk_num / chunk_num) * 100) + '%'
				}
				return msg
			}
			case 2:
				return '状态可用'
			default:
				return '向量化失败'
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .placeClass {
		font-size: 27rpx;
	}

	.head {
		font-size: 32rpx;
		display: flex;
		width: 100%;
		gap: 30rpx;
		margin: 40rpx 0;

		.head-item {
			position: relative;
		}

		.active-item {
			&::after {
				content: '';
				position: absolute;
				width: 50rpx;
				height: 6rpx;
				border-radius: 4rpx;
				bottom: -10rpx;
				left: 0;
				background-color: $uni-color-primary;
			}
		}
	}

	.description {
		font-size: 24rpx;
		color: $uni-text-color-grey;
	}

	.ppt-con {
		margin-bottom: 24rpx;

		.create-type {

			&_header {
				font-size: 34rpx;
				font-weight: 800;
				padding: 15rpx 0;
				display: flex;
				align-items: flex-end;

				&_image {
					height: 60rpx;
					width: 60rpx;
					margin-right: 10rpx;
				}

				&_text {
					font-weight: 500;
					font-size: 27rpx;
				}
			}

			.input-box {
				width: 100%;
				min-height: 500rpx;
				overflow-y: scroll;
				border-radius: 20rpx;
				border: 1px solid $uni-border-color;
				max-height: 500rpx;
				padding: 20rpx;
				font-size: 27rpx;

				&_textarea {
					overflow-y: scroll;
				}

				&_fileListBox {
					display: flex;
					width: 100%;
					height: 100%;
					justify-content: space-evenly;
					align-items: center;
					margin-bottom: 25rpx;
					padding: 20rpx;
					background-color: #f1f1ff;
					border-radius: 25rpx;

					&_leftBox {
						width: 100%;
						height: 60rpx;
						display: flex;
						align-items: center;
						justify-content: flex-start;
					}

					&_items {
						display: flex;
						flex-direction: column;
					}

					&_images {
						width: 50rpx;
						margin-right: 20rpx;
						height: 50rpx;
					}
				}
			}

			.content {
				margin-top: 20rpx;
				border-radius: 20rpx;
				overflow: hidden;
				box-sizing: border-box;
				border: 2rpx solid $uni-border-color;
			}


		}
	}



	.overPopup {
		display: flex;
		align-items: center;
		flex-direction: column;

		&_header {
			font-size: 30rpx;
			font-weight: 800;
			padding: 20rpx 0;
		}

		&_main {
			font-size: 27rpx;
			padding: 10rpx 0;
			width: 100%;
			display: flex;
			justify-content: center;
			border-bottom: 1rpx solid #f1f1ff;
		}
	}

	.btn {
		margin-top: 30rpx;
		width: 100%;

		&_content {
			border-radius: 15rpx;
		}
	}


	.AiDailyModel_footer {
		display: flex;
		align-items: center;
		justify-content: center;

		&_content {
			font-size: 27rpx;
			color: $aichat-text-color;
		}
	}

	.input-box {

		overflow-y: scroll;
		border-radius: 20rpx;
		border: 1px solid $uni-border-color;
		max-height: 400rpx;
		padding: 20rpx;
		font-size: 27rpx;

		&_textarea {
			min-height: 400rpx;
		}
	}


	.nofileList {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.upload_file {
		&_header {
			display: flex;
			justify-content: center;
		}

		&_title {
			padding: 25rpx 0;
			font-size: 35rpx;
			font-weight: 800;
		}

		&_main {
			&_comBox {
				display: flex;
			}

			&_comBoxList {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 25rpx;
				box-sizing: border-box;
				flex-direction: column;
			}

			&_com {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-radius: 15rpx;
				padding: 25rpx;
				background-color: #f1f1ff;

				&_icons {
					width: 50rpx;
					height: 50rpx;
				}

				&_texts {
					font-size: 20rpx;
				}

				&_top {
					font-weight: 800;
					padding: 20rpx 0;
					font-size: 30rpx;
				}

				&_bottom {
					font-size: 27rpx;
					text-align: center;
				}

			}
		}
	}


	.overlay_warp {
		width: 100%;
		height: 100%;


		&_box {
			display: flex;
			width: 100%;
			height: 100%;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			&_images {
				width: 100%;
				height: 70%;
			}
		}

		&_footer {
			color: white;
			display: flex;
			margin-top: 10rpx;
		}
	}
</style>