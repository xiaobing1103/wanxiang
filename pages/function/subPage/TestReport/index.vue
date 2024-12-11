<template>
	<z-paging :pagingStyle="{ background: 'rgb(246, 247, 249)', padding: '0 30rpx' }">
		<template #top>
			<CommonHeader :defindTitle="currentProject+'-查看报告'" />
		</template>
		<view class="TestReport">
			<view class="TestReport_code">
				<text>检测报告编号:</text>
				<text>{{taskId}}</text>
			</view>
			<view class="ReportMain">
				<template v-for="(items,index) in titleTop" :key="index">
					<view class="ReportMain_Box">
						<view class="ReportMain_Box_header" v-if="items.functions">
							<text :style="{color : items.color  ? items.color :''}">
								{{items.functions(items.number)}}
							</text>
						</view>
						<view class="ReportMain_Box_desc">
							{{items.desc}}
						</view>
					</view>
				</template>
			</view>
			<template v-for="(item,index) in newOptions">
				<view class="TestReport_title">
					<view class="TestReport_title_topTitle">图表 {{index + 1}}</view>
					<view class="TestReport_title_bottomTitle">
						段落ai疑似度：<text :style="{color: getColor(Number(item?.others?.score_adv?.toFixed(2))) || '' }">
							{{Number(item?.others?.score_adv?.toFixed(2)) + '%'}}</text></view>
				</view>
				<view class="TestReport_UchartsBox">
					<qiun-data-charts :opts="opt" @complete="getcharts" @getImage="getim" inScrollView canvas2d
						type="line" :chartData="chartData[index]" />
				</view>
				<view class="TestReport_desc">
					<view class="TestReport_desc_left">
						字段 {{ index + 1}}
					</view>
					<view class="TestReport_desc_right">
						<text @click="openOverLay(item?.others?.text)"
							class="TestReport_desc_right_text">{{item?.others?.text}}</text>
					</view>
				</view>
			</template>
		</view>
	</z-paging>
	<up-overlay :show="showOverlay">
		<view class="showOverlayWarp">
			<view class="showOverlayWarp_view">
				<view class="showOverlayWarp_view_header">
					<view class="showOverlayWarp_view_header_title">
						<up-icon @click="closeModal" name="close"></up-icon>
					</view>

					<view class="showOverlayWarp_view_header_content">
						{{showText}}
					</view>
				</view>
			</view>
		</view>
	</up-overlay>
</template>

