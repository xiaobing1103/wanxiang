<template>
	<view class="SoraPrompt">
		<view class="restNums">
			<view class="restNums_box">
				<up-button @click="toVipPages"
					:customStyle="{background:'linear-gradient(to right, #314cd7, #ae1dfd)',width:'100%',height:'70rpx',borderRadius:'15rpx',color:'white'}">
					<image class="restNums_box_icon" :src="$assets.createVideoVipIcon" mode=""></image>
					<text :style="{marginRight:'10rpx'}">剩余次数</text>
					{{SoraPromptPramas.restNum}}
				</up-button>
				<text :style="{marginLeft:'20rpx'}">
					<up-icon @click="SoraPromptPramas.openModal = true" name="info-circle-fill"></up-icon>
				</text>
			</view>
		</view>
		<template v-if="currentPages">
			<view class="SoraPrompt_Input_uploadImages">
				<view class="SoraPrompt_Input_uploadImages_title">
					上传照片：
				</view>
				<view class="SoraPrompt_Input_uploadImages_uploadBox">
					<ChangeFaceUploadImage appuUseBase64 noUseCorpImage v-model:showupOverlay="showupOverlay"
						description="请上传自定义原图" v-model:images="SoraPromptPramas.image_url" :showAngle="true"
						:width="900" :height="800" />
				</view>
			</view>
		</template>
		<view class="SoraPrompt_Input">
			<view class="SoraPrompt_Input_title">
				灵感描述：
			</view>
			<view class="SoraPrompt_Input_content">
				<up-textarea :customStyle="{border:'1rpx solid #ccc',margin:'20rpx 0'}" height="300rpx"
					v-model="SoraPromptPramas.prompt" placeholder="请用文字描述你的创意想法:如一只柴犬坐在椅子上看着书,一边喝下午茶" count
					maxlength="1000"></up-textarea>
			</view>
			<view class="SoraPrompt_Input_prompt">
				<up-checkbox v-if="!currentPages" :customStyle="{marginBottom: '8px'}" label="是否开启描述词自动优化" name="agree"
					usedAlone v-model:checked="SoraPromptPramas.aloneChecked">
				</up-checkbox>
				<view v-else class="SoraPrompt_Input_prompt_text" @click="onfetchChat">
					帮我想一条 <up-icon :style="{marginLeft:'10rpx'}" name="reload" size="18"></up-icon>
				</view>
			</view>
		</view>
		<template v-if="!currentPages">
			<view class="SoraPrompt_Tags">
				<template v-for="(items,index) in videoword" :key="index">
					<view
						:style="{background:items.key == currentKey? 'linear-gradient(to right, #314cd7, #ae1dfd)' :'',color:items.key == currentKey? 'white' :''}"
						class="SoraPrompt_Tags_items" @click="seletedItems(items)">
						{{items.key}}
					</view>
				</template>
			</view>
		</template>
		<view class="SoraPrompt_ling">
			<view class="SoraPrompt_ling_title">
				创意灵感：
			</view>
			<view class="SoraPrompt_ling_items">
				<template v-for="(items,index) in exampleData" :key="index">
					<view class="SoraPrompt_ling_items_content">
						<image @click="OpenVideo(items.playUrl)" class="SoraPrompt_ling_items_content_image"
							:src="items.url" mode="">
						</image>
						<view class="SoraPrompt_ling_items_content_desc">
							{{items.text}}
						</view>
						<up-button
							:customStyle="{background:'#09e0ab',height:'60rpx',width:'60%',border:'none',borderRadius: '50rpx',marginBottom:'20rpx',color:'white'}"
							@click="createSame(items.text)">
							创作同款
						</up-button>
					</view>
				</template>
			</view>
		</view>
	</view>
	<!-- #ifdef APP -->
	<ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore"
		@onFinish="finishCore" />
	<!-- #endif -->
</template>

