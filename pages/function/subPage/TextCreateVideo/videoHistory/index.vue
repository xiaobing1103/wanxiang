<template>
	<z-paging :scroll-with-animation="true" :show-scrollbar="false" ref="pagingRef" :pagingStyle="{padding:'0 40rpx'}">
		<template #top>
			<CommonHeader defindTitle="历史记录" />
		</template>
		<view class="videoHistory">
			<template v-if="HistoryData.length>0">
				<template v-for="(items) in HistoryData">
					<view class="videoHistory_items">
						<view class="videoHistory_items_leftBox">
							<template v-if="items.cover_image_url">
								<image class="videoHistory_items_leftBox_image" :src="items.cover_image_url" mode="">
								</image>
							</template>
							<template v-else>
								<view class="noimages">
									<up-icon name="photo-fill" size="28"></up-icon>
								</view>
							</template>


							<text class="videoHistory_items_leftBox_title">{{items.title || '默认标题'}}</text>
						</view>
						<view class="videoHistory_items_rightBox">
							<up-icon @click="playVideos(items)" name="play-right-fill" size="20"></up-icon>
							<up-icon @click="downLoad(items.url)" name="download" size="20"></up-icon>
							<up-icon @click="deleteVideos(items.url)" name="trash" size="20"></up-icon>
						</view>
					</view>
				</template>
			</template>
			<template v-else>
				<view class="noData">
					<image class="noData_image" :src="$assets.noData" />
				</view>
			</template>
		</view>
	</z-paging>
	<up-modal @cancel="showModal = false" showCancelButton :show="showModal" title="提示"
		content="是否要删除此视频,删除后无法以任何方式获取!!" @confirm="deleteConfirm">

	</up-modal>
	<VideoItems v-model:SoraPromptPramas="SoraPromptPramas" />
</template>

<script setup lang="ts">
	import { ref, reactive, computed } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import CommonHeader from '@/components/CommonHeader.vue';
	import { useMusicStore } from '@/store';
	import VideoItems from '../../CommonComponents/AIVideoCommon/VideoItems.vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { VideoHistoryDataType } from '@/store/music';
	import { VideoVmodalType } from '../../CommonComponents/AIVideoCommon/datas';
	const MusicStore = useMusicStore()
	const { $assets } = useGlobalProperties()
	const deleteUrl = ref('')
	const historyType = ref('')
	const showModal = ref(false)
	const HistoryData = computed<string[] | VideoHistoryDataType[]>(() => {
		if (historyType.value == 'numbersPeople') {
			return MusicStore.NumbersPeopleHistoryData
		}
		return MusicStore.VideoHistoryData
	})
	const deleteHistoryData = computed(() => {
		if (historyType.value == 'numbersPeople') {
			return MusicStore.deleteNumbersPeopleHistoryData
		}
		return MusicStore.deleteVideoHistoryData
	})


	const SoraPromptPramas = reactive<VideoVmodalType>({
		showVideo: false,
		playVideo: '',
		isQuery: false
	})
	const downLoad = (url : string) => {
		uni.downloadFile({
			url: url,
			success: (res) => {
				// 2 成功下载后而且状态码为200时将视频保存到本地系统
				if (res.statusCode === 200) {
					uni.saveVideoToPhotosAlbum({
						filePath: res.tempFilePath
					})
					uni.hideLoading();
					// 提示用户下载成功
					uni.showToast({ title: "下载成功", icon: "success" });
				}
				// 如果该资源不可下载或文件格式出错则提示用户
				else {
					uni.showToast({ title: "资源格式错误，请联系管理员" });
				}
			},
			fail: (err) => {
				// 下载失败提醒
				uni.hideLoading();
				uni.showToast({ title: "下载失败" })
			}
		})
	}
	const deleteVideos = (url : string) => {
		showModal.value = true
		deleteUrl.value = url

	}
	const deleteConfirm = () => {
		deleteHistoryData.value(deleteUrl.value)
		uni.showToast({ title: "删除成功" })
		showModal.value = false
	}

	const playVideos = (items : VideoHistoryDataType) => {
		SoraPromptPramas.showVideo = true
		SoraPromptPramas.playVideo = items.url

	}

	onLoad((query) => {
		if (query.type) {
			historyType.value = query.type
		}
	});
</script>

<style lang="scss" scoped>
	.videoHistory {
		display: flex;
		flex-direction: column;
		padding: 30rpx 0;

		&_items {
			display: flex;
			justify-content: space-between;
			padding: 20rpx 0;

			&_leftBox {
				display: flex;
				align-items: center;

				&_image {
					width: 150rpx;
					height: 100rpx;
					border-radius: 15rpx;
				}

				&_title {
					white-space: nowrap;
					/* 保持文本在一行内 */
					overflow: hidden;
					/* 隐藏溢出的文本 */
					text-overflow: ellipsis;
					/* 显示省略号 */
					width: 300rpx;
					padding: 20rpx;
					height: 40rpx
				}
			}

			&_rightBox {
				display: flex;
				align-items: center;
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

	.noimages {
		height: 40rpx;
	}
</style>