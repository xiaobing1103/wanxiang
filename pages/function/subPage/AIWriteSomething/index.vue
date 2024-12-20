	<template>
		<z-paging ref="pagingRef" :pagingStyle="{ background: 'rgb(246, 247, 249)'}" :show-scrollbar=" false">
			<template #top>
				<CommonHeader defindTitle="AI智能写作" />
			</template>
			<view class="AIWriteSomething">
				<view class="AIWriteSomething_models">
					<view class="label">
						模型：
					</view>

					<view class="values">
						<up-radio-group v-model="radiovalue1">
							<up-radio :customStyle="{marginRight :'10px'}" v-for="(item, index) in valueList" :key="index"
								:label="item.name" :name="item.name" placement="row" shape="circle"></up-radio>
						</up-radio-group>
					</view>
				</view>
				<view class="AIWriteSomething_changeEngen">
					<view class="label">
						改写力度：
					</view>
					<view class="AIWriteSomething_changeEngen_values">
						<view class="AIWriteSomething_changeEngen_values_text">宽松</view>
						<view :style="{flex:'1'}">
							<ImageLoraScale v-model:sliderValue="sliderValue" :stepList="[1,2,3,4,5]" min='1' max='5'
								type="loraScale" />
						</view>

						<view class="AIWriteSomething_changeEngen_values_text">严格</view>
					</view>
					<up-alert fontSize="24rpx" type="warning"
						description="可选择不同档位的改写标准，档位越宽松，换的词越多，档位越严格，换的词就越少。"></up-alert>
				</view>
				<view class="AIWriteSomething_changeText">
					<view class="label">
						改写文本
					</view>
					<view class="values">
						<up-textarea height="200rpx" count maxlength="2000" v-model="textareaValue"
							:placeholder="placeholder"></up-textarea>
					</view>
				</view>
				<view class="AIWriteSomething_BtnGroup">
					<up-button :customStyle="{...btnStyles,background:'white',color:'#888',border:'1rpx solid #ccc'}"
						@click="clearResult">
						清空
					</up-button>
					<up-button :disabled="isRecive" :customStyle="btnStyles" @click="onFetchChat">
						立即生成
					</up-button>
				</view>
				<view class="AIWriteSomething_changeResult">
					<view class="overlabel">
						<view class="overlabel_left">
							改写结果：
						</view>
						<view v-if="calculateTextSimilarity !== 'NaN'" class="overlabel_right">
							相似度：{{calculateTextSimilarity}}%
						</view>
					</view>
					<view class="contents">
						<view class="contents_left">
							<text class="contents_left_top">显示修改对比：</text>
							<text class="contents_left_bottom">红色代表删除的文字，绿色代表新增加的文字</text>
						</view>
						<view class="contents_right">
							<up-switch @change="changeValues" v-model="switchValue"></up-switch>
						</view>
					</view>
					<view class="values">
						<view v-if='switchValue' class="diff-container">
							<template v-for="(item, index) in newResult" :key="index">
								<text :class="{ 'diff-delete': item[0] === -1, 'diff-insert': item[0] === 1 }">
									{{ item[1] }}
								</text>
							</template>
						</view>
						<up-textarea v-else height="200rpx" v-model="resultValue" placeholder=""></up-textarea>
					</view>
				</view>
				<view class="AIWriteSomething_BtnGroup">
					<up-button :customStyle="{...btnStyles,background:'white',color:'#888',border:'1rpx solid #ccc'}"
						@click="clearResult">
						一键复制
					</up-button>
					<up-button :disabled="isRecive" :customStyle="btnStyles" @click="fastCreta">
						标题生成
					</up-button>
					<up-button :disabled="isRecive" :customStyle="btnStyles" @click="createZhaiyao">
						摘要提取
					</up-button>
				</view>
			</view>
		</z-paging>
		<up-modal closeOnClickOverlay @close="titleCreateModel = false" :showConfirmButton="false" :show="titleCreateModel"
			title="标题生成">
			<view class="createTitleModal">
				<view v-if="!TiTleValues" class="createTitleModal_loading">
					正在生成标题...
				</view>
				<view class="createTitleModal_content">
					<template v-if="TitleArr.length >0">
						<template v-for="(items,index) in TitleArr" :key="index">
							<view class="TitleArr">
								<view class="TitleArr_number">{{index + 1}}</view>
								<view class="TitleArr_content">{{items}}</view>
								<view class="TitleArr_copy">
									<up-button :customStyle="{...btnStyles,height:'60rpx',fontSize:'24rpx'}"
										@click="copyText(items)">复制</up-button>
								</view>
							</view>
						</template>
					</template>
					<template v-else>
						<zero-markdown-view :markdown="TiTleValues" />
					</template>
				</view>
			</view>
		</up-modal>



		<up-modal closeOnClickOverlay @close="zhaiyaoModal = false" :showConfirmButton="false" :show="zhaiyaoModal"
			title="摘要提取">
			<view v-if="!zhaiyaoModalContent" class="createTitleModal_loading">
				正在生成摘要...
			</view>
			<view class="zhaiyaoModal">
				{{zhaiyaoModalContent}}
			</view>
		</up-modal>
	</template>

	<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	import { ref, reactive, computed } from 'vue';
	import ImageLoraScale from '../CommonComponents/ImageLoraScale.vue'
	import DiffMatchPatch from 'diff-match-patch';
	import { useChatStore } from '@/store';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { exportTxt, toCopyText } from '@/utils';
	const { streamRequest, isRecive ,streamSpark} = useStreamHooks()
	const radiovalue1 = ref('2.0模式')
	const switchValue = ref(false)
	const newResult = ref([])
	const resultValue = ref('')
	const TiTleValues = ref('')
	const TitleArr = ref([])
	const titleCreateModel = ref(false)
	const ChatStore = useChatStore()
	const zhaiyaoModal = ref(false)
	const zhaiyaoModalContent = ref('')

	const btnStyles = {
		width: '80%',
		height: '70rpx',
		border: '0rpx',
		background: 'rgb(41, 121, 255)',
		color: 'white',
		margin: ' 10rpx',
		borderRadius: '15rpx'
	}
	const placeholder = `1.输入文章.
2.点击'一键改写'
3.改写完成,点击一键复制.
`;

	const changeValues = () => {
		if (!textareaValue.value) {
			uni.$u.toast('请先生成结果！')
			switchValue.value = false
			return
		}
		const dmp = new DiffMatchPatch();
		newResult.value = dmp.diff_main(textareaValue.value, resultValue.value);
	}


	const textareaValue = ref('')
	const sliderValue = ref(3)
	const valueList = reactive([
		{
			name: '2.0模式',
			disabled: false,
		},
		{
			name: '4.0模式',
			disabled: false,
		}
	]);

	const fastCreta = () => {
		if (!resultValue.value) {
			uni.$u.toast('请先生成结果！')
			return
		}

		titleCreateModel.value = true
		TitleArr.value = []
		onFetchChat(resultValue.value, `你需要根据我给出的文本来取标题,至少五个标题,不要提供任何解释, 标题用##框起来, 像这样:
    ##三体入侵：地球文明面临前所未有的危机##
    ##宇宙舰队对决：地球与三体的生死较量##
    ##面壁计划启动：罗辑揭开三体真相##
    ##智慧博弈：破壁人与面壁人的较量##
    ##黑暗森林法则：罗辑威胁三体，建立战略平衡##
    `, 'titleValue')

	}

	const copyText = (content : string) => {
		toCopyText(content)
	}

	const onFetchChat = async (content ?: string, reprompt ?: string, type ?: string) => {
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		const prompt = reprompt ? reprompt : `你是一个文本优化者, 你需要根据用户提供的文本来润色又或是改写文本, 不过与底稿相似度要高于79%, 字数相差也不要超过20%, 请提供改写后的文本, 不要提供任何解释, 哪怕用户给出的文本有问题, 你也不要做任何解释和说明,不要改语序,不要改语序,不要改语序`
		const questions = [
			{
				role: 'user',
				content: content ? content : textareaValue.value
			}
		]
		const data = {
			params: JSON.stringify(questions),
			prompt,
		}

		if (type == 'zhaiyaoModalContent') {
			zhaiyaoModalContent.value = ''
		}
		if (type == 'titleValue') {
			TiTleValues.value = ''
		}
		if (!type) {
			resultValue.value = ''
		}
		let newStr = ''
		const streamOptions = {
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage: async (text : string) => {
				if (type == 'zhaiyaoModalContent') {
					newStr += text
					zhaiyaoModalContent.value  = await streamSpark(newStr)
				}
				if (type == 'titleValue') {
					newStr += text
					TiTleValues.value  = await streamSpark(newStr)
				}
				if (!type) {
				    newStr += text
					resultValue.value  = await streamSpark(newStr)
				}
			},
			onfinish() {
				console.log('成功')
				if (type == 'titleValue') {
					const regex = /##(.*?)##/g;
					const arr = TiTleValues.value.match(regex);
					const result = arr.map(item => item.slice(2, -2));
					TitleArr.value = result
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
		}
		streamRequest(streamOptions)
	}


	const calculateTextSimilarity = computed(() => {
		const diffentInstance = new DiffMatchPatch();
		const diffs : Diff[] = diffentInstance.diff_main(textareaValue.value, resultValue.value)
		diffentInstance.diff_cleanupSemantic(diffs)
		let totalLength = textareaValue.value.length + resultValue.value.length
		let editLength = 0
		diffs.forEach((diff) => {
			if (diff[0] !== 0) {
				// 0 表示没有差异
				editLength += diff[1].length
			}
		})
		// 计算相似度
		const similarity = (1 - editLength / totalLength) * 100

		return similarity.toFixed(2)
	})

	const createZhaiyao = () => {
		if (!resultValue.value) {
			uni.$u.toast('请先生成结果！')
			return
		}
		zhaiyaoModal.value = true
		onFetchChat(resultValue.value, `你需要帮我生成一个摘要，摘要内容为:根据业务分类，阿里影业的内容收入达到了12.2亿元人民币，相比去年减少了2.6亿元；票务与科技平台的收入为12.3亿元，较去年同期增长了7.1亿元；知识产权衍生品和其他业务的收入大约为6亿元，较上一年下降了0.2亿元。
`, 'zhaiyaoModalContent')
	}
	</script>

	<style lang="scss" scoped>
		.AIWriteSomething {
			padding: 40rpx 20rpx;

			&_models {}

			&_changeEngen {
				width: 100%;

				&_values {
					display: flex;
					width: 100%;
					padding: 20rpx 0;
					font-size: 27rpx;

					&_text {
						white-space: nowrap;
					}
				}

				&_desc {}
			}

			&_BtnGroup {
				display: flex;
				width: 100%;
			}
		}

		.label {

			font-weight: 800;
		}

		.overlabel {
			font-size: 31rpx;
			display: flex;
			justify-content: space-between;

			&_left {
				font-size: 31rpx;
			}

			&_right {
				font-size: 27rpx;
				color: $aichat-border-color;
			}
		}

		.values {
			padding: 20rpx 0;
		}

		.contents {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10rpx 0;

			&_left {
				display: flex;
				flex-direction: column;

				&_top {
					font-size: 27rpx;
				}

				&_bottom {
					font-size: 24rpx;
					color: #888;
				}
			}
		}


		.diff-container text {
			display: inline-block;
			margin: 2px;
			padding: 2px;
			font-size: 27rpx;
		}

		.diff-delete {
			text-decoration: line-through;
			background-color: #ffe6e6;
		}

		.diff-insert {
			text-decoration: underline;
			background-color: #e6ffe6;
		}

		.createTitleModal {
			&_content {
				display: flex;
				flex-direction: column;
			}
		}

		.TitleArr {
			display: flex;
			justify-content: center;

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
		}
	</style>