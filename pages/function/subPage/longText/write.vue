<template>
	<z-paging ref="pagingRef" :show-scrollbar="false" :scroll-with-animation="true">
		<template #top>
			<CommonHeader defindTitle="生成大纲" />
		</template>
		<view class="body">
			<!-- 写作主题 -->
			<view class="theme-box">
				<text class="title">写作主题</text>
				<text class="description">通过作文提纲的方式引导，帮助你撰写各种论文、研究报告等长篇文章，轻松写完长文。</text>
				<AreaText v-model="themeStr" placeholder="请输入文章标题(列如:探讨人工智能在医疗领域的应用前景)" />
				<view @click="onCreateContent" class="layoutBtn">
					<up-button :customStyle="{width:'50%',height:'60rpx',}" shape="circle" type="primary"
						:loading="buttonLoading" :disabled="buttonLoading">生成大纲</up-button>
				</view>
			</view>
			<!-- 文章大纲 -->
			<view class="artcle-box">
				<view class="title">
					<text>文章大纲</text>
					<text class="tips">(请确认提纲无误后在点击"生成正文")</text>
				</view>

				<AreaText @export="onExport" @reload="onCreateContent" :autoHeight="true" :show-action="true"
					placeholder="" height="300" v-model="outlineStr" />

				<text
					class="description">文章大纲往往对文章生成的质量有着很大的关系，如AI生成的大纲不满意或不符合文章主题，建议点击重新生成!否则AI创作的文章水平会参差不齐，请知悉!</text>
				<view class="layoutBtn" @click="createContent">
					<up-button :customStyle="{width:'50%',height:'60rpx',}" shape="circle" type="primary"
						:loading="buttonLoading" :disabled="isRecive">生成正文</up-button>
				</view>
			</view>
			<!-- 正文内容 -->
			<view v-if="showContent" class="artcle-box">
				<view class="title">
					<text>正文内容</text>
					<view class="action">
						<text class="item">当前字数：{{contentLength}}</text>
						<text class="item" @click="onCopy">复制全文</text>
						<text @click="onExport(allContent)">导出文档</text>
					</view>
				</view>
				<template v-for="(item,index) in contentExtraArr" :key="index">
					<AreaText @reload="onRelaod(index)" @export="onExport" :autoHeight="true" v-if="item.show"
						:show-action="true" placeholder="编辑大纲，生成全文初稿" height="300" v-model="item.content" />
				</template>
				<text @click="onCopy" v-if="outLineIndex == splitOutLineArr.length" class="btn">复制全文</text>
				<view @click="onGoOnCreate" v-else class="layoutBtn">
					<up-button :customStyle="{width:'50%',height:'60rpx',}" shape="circle" type="primary"
						:loading="buttonLoading" :disabled="isRecive">继续生成</up-button>
				</view>
			</view>
		</view>
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

	import CommonHeader from '@/components/CommonHeader.vue';
	import { ref, computed, watchEffect, watch, nextTick } from 'vue'
	import { useStreamHooks } from '@/hooks/useStreamHooks.ts'
	import AreaText from '../CommonComponents/areaText/index.vue'
	import { exportTxt, toCopyText } from '@/utils';
	import { useChatStore } from '@/store';
	interface ContentArr {
		content : string;
		show ?: boolean;
		outLine ?: string
	}
	const pagingRef = ref()
	const { streamRequest, isRecive, onCancelRequest, streamSpark,
		// #ifdef APP
		openCore, errorCore, messageCore, finishCore, chatSSEClientRef
		// #endif
	} = useStreamHooks()
	const showContent = ref(false)
	const themeStr = ref('')
	const outlineStr = ref('')
	const buttonLoading = ref(false)
	const splitOutLineArr = ref<string[]>([])
	const ChatStore = useChatStore();
	const outLineIndex = ref(0)
	const isContentComplete = ref(false)
	const contentExtraArr = ref<ContentArr[]>([])
	// watch(outlineStr, ((res) => {
	// 	console.log(res)
	// }))
	const outLine = computed(() => {
		return contentExtraArr.value[outLineIndex.value]
	})
	//复制
	const onCopy = () => {
		let str = ''
		contentExtraArr.value.forEach(item => {
			str += item.content
		})
		toCopyText(str)
	}

	const onRelaod = (index : number) => {
		outLineIndex.value = index
		contentExtraArr.value[index].content = ''
		createContent(false)
	}
	const onGoOnCreate = () => {
		const items = contentExtraArr.value.filter(item => item.show)
		const length = items.length - 1
		outLineIndex.value = length
		outLineIndex.value++
		createContent()
	}
	const allContent = computed(() => {
		let str = ''
		contentExtraArr.value.forEach(item => {
			str += item.content
		})
		return str
	})
	//生成正文
	const createContent = (isScroll = true) => {
		if (buttonLoading.value) {
			uni.$u.toast('请等待内容生成完成！')
			return
		}
		contentExtraArr.value[outLineIndex.value].show = true
		const params = [
			{
				role: 'user',
				content: `你扮演一名作家，帮我为标题为:${themeStr.value},大纲为:${outLine.value.outLine},基于上述要求帮我写一段文字，输出时不能使用首先-其次-此外-总之等没有可读性文章逻辑`,
			},
		]
		const data = {
			params: JSON.stringify(params),
			prompt: "",
			type: "Web-长文写作",
		}
		showContent.value = true
		if (isScroll) {
			pagingRef.value.scrollToBottom()
		}
		uni.showLoading({
			title: '正文生成中...'
		})
		buttonLoading.value = true
		let newStr = ''
		streamRequest({
			url: 'api/v1/chat2/v35',
			data,
			onfinish() {
				isContentComplete.value = true
				uni.hideLoading()
				buttonLoading.value = false
			},
			onerror(err) {
				if (err.includes('请升级会员')) {
					ChatStore.setShowLevelUpVipContent(err)
					ChatStore.setShowlevelUpVip(true)
				}
				uni.hideLoading()
				buttonLoading.value = true

			},
			onmessage: async (text : string) => {
				newStr += text
				contentExtraArr.value[outLineIndex.value].content = await streamSpark(newStr)

				if (isScroll) {
					pagingRef.value.scrollToBottom()
				}
			},
			checkNumsType: 'chat'
		})
	}
	const contentLength = computed<number>(() => {
		let length = 0
		contentExtraArr.value.forEach(item => {
			length += item.content.length
		})
		return length
	})
	const onExport = (val : string) => {
		if (!val) {
			uni.$u.toast('内容为空无法导出！')
			return
		}
		exportTxt(val);
	}

	// 生成大纲
	const onCreateContent = () => {
		if (buttonLoading.value) {
			uni.$u.toast('请等待内容生成完成！')
			return
		}
		if (!themeStr.value) {
			uni.$u.toast('文章标题为空,无法为您生成大纲')
			return
		}
		outlineStr.value = ''
		const params = [
			{
				role: 'system',
				content: `你扮演一名作家，当我给你一个标题, 你将为我的标题生成相关的大纲, 格式如下:
						# 科技引领未来：探讨人工智能在医疗领域的应用前景
						## 人工智能在医疗领域的概述
						### 介绍人工智能的定义和原理
						### 解释人工智能在医疗领域的应用范围和优势
						### 引出本文对人工智能在医疗领域应用前景的探讨

						## 人工智能在医疗诊断中的应用前景
						### 分析人工智能在医学影像诊断中的优势和潜力
						### 探讨人工智能在疾病预测和早期诊断中的应用前景
						### 介绍人工智能在个体化治疗方面的潜力和挑战

						## 人工智能在医疗管理和决策支持中的应用前景
						### 分析人工智能在医疗大数据分析和决策支持中的优势和潜力
						### 探讨人工智能在医院管理和资源调配中的应用前景
						### 介绍人工智能在医疗风险评估和预警中的潜力和挑战

						## 人工智能在医疗创新和研发中的应用前景
						### 分析人工智能在新药研发和生物医学研究中的优势和潜力
						### 探讨人工智能在医疗器械研发和生产中的应用前景
						### 介绍人工智能在医学教育和培训中的潜力和挑战

						## 人工智能在医疗伦理和法律中的应用前景
						### 分析人工智能在医疗隐私和数据安全方面的潜力和挑战
						### 探讨人工智能在医疗决策和责任分配中的应用前景
						### 介绍人工智能在医疗伦理和法律框架中的挑战和可能解决方案

						## 结论
						### 总结人工智能在医疗领域的应用前景和可能的挑战
							`
			},
			{
				role: 'user',
				content: `我的标题是:${themeStr.value}`,
			},
		]
		const data = {
			params: JSON.stringify(params),
			prompt: "你是一名文档命题大纲助手，接下来我需要你帮我把文档命题的大纲列出来，每个大纲请使用两个换行符分行，并以中文回复。。",
			type: "Web-AI论文模式生成大纲",
		}
		uni.showLoading({
			title: '大纲生成中...'
		})
		buttonLoading.value = true
		let newStr = ''
		streamRequest({
			url: 'api/v1/chat2/v35',
			data,
			onfinish() {
				contentExtraArr.value = []
				splitOutLineArr.value = splitText(outlineStr.value)
				splitOutLineArr.value.forEach(item => {
					const obj : ContentArr = {
						show: false,
						content: '',
						outLine: item
					}
					contentExtraArr.value.push(obj)
				})
				console.log(splitOutLineArr.value, "分割后的大纲")
				uni.hideLoading()
				buttonLoading.value = false
			},
			onerror(err) {
				if (err.includes('请升级会员')) {
					ChatStore.setShowLevelUpVipContent(err)
					ChatStore.setShowlevelUpVip(true)
				}
				uni.hideLoading()
				buttonLoading.value = false

			},
			oncancel() {
				uni.hideLoading()
				buttonLoading.value = false
			},
			onmessage: async (text : string) => {
				newStr += text
				outlineStr.value = await streamSpark(newStr)
				nextTick(() => {
					pagingRef.value.scrollToBottom()
				})

			},
			checkNumsType: 'fun_long_thesis'
		})

	}
	function splitText(str : string) {
		const reg = /^##\s(.*)/g
		const result = []
		let tempStr = ''
		const strArray = str.split(/\n/).map(item => item.trim())
		strArray.forEach((item, index) => {
			if (reg.test(item)) {
				tempStr += item
				for (let i = index; i < strArray.length; i++) {
					if (reg.test(strArray[i])) {
						result.push(tempStr)
						tempStr = ''
						break
					} else {
						tempStr += strArray[i] + '\n'
					}
				}
			}
		})
		return result
	}
