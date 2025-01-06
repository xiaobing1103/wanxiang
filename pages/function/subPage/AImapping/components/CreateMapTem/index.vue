<template>
	<view class="ppt-con">
		<view class="create-type">
			<view class="create-type_header">
				输入内容即可生成思维导图
			</view>
			<view class="input-box">
				<u-textarea height="150" v-model="currentCreateItem.content"
					:placeholder="currentCreateItem.placeholder"></u-textarea>
			</view>
			<view class="btn">
				<view class="btn_top" @click="onCreateContent(currentCreateItem.content)" :style="{
					background:isRecive ? 'var(--u-primary-disabled)' : 'var(--aichat-button-color)',
					color:isRecive ? 'var(--uni-text-color-disable)' : 'var(--uni-bg-color)'
					}" type="primary">
					生成思维导图
				</view>
			</view>
			<!-- #ifdef H5 -->
			<view class="contentHeader">
				<view class="contentHeader_left">
					内容大纲
				</view>
				<view class="contentHeader_right" @click="showExportPopup = true">
					导出文件
				</view>
			</view>
			<!-- #endif -->
		</view>
	</view>
	<!-- #ifdef H5 -->
	<view class="AImapping1">
		<div class="svg-container" ref="svgWrapRef">
			<svg ref="svgRef" class="svg-container_svg"></svg>
			<div class="mapping_svgToolBar" ref="refToolbar" />
		</div>
	</view>
	<up-popup round="10" v-model:show="showExportPopup">
		<view class="popupviewMain">
			<view class="popupview" v-for="(items,index) in exportOptions" :key="index" @click="handlers(items.key)">
				<view class="popupview_items">
					{{items.text}}
				</view>
			</view>
		</view>
	</up-popup>
	<!-- #endif -->
	<!-- #ifdef APP || H5 -->
	<MappingRenderJS ref="MappingRenderJSRef" @initMap="initMap" />
	<!-- #endif -->
</template>

