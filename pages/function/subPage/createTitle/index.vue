<template>
	<z-paging ref="pagingRef" :pagingStyle="{ background: 'rgb(246, 247, 249)',padding:'0 20rpx'}"
		:show-scrollbar="false">
		<template #top>
			<CommonHeader defindTitle="AI标题生成" />
		</template>

		<view class="createTitle">
			<view class="createTitle_items">
				<view class="label">
					内容：
				</view>
				<view class="values">
					<up-textarea maxlength="10000" v-model="msgContent" placeholder="请输入内容"></up-textarea>
				</view>
			</view>
			<view class="createTitle_items">
				<view class="label">
					结果预览：
				</view>
				<view class="values">
					<template v-if="result">
						<template v-if="TitleArr.length >0">
							<template v-for="(items,index) in TitleArr" :key="index">
								<view class="TitleArr">
									<view class="TitleArr_number">{{index + 1}}</view>
									<view class="TitleArr_content">{{items}}</view>
									<view class="TitleArr_copy">
										<up-button
											:customStyle="{...btnStyles,width:'100rpx', height:'50rpx',fontSize:'24rpx'}"
											@click="copyText(items)">复制</up-button>
									</view>
								</view>
							</template>
						</template>
						<template v-else>
							<zero-markdown-view :markdown="result" />
						</template>
					</template>
					<template v-else>
						<view class="noData">
							<image class="noData_image" :src="$assets.noData" mode=""></image>
						</view>
					</template>
				</view>
			</view>
		</view>
		<template #bottom>
			<view class="BtnGroup">
				<up-button @click="onFetchChat" :customStyle="btnStyles">立即生成</up-button>
			</view>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	import { reactive, ref, nextTick } from 'vue';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks'
	import { useChatStore } from '@/store';
	import { toCopyText } from '@/utils';
	const msgContent = ref('')
	const TitleArr = ref([])
	const pagingRef = ref(null)
	const result = ref('')
	const ChatStore = useChatStore()
	const { streamRequest, isRecive } = useStreamHooks()
	const { $assets } = useGlobalProperties()
	const btnStyles = {
		width: '80%',
		height: '70rpx',
		border: '0rpx',
		background: 'rgb(41, 121, 255)',
		color: 'white',
		margin: ' 10rpx',
		borderRadius: '15rpx'
	}
	const onScroolToBottom = () => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
		})
	}
	const copyText = (content : string) => {
		toCopyText(content)
	}
	const onFetchChat = async () => {
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		const prompt = `你需要根据我给出的文本来取标题,至少五个标题,不要提供任何解释, 标题用##框起来, 像这样:
    ##三体入侵：地球文明面临前所未有的危机##
    ##宇宙舰队对决：地球与三体的生死较量##
    ##面壁计划启动：罗辑揭开三体真相##
    ##智慧博弈：破壁人与面壁人的较量##
    ##黑暗森林法则：罗辑威胁三体，建立战略平衡##
    `
		const questions = [
			{
				role: 'user',
				content: msgContent.value
			}
		]
		const data = {
			params: JSON.stringify(questions),
			prompt,
		}
		result.value = ''
		const streamOptions = {
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage(text) {
				result.value += text
				onScroolToBottom()
			},
			onfinish() {
				console.log('成功')
				const regex = /##(.*?)##/g;
				const arr = result.value.match(regex);
				const resulta = arr.map(item => item.slice(2, -2));
				TitleArr.value = resulta
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
		streamRequest(streamOptions)
	}
</script>

<style lang="scss" scoped>
	.label {
		font-size: 28rpx;
		font-weight: 800;
	}

	.values {
		padding: 20rpx 0;
		font-size: 27rpx;
		height: 100%;
	}

	.BtnGroup {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.noData {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 400rpx;

		&_image {
			width: 100%;
			height: 400rpx;
			padding: 0rpx 0;
		}

	}

	.createTitle {
		padding: 30rpx 0;
	}

	.TitleArr {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 20rpx 0;

		&_number {
			margin-right: 5rpx;
			background-color: $aichat-border-color;
			border-radius: 50%;
			padding: 20rpx;
			width: 40rpx;
			height: 40rpx;
			display: flex;
			align-items: center;
			color: #fff;
			justify-content: center;
		}

		&_copy {
			flex: 1;
			display: flex;
			justify-content: flex-end;
		}
	}
</style>