<template>
	<z-paging ref="pagingRef"
		:pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx',justifyContent:'center'}">
		<!-- #ifdef H5 -->
		<view class="AImapping1">
			<view class="svg-container" ref="svgWrapRef">
				<svg ref="svgRef" class="svg-container_svg"></svg>
				<div class="mapping_svgToolBar" ref="refToolbar" />
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<web-view :src="url"></web-view>
		<!-- #endif -->
	</z-paging>
</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app';
	import { onMounted, ref, shallowRef, watch } from 'vue';
	import { useStreamHooks } from '@/hooks/useStreamHooks'
	import { Transformer } from 'markmap-lib'
	import { Markmap } from 'markmap-view'
	import { useChatStore, useUserStore } from '@/store';
	const ChatStore = useChatStore();
	const svgRef = shallowRef<SVGElement>()
	const svgWrapRef = shallowRef<HTMLDivElement>()
	const transformer = new Transformer()
	const refToolbar = shallowRef<HTMLDivElement>()
	let markmap : Markmap | null = null
	const url = ref('')
	const initValue = `# ChatGptWeb系统
  ## 基础功能
  - 支持AI聊天
  - 支持GPT4
  - 支持DLLAE2
  - 支持Midjourney
  - 支持mind思维导图生成
  - 更多功能等你探索......

  ## 更多内容
  -  在上面输入您想要生成的内容
  - 点击生成即可
  `
	const descInput = ref('')
	const { streamRequest } = useStreamHooks()
	// 定义一个方法，用于向 WebView 发送消息
	watch(descInput, (() => {
		console.log(descInput.value)
		renderMarkMap()
	}))

	const renderMarkMap = () => {
		const { root } = transformer.transform(descInput.value)
		markmap?.setData(root)
		markmap?.fit()
	}
	const createMarkmap = () => {
		// if (isRecive.value) {
		// 	uni.$u.toast('正在输出中请等待！')
		// 	return
		// }
		markmap?.destroy()
		if (svgRef.value) {
			markmap = Markmap.create(svgRef.value)
		}
	}

	const onCreateContent = (str) => {
		onFetchChat(str)
	}

	const onFetchChat = async (content ?: string) => {
		const prompt =
			"You are ChatGPT, a large language model trained by OpenAI. Please carefully follow the user's instructions. I need to use the Xmind tool to create a mind map, and you need to provide text in Markdown format that is compatible with Xmind."
		const questions = [
			{
				role: 'user',
				content:
					"请根据下面的主题生成思维导图:'" +
					content +
					"'，回答的时候不要有任何其他内容，你只需要输出markdown，请严格按照我的格式模版要求执行。" +
					` 
			    格式模版
			    # 周报
			    - 日期：[填写日期]
			    - 目标：[填写本周目标]
			    - 进展：
			      - [填写任务1进展]
			      - [填写任务2进展]
			      - [填写任务3进展]
			    - 问题：
			      - [填写问题1]
			      - [填写问题2]
			      - [填写问题3]
			    - 下周计划：
			      - [填写任务1计划]
			      - [填写任务2计划]
			      - [填写任务3计划]`
			}
		]

		const data = {
			ask: JSON.stringify(questions),
			prompt,
			type: "zhipu"
		}
		const streamOptions = {
			url: 'api/v1/chat2/glm_4_flash',
			data: data,
			onmessage(text) {
				console.log(text)
				descInput.value += text
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
		}
		streamRequest(streamOptions)
	}


	onMounted(() => {
		descInput.value = initValue
		createMarkmap()
	});

	const UserStore = useUserStore()
	// 处理页面加载时的参数
	onLoad((query) => {
		if (query.sendMsg) {
			url.value = `https://h5.chataiwx.com/#/pages/function/subPage/AImappingPreview/index?sendmsg=${query.sendMsg}&App=${UserStore.userInfo.appid}&AccessToken=${UserStore.userInfo.access_token}&token=${UserStore.token}&uid=${UserStore.userInfo.id}&Vt=${UserStore.userInfo.vip}`

		}
	});
</script>

<style lang="scss" scoped>
	.AImapping1 {
		width: 100%;
		background-color: #ccc;
	}

	.svg-container {
		width: 100%;
		display: flex;
		align-items: center;

		justify-content: center;
		height: 600rpx;

		&_svg {
			width: 100%;
			height: 100%;
		}
	}
</style>