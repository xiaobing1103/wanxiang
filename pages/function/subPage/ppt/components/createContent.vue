<template>
	<z-paging :scroll-with-animation="true" :show-scrollbar="false" ref="pagingRef" :pagingStyle="{padding:'24rpx'}">
		<template #top>
			<CommonHeader defindTitle="AI一键生成PPT" />

			<text class="description">
				AI赋能,释放内容创造力，一键生成PPT.省去大量的时间,自动由人工智能驱动为你的主题/课题/论点生成大量:标题.大纲,子纲,要点,内容等,并自动生成一份简洁大气的PPT(可手动插入内容后由Ai帮你制造PPT演示文件)
			</text>
			<!-- 顶部切换 -->
			<view class="head">
				<text v-for="(item,index) in typeList" @click="onTabChange(item)" :key="index"
					:class="['head-item',{'active-item':index == currentCreateItem.key}]">
					{{item.name}}
				</text>
			</view>
		</template>
		<view class="ppt-con">
			<view class="create-type">
				<!-- 输入框 -->
				<view class="input-box">
					<u-textarea height="150" v-model="currentCreateItem.content"
						:placeholder="currentCreateItem.placeholder"></u-textarea>
				</view>
				<!-- 开始按钮 -->
				<view class="btn">
					<u-button :disabled="isRecive" @click="onCreateContent" style="border-radius: 15rpx;height: 88rpx;"
						type="primary">第二步:开始生成内容</u-button>
				</view>
				<view v-if="contentStr" class="content">
					<textarea :style="{fontSize:'30rpx',width:'100%'}" :disabled="true" v-model="contentStr"
						:adjustPosition="false" auto-height border="surround" :maxlength="-1"></textarea>
				</view>
			</view>
		</view>
		<template #bottom>
			<view v-if="contentStr && isRecive == false" class="btn">
				<u-button @click="onNext" style="border-radius: 15rpx;height: 88rpx;"
					type="primary">第三步:修改AI生成内容</u-button>
			</view>
		</template>
	</z-paging>
	<!-- #ifdef APP -->
	<up-popup round="10" :show="ChatStore.shareButton" @close="ChatStore.setShareButton(false)">
		<ShareBtn :sharedataTemp="ChatStore.sharedata"></ShareBtn>
	</up-popup>
	<ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore"
		@onFinish="finishCore" />
	<!-- #endif -->
</template>

