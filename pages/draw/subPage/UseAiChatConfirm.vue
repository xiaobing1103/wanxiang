<template>
	<up-checkbox shape="circle" :customStyle="{margin: '20rpx 0' ,fontSize:'25rpx'}" name="agree" usedAlone
		v-model:checked="aloneChecked" @change="change">
		<template #label>
			<view class="aichatPromet">
				<text class="aichatPromet_top">使用AiChat优化你的提示词</text>
				<text class="aichatPromet_bottom">提示：有助于生成精准的绘画指令以及画面光影、画面比例、美感等</text>
			</view>
		</template>
	</up-checkbox>
	<up-modal :show="aloneChecked" showCancelButton closeOnClickOverlay @close="onclose" @cancel="onclose"
		@confirm="confirm">
		<view class="checkbox_modal">
			<view class="checkbox_modal_header">
				提示
			</view>
			<view class="checkbox_modal_content">
				使用AI优化功能后会占用你的AiChat3.5的问答次数，优化一次会扣掉一次问答次数,请知悉！
			</view>
		</view>

	</up-modal>
</template>
<script setup lang="ts">
	import {
		useStreamHooks
	} from '@/hooks/useStreamHooks';

	import {
		nextTick,
		ref
	} from 'vue'
	import { useChatStore } from '@/store';
	const ChatStore = useChatStore()
	const aloneChecked = ref(false)
	const msgContent = ref('')
	const parmas = defineModel('parmas')
	const {
		streamRequest,
		onCancelRequest,
		isRecive,
		streamSpark
	} = useStreamHooks();
	const change = (e) => {
		if (e) {
			aloneChecked.value = true
		} else {
			aloneChecked.value = false
		}
	}
	const confirm = () => {
		console.log('点击了确认')
		onclose()
		onFetchChat(parmas.value.prompt)
	}
	const onclose = () => {
		aloneChecked.value = false
	}




	const onFetchChat = async (content ?: string) => {
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		const prompt = `你现在作为一个prompt提示词转换器，请你将我的文字转换为Stable Diffusion能识别的特殊提示词 我的文字内容为 ${content},你只需要输出关键词，全部以字符串格式输出，不要带{}`
		const questions = [{
			role: 'user',
			content
		}]

		const data = {
			params: JSON.stringify(questions),
			prompt,
		}
		parmas.value.prompt = ''
		let newStr = ''
		const streamOptions = {
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage: async (text:string) => {
				newStr += text
				parmas.value.prompt = await streamSpark(newStr)
			},
			onfinish() {
				console.log('成功')
				onclose()
			},
			onerror(err) {
				if (err.includes('请升级会员')) {
					ChatStore.setShowLevelUpVipContent(err)
					ChatStore.setShowlevelUpVip(true)
				}
				console.log(err, "错误")
				onclose()
			},
			checkNumsType: 'chat'
		}
		streamRequest(streamOptions)
	}
</script>

<style lang="scss">
	.checkbox_modal {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 25rpx;
		box-sizing: border-box;

		&_header {
			padding: 25rpx;
			font-weight: 600;
		}

		&_content {
			font-size: 27rpx;
		}
	}

	.aichatPromet {
		display: flex;
		flex-direction: column;

		&_top {
			font-size: 27rpx;
			font-weight: 700;
		}

		&_bottom {
			font-size: 20rpx;
			color: $uni-color-title;
		}
	}
</style>