<script setup lang="ts">
	import { Transformer } from 'markmap-lib'
	import { Markmap } from 'markmap-view'
	import { nextTick, onMounted, ref, shallowRef, watch } from 'vue'
	import { useStreamHooks } from '@/hooks/useStreamHooks'
	import { useChatStore, useUserStore } from '@/store';
	import { html2Image } from './html2Canvas';
	import MappingRenderJS from '../MappingRenderJS.vue'
	const svgRef = shallowRef<SVGElement>()
	const svgWrapRef = shallowRef<HTMLDivElement>()
	const transformer = new Transformer()
	const refToolbar = shallowRef<HTMLDivElement>()
	const showExportPopup = ref(false)
	let markmap : Markmap | null = null
	const UserStore = useUserStore()
	const exportOptions = ref([
		{
			text: '导出HTML',
			key: 'html'
		},
		{
			text: '导出PNG',
			key: 'png'
		},
	])
	const exportHtml = () => {
		const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,target-densitydpi=high-dpi,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <style>*{margin: 0;padding:0}html,body,.markmap{width: 100%;height:100%;overflow: hidden;}</style>
  <body>
    ${svgWrapRef.value?.innerHTML}
  </body>
</html>
`
		const blob = new Blob([html], { type: 'text/html' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = 'markmap.html'
		link.click()
		URL.revokeObjectURL(url)
	}
	function downloadBase64Image(base64Data, filename) {
		const link = document.createElement('a');
		link.href = base64Data;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	const handlers = (key : string) => {
		switch (key) {
			case "png":
				exportImg('png')
				break
			case 'html':
				exportHtml()
				break
		}
	}

	const initMap = (e) => {
		console.log(e)
	}

	const exportImg = async (type : 'png' | 'jpeg') => {
		const data = await html2Image(
			svgWrapRef.value!,
			{ type },
			{
				backgroundColor: '#fff',
				scale: window.devicePixelRatio * 1.5
			}
		)
		downloadBase64Image(data, '123')
	}
	const descInput = ref(``)
	enum createEnum {
		'TITLE' = 'title',
		'CONTENT' = 'content'
	}
	watch(descInput, (() => {
		console.log(descInput.value)
		renderMarkMap()
	}))

	const renderMarkMap = () => {
		const { root } = transformer.transform(descInput.value)
		markmap?.setData(root)
		markmap?.fit()
	}
	onMounted(() => {
		descInput.value = `# ChatGptWeb系统
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
		createMarkmap()
	})
	const createMarkmap = () => {
		markmap?.destroy()
		if (svgRef.value) {
			markmap = Markmap.create(svgRef.value)
		}
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
		(e : 'scrollBottom') : void
	}>()
	const { isRecive, streamRequest } = useStreamHooks()

	//类型列表
	const typeList : Record<createEnum, TypeItem> = {
		[createEnum.TITLE]: {
			name: "主题由AI生成",
			key: createEnum.TITLE,
			btnText: '第二步:开始生成内容',
			content: "",
			placeholder: "请输入你想要生成的内容描述,AI会为你生成一份思维导图"
		},
		[createEnum.CONTENT]: {
			name: "有内容?内容梳理后生成",
			key: createEnum.CONTENT,
			btnText: '第二步:开始总结用户内容',
			content: "",
			placeholder: "你可以输入一片文章/演讲稿/新闻/报道/任意长的文字,AI会帮你整理该段文本,适配PPT演示格式"
		}
	}
	const currentCreateItem = ref<TypeItem>(typeList[createEnum.TITLE])

	const onCreateContent = (str) => {
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		const { key, content } = currentCreateItem.value
		if (!content) {
			uni.$u.toast('输入内容为空！')
			return
		}
		// #ifdef H5
		onFetchChat(str)
		// #endif
		// #ifdef MP-WEIXIN
		if (UserStore.token) {
			uni.navigateTo({
				url: `/pages/function/subPage/WeChatWebview/index?sendMsg=${content}`
			})
		} else {
			uni.$u.toast('请先登录账号！')
		}

		// #endif

	}
	const ChatStore = useChatStore();
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
		descInput.value = ''
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
			checkNumsType: 'fun_mapping'
		}
		streamRequest(streamOptions)
	}
</script>

<style lang="scss" scoped>
	.ppt-con {
		padding: 25rpx;
		margin-bottom: 24rpx;
		--u-primary-disabled: #{$u-primary-disabled};
		--aichat-button-color: #{$aichat-button-color};
		--uni-text-color-disable: #{$uni-text-color-disable};
		--uni-bg-color: #{$uni-bg-color};

		.create-type {

			&_header {
				padding: 15rpx 0;
				font-size: 27rpx;
			}

			.input-box {
				overflow: hidden;
				border-radius: 20rpx;
				border: 1px solid $uni-border-color;
			}

			.content {
				height: 100%;
				min-height: 400rpx;
				margin-top: 20rpx;
				border-radius: 20rpx;
				overflow: auto;
				box-sizing: border-box;
				padding: 20rpx;
				border: 2rpx solid $uni-border-color;

				&_textarea {
					font-size: 27rpx;
				}
			}

			.btn {
				margin-top: 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				&_top {
					height: 60rpx;
					width: 60%;
					font-size: 27rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 15rpx;
				}
			}
		}
	}

	.contentHeader {
		display: flex;
		justify-content: space-between;

		font-size: 27rpx;

		&_right {
			border-radius: 10rpx;
			color: $uni-bg-color;
			padding: 10rpx 5rpx;
			background-color: $u-primary;
		}
	}

	.AImapping1 {
		width: 100%;
	}

	.svg-container {
		width: 100%;
		display: flex;
		justify-content: center;
		height: 600rpx;

		&_svg {
			width: 100%;
			height: 100%;
		}
	}

	.popupviewMain {
		display: flex;
		flex-direction: column;

		.popupview {
			display: flex;
			justify-content: center;
			width: 100%;
			padding: 20rpx;
		}
	}
</style>