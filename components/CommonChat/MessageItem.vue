<template>
	<view class="markdown">
		<view v-if="ChatStore.model =='echarts'">
			<view v-if="hasUchatsBlock">
				<qiun-data-charts :type="props.uType || 'line'" :chartData="chartData" />
			</view>
			<template v-else>
				{{msgContent}}
			</template>
		</view>
		<view v-else>
			<zero-markdown-view :markdown="msgContent"></zero-markdown-view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { computed, ref } from 'vue';
	import { useChatStore } from '@/store';
	const props = defineProps<{ content : string, uType : string }>()
	const chartData = ref({})
	const ChatStore = useChatStore()
	const hasUchatsBlock = ref(false);
	function parseToJsonObject(str) {
		// 将所有的键名用双引号括起来
		const validJsonStr = str.replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":');
		try {
			// 尝试解析为 JSON 对象
			const jsonObj = JSON.parse(validJsonStr);
			return jsonObj;
		} catch (error) {
			console.error("JSON 解析失败: ", error);
			return null;
		}
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
			if (content.split("```").length % 2) {
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
</script>

<style lang="scss">
	.markdown {
		width: 100%;
	}

	.charts-box {
		width: 100%;
		height: 300px;
	}
</style>