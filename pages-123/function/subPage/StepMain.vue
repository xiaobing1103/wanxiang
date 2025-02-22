<template>
	<view class="StepMain">
		<template v-if="CurrentLists.length > 0">
			<view class="StepMain_Box" v-for="(lists,index) in CurrentLists" :key="index">
				<view class="StepMain_Box_contents">
					<view class="StepMain_Box_contents_title">
						{{lists.file_name}}
					</view>
					<view class="StepMain_Box_contents_mains">
						<view class="StepMain_Box_contents_mains_satuas"
							:style="{background:lists.status == 1 ? '#e6f4ff': '#feffe6'}">
							{{lists.status == 1  ? '已完成' : '未完成'}}
						</view>
						<view class="StepMain_Box_contents_mains_date">
							上传日期：{{timestampToDateString(lists.time,true)}}
						</view>
					</view>
					<view class="StepMain_Box_contents_btns">
						<view class="StepMain_Box_contents_btns_button" @click="openModal(lists.task_id)">
							<up-button size="small" type="primary"> 预览文件</up-button>
						</view>

						<view class="StepMain_Box_contents_btns_button" v-if="lists.status == 1">
							<up-button @click="toEcharts(lists.task_id)" size="small" type="primary">查看报告</up-button>
						</view>
					</view>
				</view>
			</view>

		</template>
		<template v-else>
			<view class="noData">
				<image class="noData_image" :src="$assets.noData" />
			</view>
		</template>
	</view>
	<up-modal showCancelButton :show="showModal " title="温馨提示" @confirm="preview" @cancel="showModal = false">
		<view class="TipsModalBox">
			<view class="TipsModalBox_title">
				句子得不同颜色表示不同的相似度
			</view>
			<view class="TipsModalBox_main" v-for="(items,index) in ShowColors" :key="index">
				<view class="TipsModalBox_color" :style="{color:items.color}">
					● {{items.colorName}}
				</view>
				<view class="TipsModalBox_text">
					{{items.content}}
				</view>
			</view>
		</view>
	</up-modal>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { DefineFunc } from '../type';
	import { timestampToDateString } from '@/utils';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	const props = defineProps<{ currentType : string, defineFunctions : DefineFunc, CurrentLists : Array<any>, getCurrentPagesLists : Function }>()
	const ShowColors = [
		{ color: 'red', content: '重度AI：83-100% (重度相似，请全面修改)', colorName: '红色' },
		{ color: 'orange', content: '中度AI：66-83% (中度相似，请酌情修改)', colorName: '橙色' },
		{ color: 'blue', content: '轻度AI：50-66% (比较相似，请酌情修改)', colorName: '蓝色' },
		{ color: 'green', content: '小于50% (合格)', colorName: '绿色' },
		{ color: 'gray', content: '内容太短不做检测', colorName: '灰色' },
	]
	const seletedTaskId = ref('')
	const showModal = ref(false)
	const { $api } = useGlobalProperties()
	onMounted(() => {
		props.getCurrentPagesLists()
	})
	const openModal = (task_id : string) => {
		showModal.value = true
		seletedTaskId.value = task_id
	}
	const toEcharts = (task_id : string) => {
		uni.navigateTo({
			url: `/pages/function/subPage/TestReport/index?taskId=${task_id}&type=${props.currentType}`
		})
	}

	const preview = async () => {
		const url = props.currentType == '智能降AIGC' ? 'https://appc.1foo.com/api/app/aigc/task/rewriteDetails' : 'https://appc.1foo.com/api/app/aigc/task/details'
		const signApires = await $api.get('api/v1/app/getAigcM', {}, {})
		if (signApires.code == 200) {
			uni.$u.toast('正在获取文件....');
			const Resq = await $api.post(url, { task_id: seletedTaskId.value }, null, { t: signApires.data.t, m: signApires.data.m, time: signApires.data.time })
			if (Resq.code == 200) {
				if (props.currentType == '智能降AIGC') {
					const rewriteUrl = Resq.data?.response?.rewrite_url
					if (rewriteUrl) {
						getFile(rewriteUrl)
					} else {
						uni.$u.toast('下载链接错误,或者文件还未改写完成,请上拉刷新文件！');
					}

				} else {
					if (Resq.data?.response?.check_url) {
						getFile(Resq.data?.response?.check_url)
					}
				}
			} else {
				uni.$u.toast(Resq.response.msg)
			}
		}

	}

	const getFile = (url : string) => {
		uni.showLoading({
			title: '正在获取预览文件，请稍等....'
		})
		uni.downloadFile({
			url: url,
			success: function (downloadFileRes) {
				console.log('downloadFileRes', downloadFileRes)
				uni.openDocument({
					showMenu: true,
					filePath: downloadFileRes.tempFilePath,
					success: function (openDocumentRes) {
						console.log('openDocumentRes', openDocumentRes)
						uni.hideLoading()
					},
					fail: function (openDocumentErr) {
						console.log('openDocumentErr', openDocumentErr)
						uni.hideLoading()
					}
				})
			}
		})

	}
</script>

<style lang="scss" scoped>
	.TipsModalBox {
		font-size: 27rpx;

		&_title {}

		&_main {
			padding: 20rpx 0;
			display: flex;
			width: 100%;

		}

		&_color {
			width: 20%;
		}

		&_text {
			width: 80%;
		}
	}

	.StepMain {
		padding: 24rpx;
		font-size: 27rpx;

		&_Box {
			border: 1rpx solid #3c9cff;
			padding: 15rpx;
			margin: 15rpx 0;
			border-radius: 10rpx;

			&_contents {
				display: flex;
				flex-direction: column;

				&_title {}

				&_mains {
					display: flex;
					padding: 20rpx 0;

					&_satuas {
						display: flex;
						font-size: 20rpx;
						justify-content: center;
						align-items: center;
						padding: 8rpx;
						border-radius: 10rpx;
						margin-right: 20rpx;
					}
				}

				&_btns {
					display: flex;
					justify-content: flex-end;

					&_button {
						margin-right: 20rpx;
					}
				}
			}
		}
	}

	.noData {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;

		&_image {
			height: 400rpx;
			padding: 50% 0;
		}

	}
</style>