<script setup lang="ts">
	// #ifdef APP
	import ChatSSEClient from "@/components/gao-ChatSSEClient/gao-ChatSSEClient.vue";
	import ShareBtn from '@/components/ShareBtn.vue';
	// #endif
	import CommonHeader from '@/components/CommonHeader.vue';
	import { ref, nextTick } from 'vue'
	import { useStreamHooks } from '@/hooks/useStreamHooks'
	import { useChatStore } from '@/store';
	enum createEnum {
		'TITLE' = 'title',
		'CONTENT' = 'content'
	}
	interface TypeItem {
		name : string;
		key : createEnum;
		btnText : string;
		content : string;
		placeholder : string;
	}
	const emit = defineEmits<{
		(e : 'next', val : { content : string, type : createEnum }) : void
	}>()
	const { streamRequest, isRecive, streamSpark
		// #ifdef APP
		, openCore, errorCore, messageCore, finishCore, chatSSEClientRef
		// #endif
	} = useStreamHooks()
	const pagingRef = ref()
	//当前输出的内容
	const ChatStore = useChatStore();
	const contentStr = ref('')
	//类型列表
	const typeList : Record<createEnum, TypeItem> = {
		[createEnum.TITLE]: {
			name: "主题由AI生成",
			key: createEnum.TITLE,
			btnText: '第二步:开始生成内容',
			content: "",
			placeholder: "请输入PPT主题,列如:运营岗位能力知识体系架构"
		},
		[createEnum.CONTENT]: {
			name: "有内容?内容梳理后生成",
			key: createEnum.CONTENT,
			btnText: '第二步:开始总结用户内容',
			content: "",
			placeholder: "你可以输入一片文章/演讲稿/新闻/报道/任意长的文字,AI会帮你整理该段文本,适配PPT演示格式"
		}
	}
	//滚动到底部
	const onScroolToBottom = () => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
		})
	}

	//当前创建类型
	const currentCreateItem = ref<TypeItem>(typeList[createEnum.TITLE])

	// 导航栏切换
	const onTabChange = (item : TypeItem) => {
		currentCreateItem.value = item
	}
	//第三步
	const onNext = () => {
		emit('next', {
			content: contentStr.value,
			type: currentCreateItem.value.key
		})
	}
	//开始生成内容
	const onCreateContent = () => {
		const { key, content } = currentCreateItem.value
		if (!content) {
			uni.$u.toast('请先填写内容！');
			return
		}
		const endContent = key == createEnum.TITLE ? `我的标题是:${content}` : `我的内容是:${content}`

		const params = [
			{
				role: 'user',
				content: endContent,
			}
		]
		const data = {
			params: JSON.stringify(params),
			type: "Web-PPT生成内容",
			prompt: "我希望你根据我的标题生成文档，以下格式中 ## 为章节、###为大纲、####为小纲、- 为根据\"小纲\"补充的回答，必须对小纲进行回答，严格要求必须有2个以上章节，严格要求每个小纲必须有2个以上的回答，严格按照以下格式输出：\n\n# 标题\n\n## 1\n### 1.1\n#### 1.1.1\n- \n- \n\n#### 1.1.2\n- \n- \n\n#### 1.1.3\n- \n- \n\n### 1.2\n#### 1.2.1\n- \n- \n\n#### 1.2.2\n- \n- \n\n#### 1.2.3\n- \n- \n\n### 1.3\n#### 1.3.1\n- \n- \n\n#### 1.3.2\n- \n- \n\n#### 1.3.3\n- \n- \n\n## 2\n### 2.1\n#### 2.1.1\n- \n- \n\n#### 2.1.2\n- \n- \n\n#### 2.1.3\n- \n- \n\n### 2.2\n#### 2.2.1\n- \n- \n\n#### 2.2.2\n- \n- \n\n#### 2.2.3\n- \n- \n\n### 2.3\n#### 2.3.1\n- \n- \n\n#### 2.3.2\n- \n- \n\n#### 2.3.3\n- \n- \n\n## 3\n### 3.1\n#### 3.1.1\n- \n- \n\n#### 3.1.2\n- \n- \n\n#### 3.1.3\n- \n- \n\n### 3.2\n#### 3.2.1\n- \n- \n\n#### 3.2.2\n- \n- \n\n#### 3.2.3\n- \n- \n\n### 3.3\n#### 3.3.1\n- \n- \n\n#### 3.3.2\n- \n- \n\n#### 3.3.3\n- \n- \n\n\n## 4\n### 4.1\n#### 4.1.1\n- \n- \n\n#### 4.1.2\n- \n- \n\n#### 4.1.3\n- \n- \n\n### 4.2\n#### 4.2.1\n- \n- \n\n#### 4.2.2\n- \n- \n\n#### 4.2.3\n- \n- \n\n### 4.3\n#### 4.3.1\n- \n- \n\n#### 4.3.2\n- \n- \n\n#### 4.3.3\n- \n请严格按照我的设定回答"
		}
		let newStr = ''
		streamRequest({
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage: async (text) => {
				console.log(text)
				newStr += text
				contentStr.value = await streamSpark(newStr)
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
			checkNumsType: 'fun_ppt'
		})
	}
</script>

<style lang="scss" scoped>
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
			.input-box {
				overflow: hidden;
				border-radius: 20rpx;
				border: 1px solid $uni-border-color;
			}

			.content {
				margin-top: 20rpx;
				padding: 20rpx;
				border-radius: 20rpx;
				overflow: hidden;
				box-sizing: border-box;
				border: 2rpx solid $uni-border-color;
			}

			.btn {
				margin-top: 20rpx;
			}
		}
	}
</style>