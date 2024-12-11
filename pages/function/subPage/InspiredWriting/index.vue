<template>
	<z-paging ref="pagingRef" :pagingStyle="{ background: 'rgb(246, 247, 249)',padding:'0 20rpx'}"
		:show-scrollbar="false">
		<template #top>
			<CommonHeader defindTitle="AI灵感写作" />
		</template>
		<view class="InspiredWriting">
			<view class="InspiredWriting_items">
				<view class="label">
					关键词：
				</view>
				<view class="values">
					<up-textarea height="200rpx" maxlength="2000" v-model="keyValue" placeholder="请输入关键词"></up-textarea>
				</view>
			</view>
			<view class="InspiredWriting_items">
				<view class="label">
					过滤关键词：
				</view>
				<view class="values">
					<up-textarea height="200rpx" maxlength="2000" v-model="filterKeyValue"
						placeholder="例如:智能改写,AI配音(含有这些过滤词的段落就不会出现,每个关键词用英文逗号,隔开)"></up-textarea>
				</view>
			</view>
			<view class="InspiredWriting_items">
				<view class="label">
					生成方案：
				</view>
				<view class="values">
					<up-radio-group v-model="radiovalue1">
						<up-radio :customStyle="{marginRight :'10px'}" v-for="(item, index) in valueList" :key="index"
							:label="item.name" :name="item.name" placement="row" shape="circle"></up-radio>
					</up-radio-group>
				</view>
			</view>
			<view class="InspiredWriting_items">
				<up-alert :show-icon="true" type="warning" description="优选：系统推荐的锻炼组合
多样化：生成不同类型的段落"></up-alert>
			</view>
		</view>
		<view class="BtnGroup">
			<up-button
				:customStyle="{...btnStyles,background:'white',color:'#888',border:'1rpx solid #ccc'}">一键重置</up-button>
			<up-button :disabled="isRecive" @click="onFetchChat" :customStyle="btnStyles">一键生成</up-button>
		</view>

		<view class="InspiredWriting_items">
			<view class="label">
				生成结果：
			</view>
			<view class="values">
				<template v-if="resultList.length> 0">
					<view class="resultList">
						<view class="resultList_items" v-for="(items,index) in resultList" :key="index">
							<view class="resultList_items_content">
								<template v-if="items.showText">
									<up-textarea maxlength="10000" v-model="items.content"
										placeholder="请输入内容"></up-textarea>
								</template>
								<text v-else>{{items.content}}</text>
							</view>
							<view class="resultList_items_btnBox">
								<up-icon @click="items.showText = !items.showText" :customStyle="iconsStyles"
									name="edit-pen"></up-icon>
								<up-icon @click="swapElements(resultList,index,'prev')"
									:customStyle="{...iconsStyles,transform: 'rotate(-90deg)'}"
									name="play-right-fill"></up-icon>
								<up-icon @click="swapElements(resultList,index,'next')"
									:customStyle="{...iconsStyles,transform: 'rotate(-90deg)'}"
									name="play-left-fill"></up-icon>
								<up-icon @click="copyTxt(items.content)" :customStyle="iconsStyles"
									name="file-text"></up-icon>
								<up-icon @click="deletedItems(index)" :customStyle="iconsStyles" name="trash"></up-icon>
							</view>
						</view>
					</view>
				</template>
				<template v-else>
					<zero-markdown-view :markdown="result" />
				</template>
			</view>
		</view>
		<view class="BtnGroup" v-if="result">
			<up-button @click="copyTxt(result)"
				:customStyle="{...btnStyles,background:'white',color:'#888',border:'1rpx solid #ccc'}">一键复制</up-button>
			<up-button @click="showAllTextEdit = true" :disabled="isRecive" :customStyle="btnStyles">全文编辑</up-button>
		</view>
		<view v-else class="noData">
			<image class="noData_image" :src="$assets.noData" mode=""></image>
		</view>
		<template #bottom>

		</template>
	</z-paging>
	<up-modal showCancelButton @cancel="showAllTextEdit = false" @confirm="confirmModal" cancelText="取消"
		confirmText="一键复制" width="700rpx" :show="showAllTextEdit">
		<view class="allmodal">
			<up-alert :show-icon="true" type="warning" description="全文编辑不会影响分段编辑!"></up-alert>
			<up-textarea height="400rpx" maxlength="-1" v-model="result" />
		</view>
	</up-modal>
	<up-modal showCancelButton :show="deleteModal" @cancel="deleteModal = false" @confirm="deleteContent" title="删除此段"
		content="你是否需要删除此段内容,删除后无法复原!"></up-modal>
