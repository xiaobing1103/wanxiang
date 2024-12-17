<template>
	<z-paging :scroll-with-animation="true" :show-scrollbar="false" ref="pagingRef" :pagingStyle="{padding:'24rpx'}">
		<template #top>
			<CommonHeader defindTitle="AI应用页面" />
		</template>
		<view class="SingleApplication">
			<view class="SingleApplication_title">
				<view class="SingleApplication_title_name">
					{{detailData?.name}}
				</view>
				<view @click="setExample" class="SingleApplication_title_example">
					插入示例
				</view>
			</view>

			<template v-if="state">
				<template v-for="(items,index) in state" :key="index">
					<template v-if="items?.name == 'WidgetInput'">
						<view class="label">
							<text v-if="items?.isRequired" :style="{color:'#ff5c85'}">*</text> {{items?.title}}
						</view>
						<template v-if="items">
							<view class="WidgetTextarea">
								<up-input v-model="items.modelValue" :placeholder="items.placeholder"
									:maxlength="items.maxlength" />
							</view>
						</template>
					</template>
					<template v-if="items?.name == 'WidgetTextarea'">
						<view class="label">
							<text v-if="items?.isRequired" :style="{color:'#ff5c85'}">*</text> {{items?.title}}
						</view>
						<view class="WidgetTextarea">
							<template v-if="items">
								<up-textarea v-model="items.modelValue" :height="items.rows * 20"
									:autoHeight="items.autoHeight" count :placeholder="items.placeholder"
									:maxlength="items.maxlength"></up-textarea>
							</template>
						</view>
					</template>

					<template v-if="items?.name == 'WidgetCheckbox'">
						<view class="label">
							<text v-if="items?.isRequired" :style="{color:'#ff5c85'}">*</text> {{items?.title}}
						</view>
						<view class="options">
							<template v-for="(item,arrIndex) in items.options" :key="arrIndex">
								<view
									:style="{color:items.modelValue.includes(item)? '#ff5c85':'',border: items.modelValue.includes(item)?'1rpx solid #ff5c85':''}"
									class="optionsItems" @click="selectedItems(item,index) ">
									{{item}}
								</view>
							</template>
						</view>

					</template>
					<template v-if="items?.name == 'WidgetRadio'">
						<view class="label">
							<text v-if="items?.isRequired" :style="{color:'#ff5c85'}">*</text> {{items?.title}}
						</view>
						<view class="options">
							<template v-for="(item,arrIndex) in items.options" :key="arrIndex">
								<view
									:style="{color:items.modelValue === item ? '#ff5c85':'',border: items.modelValue === item?'1rpx solid #ff5c85':''}"
									class="optionsItems" @click="state[index].modelValue = item">
									{{item}}
								</view>
							</template>
						</view>

					</template>

				</template>
			</template>
			<view class="result">
				<view class="result_title">
					<view class="result_title_create">
						创作结果
					</view>
					<view class="result_title_all" @click="clearMes">
						清除所有
					</view>
				</view>
				<template v-if="descInput">
					<view class="content">
						<zero-markdown-view :markdown="descInput" />
					</view>

				</template>
				<template v-else>
					<view class="nodata">
						<image class="nodata_image" :src="$assets.NoApplicationsData" mode=""></image>
						<view class="nodata_title">
							AI创作结果会在显示这里，现在你只需要
						</view>
						<view class="nodata_desc1">
							1. 在左侧填好必要的信息，填写越详细，结果越准确哦
						</view>
						<view class="nodata_desc2">
							2.点击立即生成按钮，静待AI妙笔生花，一般在10秒内搞定
						</view>
					</view>
				</template>
			</view>
		</view>
		<template #bottom>
			<view class="btnGroup">
				<up-button :disabled="isRecive" :customStyle="bthStyles" @click="OnfetchChat">立即生成</up-button>
				<up-button :disabled="isRecive" :customStyle="bthStyles" @click="oncopyText">复制内容</up-button>
			</view>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import { onMounted, reactive, ref, nextTick } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import { useStreamHooks } from '@/hooks/useStreamHooks'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { DetailDTO, DetailFormDTO, stateFromDTO } from './type';
	import { useChatStore } from '@/store';
	import { toCopyText } from '@/utils';
	const { $api, $assets } = useGlobalProperties()
	const detailData = ref<DetailDTO | null>(null)
	const state = reactive<Record<string, stateFromDTO>>({})
	const ChatStore = useChatStore()
	const pagingRef = ref(null)
	const descInput = ref('')
	const { isRecive, streamRequest } = useStreamHooks()
	const bthStyles = {
		height: '67rpx',
		border: '0',
		width: '50%',
		margin: '0 20rpx',
		borderRadius: '50rpx',
		background: '#ff5c85',
		color: 'white'
	}
	onLoad(async (query) => {
		if (query.id) {
			await getDetail(query.id)
		}
	})
	const onScroolToBottom = () => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
		})
	}
	const getDetail = async (id : string) => {
		const DetailReq : { data : DetailDTO, code : number } = await $api.get('api/v1/nika/detail?id=' + id)
		if (DetailReq.code == 1) {
			detailData.value = DetailReq.data
			if (DetailReq.data.form) {
				createReactiveData(DetailReq.data.form)
			}
		}
	}

	const createReactiveData = (dataArr : DetailFormDTO[]) => {
		dataArr.forEach((item, index) => {
			if (item.name === 'WidgetInput' || item.name === 'WidgetTextarea' || item.name == 'WidgetCheckbox' || item.name == 'WidgetRadio') {
				let modelValue = null
				if (item.name === 'WidgetInput' || item.name === 'WidgetTextarea' || item.name === 'WidgetRadio') {
					modelValue = item.props.defaultValue || ''
				}
				if (item.name == 'WidgetCheckbox') {
					modelValue = item.props.defaultValue || []
				}
				const key = item.id;
				state[key] = reactive({
					...item?.props,
					name: item.name,
					modelValue
				});
			}

		});
	}

	const setExample = () => {
		for (const key in state) {
			if (state[key].name !== 'WidgetRadio') {
				if (typeof state[key].modelValue == 'string') {
					state[key].modelValue = state[key].placeholder
				}
			}
		}
	}


	const clearMes = () => {
		descInput.value = '';
		uni.$u.toast('清除成功！')
	}
	const selectedItems = (item : string, key : string) => {
		if (state[key] && Array.isArray(state[key].modelValue)) {
			if (state[key].modelValue.includes(item)) {
				state[key].modelValue = state[key].modelValue.filter((fl) => fl !== item);
			} else {
				state[key].modelValue.push(item);
			}
		}
	};
	const replacePlaceholders = (str : string, obj : Record<string, any>) => {
		return str.replace(/\$\{([^\}]+)\}/g, (match, key) => {
			return obj[key] || '';
		});
	}

	const getObjKeys = (str : string) => {
		const regex = /\$\{([^\}]+)\}/g;
		let obj = {};
		let match : (string | number)[];
		while ((match = regex.exec(str)) !== null) {
			obj[match[1]] = null;
		}
		return obj
	}

	const OnfetchChat = async () => {
		const obj = getObjKeys(detailData.value.content)
		let flag = false
		for (const key in obj) {
			if (Array.isArray(state[key].modelValue)) {
				obj[key] = state[key].modelValue.toString()
			} else {
				obj[key] = state[key].modelValue
			}
		}

		for (const isFlagKeys in state) {
			if (state[isFlagKeys].isRequired && state[isFlagKeys].modelValue.length <= 0) {
				uni.$u.toast('请填写必填项！')
				return
			}
		}

		const content = replacePlaceholders(detailData.value.content, obj)
		const questions = [
			{
				role: 'user',
				content: content
			}
		]

		const data = {
			params: JSON.stringify(questions),
			prompt: null,
		}
		descInput.value = ''
		const streamOptions = {
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage(text) {
				console.log(text)
				descInput.value += text
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
			checkNumsType: 'fun_mapping'
		}
		streamRequest(streamOptions)
	}

	const oncopyText = () => {
		toCopyText(descInput.value)
	}
</script>

<style lang="scss" scoped>
	.SingleApplication {
		&_title {
			display: flex;
			justify-content: space-between;

			&_name {
				font-size: 30rpx;
			}

			&_example {
				color: red;
			}
		}
	}

	.result {}

	.WidgetTextarea {
		margin-top: 10rpx;
		margin-bottom: 30rpx;
		border: 1rpx solid #ccc;
		border-radius: 10rpx;
	}

	.label {
		padding-top: 50rpx;
	}

	.options {
		display: flex;
		flex-wrap: wrap;
	}

	.optionsItems {
		padding: 10rpx;
		margin: 15rpx;
		border-radius: 10rpx;
		font-size: 25rpx;
		border: 1rpx solid #ccc;

	}

	.nodata {
		font-size: 27rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		border: 1rpx solid #ccc;
		border-radius: 20rpx;

		&_image {
			height: 500rpx;
			width: 80%;
		}
	}

	.result {

		&_title {
			display: flex;
			align-items: center;
			justify-content: space-between;

			&_create {
				font-size: 35rpx;
				font-weight: 800;
				padding: 20rpx 0;
			}

			&_all {
				font-size: 25rpx;
				font-weight: 800;
				padding: 20rpx 0;
				color: #ff5c85;

			}
		}
	}

	.nodata {
		font-size: 27rpx;

		&_title {
			font-weight: 800;
		}

		&_desc1 {
			font-size: 24rpx;
			width: 100%;
			justify-content: flex-start;
			padding: 20rpx;
			color: #ccc;
		}

		&_desc2 {
			width: 100%;
			font-size: 24rpx;
			justify-content: flex-start;
			padding: 20rpx;
			color: #ccc;
		}
	}

	.content {
		font-size: 27rpx;
		border: 1rpx solid #ccc;
		border-radius: 20rpx;
		padding: 20rpx;

	}

	.btnGroup {
		display: flex;
	}
</style>