</script>
<style lang="scss" scoped>
	.body {
		margin: 24rpx;

		.artcle-box {
			margin-top: 40rpx;
			margin-bottom: 100rpx;

			.title {
				display: flex;
				font-size: 36rpx;
				align-items: baseline;

				.action {
					margin-left: auto;
					font-size: 26rpx;
					color: $u-primary;
					display: flex;
					gap: 30rpx;
				}

				.tips {
					font-size: 24rpx;
					color: $uni-text-color-disable;
					display: block;
					margin-left: 10rpx;
				}
			}

			.description {
				display: block;
				margin-top: 10rpx;
				font-size: 24rpx;
				line-height: 40rpx;
				color: $uni-text-color-disable;
			}

			.btn {
				display: block;
				width: 200rpx;
				margin: 30rpx auto;
				margin-top: 20rpx;
				text-align: center;
				padding: 20rpx 60rpx;
				border-radius: 20rpx;
				background-color: $u-primary;
				color: white;
				font-size: 26rpx;
			}
		}

		.theme-box {
			display: flex;
			flex-direction: column;

			.title {
				display: block;
				font-size: 36rpx;
				font-weight: 500;
				padding-bottom: 10rpx;
			}

			.description {
				font-size: 24rpx;
				color: $uni-text-color-disable;
			}

			.btn {
				margin-left: auto;
				margin-top: 20rpx;
				padding: 12rpx 40rpx;
				background: $u-primary;
				color: white;
				font-size: 24rpx;
				border-radius: 20rpx;
			}
		}
	}

	.layoutBtn {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 25rpx 0;
	}
</style>