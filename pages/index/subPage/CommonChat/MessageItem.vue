<template>
	<view class="markdown">
		<view v-if="ChatStore.model =='echarts'">
			<view v-if="hasUchatsBlock">
				<view class="downImages">
					<up-icon @click="downloadImages" name="download" size="20"></up-icon>
				</view>
				<qiun-data-charts ref="chartsRef" @complete="getcharts" @getImage="getim" inScrollView canvas2d
					:type="props.uType || 'line'" :chartData="chartData" />
			</view>
			<template v-else>
				{{msgContent}}
			</template>
		</view>
		<view v-else>
			<zero-markdown-view :markdown="msgContent" />
		</view>
	</view>
</template>

<script setup lang="ts">
	import qiunDataCharts from '../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue'
	import { computed, ref, } from 'vue';
	import { useChatStore } from '@/store';
	import { saveImage } from '@/utils/saveImages';
	import { downloadReport } from '@/utils';
	const props = defineProps<{ content : string, uType ?: string }>()
	const chartData = ref({})
	const ChatStore = useChatStore()
	const hasUchatsBlock = ref(false);
	const chartsRef = ref(null)
	function parseToJsonObject(str) {
		const validJsonStr = str.replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":');
		try {
			const jsonObj = JSON.parse(validJsonStr);
			return jsonObj;
		} catch (error) {
			uni.$u.toast('JSON 解析失败')
			return 'JSON 解析失败'
		}
	}
	const getcharts = (w) => {
		console.log(w)
	}
	const getim = (parmas) => {
		console.log(parmas)
		// #ifdef H5
		saveImage(parmas.base64)
		// #endif
		// #ifdef MP-WEIXIN
		downloadReport(parmas.base64)
		// #endif
	}
	const msgContent = computed(() => {
		const { content } = props;
		if (ChatStore.model == 'echarts') {
			const uchartsJsonBlockRegex = /```(uCharts|json)\s*\n([\s\S]*?)\n```/;
			const match = content.match(uchartsJsonBlockRegex);
			if (match) {
				hasUchatsBlock.value = true;
				const jsonObject = parseToJsonObject(match[2])
				console.log(jsonObject);
				getServerData(jsonObject);
			} else {
				hasUchatsBlock.value = false;
			}
			return content;
		} else {
			let htmlString = '';
			if (content?.split("```").length % 2) {
				let messages = content;
				if (messages[messages.length - 1] != "\n") {
					messages += "\n";
				}
				htmlString = messages;
			} else {
				htmlString = content;
			}

			return htmlString;
		}
	});

	const getServerData = (datas : any) => {
		setTimeout(() => {
			chartData.value = JSON.parse(JSON.stringify(datas));
		}, 500);
	}

	const downloadImages = async () => {
		if (chartsRef.value) {
			chartsRef.value?.getImage()
		}
	}
</script>

<style lang="scss">
	.markdown {
		width: 100%;
	}

	.charts-box {
		width: 100%;
		height: 300px;
	}

	.downImages {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		font-size: 25rpx;
	}
</style>