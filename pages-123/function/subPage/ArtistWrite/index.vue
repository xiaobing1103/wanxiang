<template>
	<z-paging ref="pagingRef" :pagingStyle="{ padding: '24rpx' }">
		<template #top>
			<template v-if="!showOverlay">
				<CommonHeader defindTitle="论文模式" />
			</template>

		</template>
		<view class="ppt-con">
			<view class="create-type">
				<view class="create-type_title">
					使用本模式后可以写出非常优秀、领域性的文章，例如可用于论文、研究报告、学术论坛、学术文章、科学研究、学术期刊
				</view>
				<view class="write_tabs">
					<view class="write_tabs_content">
						<up-tabs :current="current" :list="writeTabs" :itemStyle="{ width: '50%', height: '80rpx' }"
							customClass="write_tabs" @click="clickTabs"></up-tabs>
					</view>
				</view>
				<template v-if="current == 0">
					<view class="create-type_header">
						AI生成大纲：
					</view>
					<view class="input-box input-box1">
						<textarea :style="{ fontSize: '30rpx', width: '100%' }" class="input-box_textarea" auto-height
							v-model="inputValue" placeholder="请输入论文/文章命题,最多60字" maxlength="60"></textarea>
					</view>
					<view class="create-type_header">
						大纲输出结果：(点击结果可以撰写大纲)
					</view>
					<view class="input-outBox" v-if="contentStr">
						<MessageItem :content="contentStr" />
					</view>
					<template v-else>
						<template v-for="(lines, index) in outlines" :key="index">
							<view class="outlines_Box">
								<view :style="{ background: lines.complete ? '#b3d9b1' : 'rgb(246, 247, 249)' }"
									class="outlines_Box_content" @click="openLayout(lines, index)">
									{{ lines.title }}
								</view>
							</view>
						</template>
					</template>
				</template>
				<template v-if="current == 1">
					<view class="reviewContentsPage_header">
						{{ inputValue }}
					</view>
					<view class="reviewContentsPage">
						<template v-for="(items, index) in outlines" :key="index">
							<view class="reviewContents">
								<text class="reviewContents_title">{{ items.title }}</text>
								<text class="reviewContents_content">{{ items.content }}</text>
							</view>
						</template>
					</view>
				</template>

			</view>
		</view>
		<template #bottom>
			<template v-if="current == 0">
				<template v-if="!showOverlay">
					<view class="btnGroup">
						<view class="btn">
							<u-button :customStyle="{ height: '60rpx', borderRadius: '25rpx', width: '80%' }"
								class="bth_content" :disabled="isRecive" @click="onCreateContent"
								type="primary">AI生成大纲</u-button>
						</view>
						<view class="btn">
							<u-button :customStyle="{ height: '60rpx', borderRadius: '25rpx', width: '80%' }"
								class="bth_content" :disabled="isRecive" type="primary" :plain="true"
								@click="AddDaGangContent">添加大纲</u-button>
						</view>
					</view>
					<view class="btnGroup">
						<view class="btn">
							<u-button :customStyle="{ height: '60rpx', borderRadius: '25rpx', width: '50%' }"
								class="bth_content" :disabled="isRecive" @click="exportFile"
								type="warning">导出</u-button>
						</view>
					</view>
				</template>
			</template>
		</template>
		<up-modal :showCancelButton="true" @cancel="showModal = false" @confirm="confirmModel" :show="showModal"
			title="确认删除" content='是否删除此条大纲内容'>

		</up-modal>
		<up-overlay :show="showOverlay">
			<z-paging ref="pagingRef2" :pagingStyle="{ background: 'rgb(246, 247, 249)' }">
				<template #top>
					<view class="overlay_warp_header">
						<CommonHeader defindTitle="撰写大纲" :backFunction="backFunction" />
					</view>
				</template>

				<view class="overlay_warp_main">
					<view class="overlay_warp_main_header">
						大纲标题：(可编辑标题)
					</view>
					<up-textarea v-model="daGangTitle" placeholder="请输入内容" height="150"></up-textarea>
					<view class="overlay_warp_main_header">
						大纲内容：(可编辑内容)
					</view>
					<up-textarea v-model="daGangContent" placeholder="请输入内容" height="200" maxlength="-1"
						autoHeight></up-textarea>
				</view>
				<template #bottom>
					<view class="overlay_warp_footer">
						<up-button :disabled="isRecive" @click="showModal = true"
							:custom-style="{ height: '60rpx', margin: '40rpx', padding: '20rpx 0' }"
							type="error">删除</up-button>
						<up-button :disabled="isRecive"
							:custom-style="{ height: '60rpx', margin: '40rpx', padding: '20rpx 0' }"
							@click="createDaGang" type="primary">开始</up-button>
						<up-button :disabled="isRecive" @click="resetCreateDaGang"
							:custom-style="{ height: '60rpx', margin: '40rpx', padding: '20rpx 0' }"
							type="default">重试</up-button>
						<up-button :disabled="isRecive"
							:custom-style="{ height: '60rpx', margin: '40rpx', padding: '20rpx 0' }" @click="saveDaGang"
							type="warning">
							保存
						</up-button>
					</view>
				</template>
			</z-paging>
		</up-overlay>
	</z-paging>
	<!-- #ifdef APP -->
	<ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore"
		@onFinish="finishCore" />
	<!-- #endif -->
