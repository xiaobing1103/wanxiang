<template>
	<z-paging ref="pagingRef" :pagingStyle="{padding:'24rpx'}">
		<template #top>
			<CommonHeader defindTitle="公文写作" />
		</template>
		<view class="ppt-con">
			<view class="create-type">
				<view class="create-type_title">
					公文写作是机关最重要的工作之一。公文是传达政令的重要工具，是实施决策和指导工作的重要载体，AI能够在此基础上提供一定的帮助，但也不能作为最终成果发布。因此，该功能我们会上线测试版本，如果反映良好，我们会保留该功能持续更新，反映不好，我们仍然会下架该功能。本模型功能基础实现为调用文心一言核心数据与功能，模型生成算法已备案。
				</view>
				<view class="create-type_header">
					公文写作书写要求：
				</view>
				<view class="input-box">
					<textarea :style="{fontSize:'30rpx',width:'100%'}" class="input-box_textarea" auto-height
						v-model="inputValue" maxlength='-1'
						placeholder="请输入您想要输出的公文主题 例:XX小区电动车停放不规范,需要做出书面整改,请草拟一份关于XX小区电动车停放不规范的书面通知."></textarea>
				</view>
				<view class="create-type_header">
					公文书写参考材料:（可不填）
				</view>
				<view class="input-box">
					<textarea :style="{fontSize:'30rpx',width:'100%'}" class="input-box_textarea" auto-height
						v-model="inputValue2" maxlength='-1'
						placeholder="例如一些规定、一些材料中的要求 如：电动车不可停放于一楼大厅门口，造成堵塞"></textarea>
				</view>
				<view class="create-type_header">
					公文输出结果：
				</view>
				<view class="input-outBox">
					<MessageItem :content="contentStr" />
				</view>

			</view>
		</view>
		<template #bottom>
			<view class="btn">
				<u-button :customStyle="{height:'60rpx', borderRadius:'25rpx',width:'80%'}" class="bth_content"
					:disabled="isRecive" @click="onCreateContent" type="primary">开始写公文</u-button>
			</view>

			<view class="btn">
				<u-button :customStyle="{height:'60rpx', borderRadius:'25rpx',width:'80%'}" class="bth_content"
					:disabled="isRecive" @click="exportFile">导出txt</u-button>
			</view>

		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import { ref, nextTick } from 'vue'
	import CommonHeader from '@/components/CommonHeader.vue'
	import { useStreamHooks } from '@/hooks/useStreamHooks'
	import MessageItem from '@/components/CommonChat/MessageItem.vue';
	import { debounce, exportTxt } from '@/utils';
	import { useGlobalProperties } from '../../../../hooks/useGlobalHooks';
	import { useChatStore } from '@/store';
	const { $api } = useGlobalProperties()
	const inputValue = ref('')
	const inputValue2 = ref('')
	const contentStr = ref(`例子： 根据您提供的信息，以下是一篇关于小区停放电动车的公文样本。请注意，具体公文内容需要根据实际情况和单位要求进行适当调整。

---

**[单位名称]**

**关于规范小区电动车停放管理的通知**

**[文号]**

**[发文日期]**

各位业主/住户：

为加强小区安全管理，维护公共秩序，保障业主/住户的生命财产安全，现就小区电动车停放管理事宜通知如下：`)

	const ChatStore = useChatStore();
	const exportFile = () => {
		if (contentStr.value) {
			exportTxt(contentStr.value);
		}
	}

	const { streamRequest, isRecive, streamSpark } = useStreamHooks()
	const pagingRef = ref(null)
	const onScroolToBottom = () => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
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
				content: `${inputValue.value},补充资料：${inputValue2.value}`
			}
		]
		const data = {
			params: JSON.stringify(params),
			type: "Web-AI写作助手",
			prompt: '你是一位熟悉公文写作的作家，包括生活、政府机关、企事业单位、学术界、法律领域、外交交往、单位，你会根据材料写一篇公文。'

		}
		contentStr.value = ''
		let newStr = ''
		streamRequest({
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage: async (text : string) => {
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
			checkNumsType: 'fun_article_correction'
		})
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
					min-height: 200rpx;
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
</style>