</template>

<script setup lang="ts">
	import { reactive, ref, nextTick } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks'
	import { exportTxt, toCopyText } from '@/utils';
	import { useChatStore } from '@/store';
	const { $assets } = useGlobalProperties()
	const ChatStore = useChatStore()
	const deleteModal = ref(false)
	const pagingRef = ref(null)
	const { streamRequest, isRecive } = useStreamHooks()
	const radiovalue1 = ref('优选')
	const showAllTextEdit = ref(false)
	const iconsStyles = {
		margin: '0 10rpx',
		background: 'white',
		borderRadius: '10rpx',
		padding: '10rpx',
		margin: '15rpx'
	}
	const btnStyles = {
		width: '80%',
		height: '70rpx',
		border: '0rpx',
		background: 'rgb(41, 121, 255)',
		color: 'white',
		margin: ' 10rpx',
		borderRadius: '15rpx'
	}
	const valueList = reactive([
		{
			name: '优选',
			disabled: false,
		},
		{
			name: '多样化',
			disabled: false,
		}
	]);
	const deleteContent = () => {
		resultList.value = resultList.value.filter((items, index) => index !== seletedIndex.value)
		deleteModal.value = false
		uni.$u.toast('删除成功！')
	}
	const deletedItems = (key : any) => {
		seletedIndex.value = key
		deleteModal.value = true
	}
	const keyValue = ref('')
	const filterKeyValue = ref('')
	const result = ref('')

	const seletedIndex = ref(0)
	const resultList = ref([])
	const onScroolToBottom = () => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
		})
	}

	const swapElements = (arr : any[], index : number, type : 'prev' | 'next') => {
		if (index == 0 && type == 'prev') {
			uni.$u.toast('已经到头了！')
			return;
		}
		if (index == arr.length - 1 && type == 'next') {
			uni.$u.toast('已经到头了！')
			return;
		}
		if (type === 'prev') {
			const temp = arr[index];
			arr[index] = arr[index - 1];
			arr[index - 1] = temp;
		}
		if (type === 'next') {
			const temp = arr[index];
			arr[index] = arr[index + 1];
			arr[index + 1] = temp;
		}

	}

	const copyTxt = (txt : string) => {
		toCopyText(txt)
	}
	const onFetchChat = async () => {
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		const prompt = `你是一个文章写手, 你要根据我提供的关键词来按顺序生成段落,一个关键词匹配一段,最少生成三段 ,并且段落中不要出现我提供的过滤关键词, 我提供的关键词和过滤关键词都是用 ## 隔开的, 最后生成一篇完整的文章`
		const questions = [
			{
				role: 'user',
				content: `关键词：${keyValue.value}。过滤关键词：${filterKeyValue.value}`
			}
		]
		const data = {
			params: JSON.stringify(questions),
			prompt,
		}
		resultList.value = []
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
				const arr = result.value.split(/\n\n/);
				arr.forEach((items, index) => {
					const newItems = reactive({
						content: items,
						showText: false
					})
					resultList.value.push(newItems);
				})
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

	const confirmModal = () => {
		copyTxt(result.value)
	}
</script>

<style scoped lang="scss">
	.label {
		font-size: 28rpx;
		font-weight: 800;
	}

	.values {
		padding: 20rpx 0;
		font-size: 27rpx;
	}

	.BtnGroup {
		display: flex;
		width: 100%;
	}

	.InspiredWriting {
		padding: 30rpx 0;
	}

	.resultList {
		&_items {
			// background-color: red;
			padding: 30rpx 0;

			&_btnBox {
				display: flex;
				justify-content: flex-end;
				background-color: #ccc;
				border-radius: 10rpx;

			}
		}
	}

	.allmodal {
		display: flex;
		width: 100%;
		flex-direction: column;
	}

	:deep(.u-modal__title) {
		padding-top: 15rpx;
	}

	:deep(.u-modal__content) {
		padding: 15rpx;
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
			padding: 50rpx 0;
		}

	}
</style>