<script setup lang="ts">
	// #ifdef APP
	import ChatSSEClient from "@/components/gao-ChatSSEClient/gao-ChatSSEClient.vue";
	// #endif
	import ChangeFaceUploadImage from '../../ChangeFaceUploadImage.vue'
	import { ref } from 'vue';
	import { videoword, exampleData, VideoVmodalType, imgword } from './datas';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useStreamHooks } from '@/hooks/useStreamHooks'
	import { useChatStore } from '@/store';
	const { streamRequest, isRecive, streamSpark
		// #ifdef APP
		, openCore, errorCore, messageCore, finishCore, chatSSEClientRef
		// #endif
	} = useStreamHooks()
	const props = defineProps<{ currentPages : number }>()
	const currentKey = ref('')
	const ChatStore = useChatStore()
	const SoraPromptPramas = defineModel<VideoVmodalType>('SoraPromptPramas')
	const { $assets } = useGlobalProperties()
	const showupOverlay = ref(false)

	const toVipPages = () => {
		uni.navigateTo({
			url: "/pages/function/subPage/VideoVip/index"
		})
	}
	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	const OpenVideo = async (url : string) => {
		// SoraPromptPramas.value.playVideo = url
		// SoraPromptPramas.value.isQuery = false
		// SoraPromptPramas.value.showVideo = true
		// 文字生图模式

		uni.navigateTo({
			url: '/pages/function/subPage/TextCreateVideo/PlayVideo/index?url=' + url
		})
	}
	const seletedItems = ({ key, prompt }) => {
		currentKey.value = key
		SoraPromptPramas.value.prompt = prompt
		uni.$u.toast('设置灵感描述词成功！')
	}

	const createSame = (showText : string) => {
		SoraPromptPramas.value.prompt = showText
		uni.$u.toast('设置灵感描述词成功！')
	}
	function getRandomElement(arr) {
		const index = Math.floor(Math.random() * arr.length);
		return arr[index];
	}
	const onfetchChat = () => {
		if (!SoraPromptPramas.value.prompt) {
			SoraPromptPramas.value.prompt = getRandomElement(imgword).key
		}
		const prompt = '不要超过200字得描述,纯文本格式'
		const questions = [
			{
				role: 'user',
				content: SoraPromptPramas.value.prompt

			}
		]
		const data = {
			params: JSON.stringify(questions),
			prompt
		}
		SoraPromptPramas.value.prompt = ''
		let newStr = ''
		const streamOptions = {
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage: async (text : string) => {
				console.log(text)
				newStr += text
				SoraPromptPramas.value.prompt = await streamSpark(newStr)
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
			checkNumsType: 'fun'
		}
		streamRequest(streamOptions)
	}
</script>

<style lang="scss" scoped>
	.SoraPrompt {
		&_Input {
			&_content {}

			&_prompt {
				display: flex;
				justify-content: flex-end;

				&_text {
					display: flex;
					align-items: center;
					color: #888;
				}
			}
		}

		&_Tags {
			display: flex;
			flex-wrap: wrap;
			gap: 15rpx;

			&_items {
				padding: 10rpx 20rpx;
				font-size: 27rpx;
				border-radius: 25rpx;
				background-color: #cbf1e6;
				color: $aichat-border-color;
			}
		}

		&_ling {
			display: flex;
			flex-direction: column;
			padding: 20rpx 0;

			&_title {
				padding-bottom: 20rpx;
			}

			&_items {
				display: grid;
				grid-template-columns: 1fr 1fr;

				&_content {
					display: flex;
					flex-direction: column;
					align-items: center;

					&_image {

						height: 200rpx;
						width: 300rpx;
						border-radius: 20rpx;
					}

					&_desc {
						font-size: 27rpx;
						color: #777;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						width: 300rpx;
						padding: 20rpx 0;
					}
				}

			}
		}
	}

	.restNums {
		width: 100%;
		display: flex;
		justify-content: flex-end;

		&_box {
			display: flex;
			justify-content: flex-end;
			align-items: center;

			&_icon {
				width: 40rpx;
				height: 40rpx;
				margin: 0 20rpx;
			}
		}
	}
</style>