<script setup lang="ts">
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import CommonHeader from '@/components/CommonHeader.vue'
	import { computed, onMounted, ref } from 'vue';
	import { downloadReport } from '@/utils';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	const { $api } = useGlobalProperties()
	const showOverlay = ref(false)
	const showText = ref('')
	const taskId = ref()
	const currentProject = ref('')
	const Echarts = ref(null)
	const chartData = ref([])
	const opt = ref({
		xAxis: {
			rotateLabel: true,
			rotateAngle: '45'
		},
		legend: {
			show: false
		},

	})

	const openOverLay = (str : string) => {
		showText.value = str
		showOverlay.value = true
	}

	const getData = (score : number) => {
		return score
	}

	const getColor = (score : number) => {
		if (score >= 83 && score <= 100) {
			return `red`
		}
		if (score >= 66 && score <= 83) {
			return `orange`
		}
		if (score >= 50 && score <= 66) {
			return `skyblue`
		}
		if (score <= 50) {
			return `green`
		}
	}
	const titleTop = computed(() => [
		{
			desc: 'AI 疑似度 (原文)',
			number: Number(Echarts.value?.ai_rate_before.toFixed(2)) * 100 + '%',
			color: getColor(Number(Echarts.value?.ai_rate_before.toFixed(2)) * 100),
			functions: getData,
		},
		{
			desc: 'AI 疑似度 （降AIGC）',
			number: Echarts.value?.ai_rate !== -1 ? Number(Echarts.value?.ai_rate.toFixed(2)) * 100 : '--',
			functions: getData,
			color: getColor(Number(Echarts.value?.ai_rate.toFixed(2)) * 100)
		},
		{ desc: '文章字段', number: Echarts.value?.result_text.length, functions: getData, tooltipStr: '每512字符为1个字段' }
	])

	function calculateMax(value : number, base = 10) {
		return Math.ceil(value / base) * base
	}

	const newOptions = computed(() => {
		if (Echarts.value) {
			const tem = Echarts.value?.every_sentences_score.map((item, index) => {
				// 提取series数据数组
				const seriesData = [
					item.lert,
					item.bart,
					item.bloom,
					item.xlnet,
					item.electra,
					item.roberta,
					item.distile
				]
				// 计算series数据的最大值
				const rawMaxValue = Math.max(...seriesData)
				const maxValue = calculateMax(rawMaxValue, 10) // 你可以根据需要改变基数

				const newopt = {
					others: {
						text: item.text,
						score_adv: item.score_adv
					},
					categories: ['lert模型',
						'bart模型',
						'bloom模型',
						'xlnet模型',
						'electra模型',
						'roberta模型',
						'distile模型'],
					series: [
						{
							name: "段落ai疑似度",
							data: [...seriesData],
							textSize: 12,
							// textColor: 'rgba(255,255,255,0)',
							format: 'yAxisDemo2'
						}
					]
				}
				chartData.value[index] = JSON.parse(JSON.stringify(newopt))
				return newopt
			})
			return tem
		}
	})
	onLoad(async (query) => {
		if (query.taskId) {
			taskId.value = query.taskId
			currentProject.value = query.type
		}
	});
	const getDetails = async () => {
		const url = currentProject.value == '智能降AIGC' ? 'https://appc.1foo.com/api/app/aigc/task/rewriteDetails' : 'https://appc.1foo.com/api/app/aigc/task/details'
		const signApires = await $api.get('api/v1/app/getAigcM', {}, {})

		if (signApires.code == 200) {
			const Resq = await $api.post(url, { task_id: taskId.value }, null, { t: signApires.data.t, m: signApires.data.m, time: signApires.data.time })
			console.log(Resq)
			if (Resq.code == 200) {

				Echarts.value = Resq.data.response
			}
		}
	}

	const closeModal = () => {
		showOverlay.value = false
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
	onMounted(() => {
		getDetails()
	})
</script>

<style lang="scss" scoped>
	.TestReport {
		padding-top: 24rpx;



		&_desc {
			font-size: 25rpx;

			&_left {
				font-weight: 500;
				padding-bottom: 15rpx;
			}

			&_right {

				background-color: #ccc;
				padding: 10rpx;
				border-radius: 10rpx;

				&_text {
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					display: -webkit-box;
				}
			}
		}

		&_title {
			display: flex;
			flex-direction: column;
			padding: 15rpx;

			&_topTitle {
				font-size: 27rpx;
				font-weight: 800;
			}

			&_bottomTitle {
				text-align: center;
				font-weight: 800;
				font-size: 27rpx;
			}
		}

		&_code {
			display: flex;
			flex-direction: column;
			border-radius: 10rpx;
			font-size: 25rpx;
			padding: 10rpx;
			border: 1rpx solid #ccc;
		}

		&_UchartsBox {
			padding: 45rpx 0;
		}
	}


	.ReportMain {
		display: flex;
		font-size: 25rpx;
		font-weight: 800;

		justify-content: space-between;
		align-items: center;

		&_Box {
			padding: 10rpx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;

			&_header {
				padding: 10rpx 0;
			}

			&_desc {}
		}


	}

	.showOverlayWarp {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;

		&_view {
			width: 80%;
			height: 70%;
			background-color: white;
			border-radius: 15rpx;
			overflow: hidden;

			&_header {
				width: 100%;
				height: 90%;

				&_title {
					display: flex;
					justify-content: flex-end;
					padding: 15rpx;
				}

				&_content {
					overflow-y: scroll;
					height: 100%;
					padding: 15rpx;
				}
			}
		}
	}
</style>