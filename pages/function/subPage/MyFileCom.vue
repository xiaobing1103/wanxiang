<template>
	<view class="MyFileComMain">
		<template v-if="CurrentLists.length > 0">
			<view class="MyFileCom" v-for="(items,index) in CurrentLists" :key="index">
				<view class="MyFileCom_box">
					<view class="MyFileCom_box_title">
						{{items.file_name}}
					</view>
					<view class="MyFileCom_box_title">
						<text>任务数量：{{items.task_count}}</text>
						<text>上传日期：{{timestampToDateString(items.time,true) }}</text>
					</view>
					<view class="MyFileCom_box_button">
						<view class="MyFileCom_box_button_content">
							<up-button type="primary" @click="onOpen(items)" size="small"
								:customStyle="{width:'100%'}">{{props.currentType == 'AIGC检测' ? '提交检测' : '智能降AIGC'}}
							</up-button>
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
	<up-modal :show="showModal" @confirm="onConfirm" showCancelButton @cancel="showModal = false" title="温馨提示"
		:content="`你将将此文件进行 ${currentType}!`"></up-modal>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { timestampToDateString } from '@/utils';
	import type { DefineFunc } from '../type.ts'
	const { $api, $assets } = useGlobalProperties()
	const props = defineProps<{ defineFunctions : DefineFunc, currentType : string, CurrentLists : Array<any>, getCurrentPagesLists : Function }>()
	const currentPage = defineModel('currentPage')
	const showModal = ref(false)
	const seletedFile_id = ref()
	const onOpen = ({ file_id }) => {
		seletedFile_id.value = file_id
		showModal.value = true
	}
	const onConfirm = async () => {
		const signApires = await $api.get('api/v1/app/getAigcM', {}, {})
		if (signApires.code == 200) {
			const Resp = await props.defineFunctions.aigcTaskCheck({ file_id: seletedFile_id.value, rewrite_sw: 0, score: 30 }, { t: signApires.data.t, m: signApires.data.m, time: signApires.data.time })
			uni.$u.toast(Resp.msg);
			if (Resp.code == 300) {
				currentPage.value = 1
				showModal.value = false
			}
		}
	}
	onMounted(() => {
		props.getCurrentPagesLists()
	})
</script>

<style lang="scss" scoped>
	.MyFileComMain {
		padding: 24rpx;
		height: 100%;
	}

	.MyFileCom {
		border-radius: 10rpx;
		border: 1rpx solid #3c9cff;
		padding: 10rpx;
		margin: 15rpx 0;

		&_box {
			display: flex;
			flex-direction: column;

			&_title {
				font-size: 27rpx;
				padding: 10rpx 0;
			}

			&_button {
				display: flex;
				justify-content: flex-end;

				&_content {}
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