</template>

<script setup lang="ts">
	// #ifdef APP
	import ChatSSEClient from "@/components/gao-ChatSSEClient/gao-ChatSSEClient.vue";
	// #endif

	import { ref, nextTick, reactive } from 'vue'
	import CommonHeader from '@/components/CommonHeader.vue'
	import { useStreamHooks } from '@/hooks/useStreamHooks'
	import MessageItem from '../AidocumentChat/components/MessageItem.vue';
	import { exportTxt } from '@/utils';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useChatStore } from '@/store';
	const showOverlay = ref(false)
	const showModal = ref(false)
	const confirmModel = () => {
		outlines.value = outlines.value.filter((items, index) => { return index !== currentIndex.value })
		console.log(outlines.value)
		showModal.value = false
		showOverlay.value = false
	}
	const backFunction = () => {
		showOverlay.value = false

	}
	// 大纲列表类型
	type Outline = {
		title : string
		content : string
		complete : boolean
	}
	const { $api } = useGlobalProperties()
	const inputValue = ref('')
	const inputValue2 = ref('')
	const daGangContent = ref('')
	const daGangTitle = ref('')
	const current = ref(0)
	const outlines = ref<Outline[]>([])
	const writeTabs = reactive([
		{ name: '大纲' },
		{ name: '结果' },
	])
	const clickTabs = ({ index }) => {
		current.value = index
	}
	const contentStr = ref(``)
	const ChatStore = useChatStore();
	const exportFile = () => {
		let msg = ''
		outlines.value.map((items, index) => {
			msg += items.title
			msg += items.content
		})
		if (msg) {
			exportTxt(msg);
		} else {
			uni.$u.toast('没有内容！')
		}
	}

	const AddDaGangContent = () => {
		outlines.value.push({
			title: '点击编辑大纲内容',
			content: '',
			complete: false,
		})
		uni.$u.toast('添加大纲成功！')
		onScroolToBottom()
	}
	const currentIndex = ref(null)
	const openLayout = (lines : Outline, index : number) => {
		if (lines.complete) {
			daGangContent.value = lines.content
		} else {
			daGangContent.value = ''
		}
		currentIndex.value = index
		daGangTitle.value = lines.title
		showOverlay.value = true

	}

	const saveDaGang = () => {
		showOverlay.value = false
		outlines.value[currentIndex.value].content = daGangContent.value
		outlines.value[currentIndex.value].title = daGangTitle.value
	}
	const { streamRequest, isRecive, streamSpark,
		// #ifdef APP
		openCore, errorCore, messageCore, finishCore, chatSSEClientRef
		// #endif
	} = useStreamHooks()
	const pagingRef = ref(null)
	const pagingRef2 = ref(null)
	const onScroolToBottom = () => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
		})
	}
	const onScroolToBottom2 = () => {
		nextTick(() => {
			pagingRef2.value.scrollToBottom()
		})
	}
	const onCreateContent = () => {
		if (!inputValue.value) {
			uni.$u.toast('请输入内容！')
			return
		}
		const params = [
			{
				role: 'user',
				content: `我的文档命题是：${inputValue.value}`
			}
		]
		const data = {
			params: JSON.stringify(params),
			type: "Web-AI论文模式生成大纲",
			prompt: `你是一名文档命题大纲助手，接下来我需要你帮我把文档命题的大纲列出来，要求如下。
		
		1. **使用标准的Markdown格式**。
		2. **文章结构包含：**

		- 标题（以 #  开头）
		- 简介（位于标题下方）
		- 多个章节，每个章节格式如下：
			- 章节标题（以 ## 第X章 章节标题 格式，例如 ## 第1章 绪论）
			- 章节内容（位于章节标题下方）

		3. **确保每个章节的标题和内容格式一致**，方便程序进行解析。
			
			`
		}
		contentStr.value = ''
		let newStr = ''
		outlines.value = []
		streamRequest({
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage: async (text : string) => {
				newStr += text
				contentStr.value = await streamSpark(newStr)
				onScroolToBottom()
			},
			onfinish() {
				console.log(contentStr.value);
				// 调整正则表达式，匹配以 ### 开头的标题

				// 调整正则表达式，匹配以 ** 开头和结尾的标题
				const chapterRegex = /^(#{1,6}\s.*$)|(\*\*.+?\*\*)/gm;

				// 获取所有章节标题
				const chapters = contentStr.value.match(chapterRegex);

				console.log('匹配到的章节：', chapters);

				if (chapters && chapters.length > 0) {
					for (let i = 0; i < chapters.length; i++) {
						// 提取标题，去掉前后的 **
						const title = chapters[i].replace(/\*\*/g, '').trim();

						// 找到当前章节内容的起始位置
						const start = contentStr.value.indexOf(chapters[i]) + chapters[i].length;

						// 找到下一章节标题的位置，作为当前章节内容的结束位置
						let end = contentStr.value.length;
						if (i + 1 < chapters.length) {
							end = contentStr.value.indexOf(chapters[i + 1]);
						}

						// 截取当前章节的内容
						const content = contentStr.value.substring(start, end).trim();

						// 将标题和内容添加到数组中
						outlines.value.push({ title, content, complete: false });
					}
					// 清空内容字符串
					contentStr.value = '';
					// 切换到显示结果的标签页
					current.value = 1;
				} else {
					// 如果未匹配到章节标题，提示用户
					uni.$u.toast('未能匹配到任何章节，请检查输入内容是否符合格式。');
				}
			},
			onerror(err) {
				if (err.includes('请升级会员')) {
					ChatStore.setShowLevelUpVipContent(err)
					ChatStore.setShowlevelUpVip(true)
				}
				console.log(err, "错误")
			},
			checkNumsType: 'chat'
		})
	}
	// 撰写大纲
	const createDaGang = () => {
		if (!daGangTitle.value) {
			uni.$u.toast('大纲标题不能为空！');
			return
		}

		const params = [
			{
				role: 'user',
				content: `我的文档命题是：${inputValue.value} \n我的大纲是： ${daGangTitle.value}`
			}
		]
		const data = {
			params: JSON.stringify(params),
			type: "Web-AI论文模式生成大纲",
			prompt: `你是一名文档大纲编写助手，接下来我需要你根据文档和大纲撰写文档内容，并以中文回复。`
		}
		let newStr = ''
		const RequestObj = {
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage: async (text) => {
				newStr += text
				daGangContent.value = await streamSpark(newStr)
				onScroolToBottom2()
			},
			onfinish() {
				outlines.value[currentIndex.value].complete = true
			},
			onerror(err) {
				if (err.includes('请升级会员')) {
					ChatStore.setShowLevelUpVipContent(err)
					ChatStore.setShowlevelUpVip(true)
				}
				console.log(err, "错误")
			},
			checkNumsType: 'chat'
		}
		streamRequest(RequestObj)
	}

	const resetCreateDaGang = () => {
		if (daGangContent.value) {
			daGangContent.value = ''
			createDaGang()
		} else {
			uni.$u.toast('请先开始撰写大纲内容！')
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
			&_title {
				font-size: 22rpx;
				color: $uni-border-color ;
			}

			&_header {
				font-size: 34rpx;
				font-weight: 800;
				padding: 15rpx 0;
				display: flex;
				align-items: center;

				&_image {
					height: 50rpx;
					width: 50rpx;
					margin-right: 10rpx;
				}
			}

			.input-box {
				width: 100%;
				overflow-y: scroll;
				border-radius: 20rpx;
				border: 1px solid $uni-border-color;
				min-height: 400rpx;
				padding: 20rpx;
				font-size: 27rpx;

				&_textarea {
					min-height: 120rpx;
				}
			}

			.input-box1 {
				min-height: 70rpx;
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

	.input-outBox {
		border: 1px solid $uni-border-color;
		padding: 20rpx;
		overflow-y: scroll;
		border-radius: 20rpx;
		font-size: 27rpx;
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

	.write_tabs {
		width: 100%;


		&_content {
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}

	.btnGroup {
		display: flex;
	}

	.outlines_Box {
		background-color: #f3f3f3;
		border-radius: 10rpx;

		margin-top: 20rpx;

		&_content {
			font-size: 25rpx;
			white-space: pre;
			padding: 10rpx;
			border-radius: 15rpx;
			box-shadow: rgba(190, 190, 190, 0.3) 0rpx 5rpx 15rpx;
		}
	}

	.overlay_warp {
		&_header {
			z-index: 500;
		}

		&_main {
			padding: 25rpx;
			z-index: 500;

			&_header {
				padding: 10rpx 0;
			}
		}

		&_footer {

			display: flex;
			position: sticky;
			bottom: 0;
			z-index: 500;
			background-color: $aichat-golbal-background ;

			.bth_left {
				height: 60rpx;
				margin: 40rpx;
				padding: 20rpx 0;
			}
		}
	}

	.reviewContentsPage {
		border-radius: 20rpx;
		padding: 20rpx;
		font-size: 27rpx;

		&_header {
			font-size: 34rpx;
			font-weight: 800;
			padding: 15rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.reviewContents {
		padding: 25rpx 0;

		&_title {
			color: $aichat-golbal-vipText;
		}

		&_content {
			color: $uni-text-color-grey;
		}
	}
</style>