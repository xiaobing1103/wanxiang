<template>
	<z-paging ref="srollRef" :pagingStyle="{ background: 'rgb(246, 247, 249)', padding: '0 30rpx' }">
		<template #top>
			<CommonHeader :backPageNum="2" />
		</template>
		<view class="body">

			<view class="PreviewPage">
				<view class="PreviewPage_header">
					<CommonTitle title="图片预览" desc='' />
				</view>
				<view class="PreviewPage_content">
					<uni-swiper-dot :style="{ height: '100%', width: '100%' }" :info="currentImages?.images"
						:current='current' field="content" :mode="'round'">
						<view class="swiper">
							<swiper class="swiper-box" @change="change">
								<swiper-item class="swiper-item" v-for="(item, index) in currentImages?.images"
									:key="index">
									<view class="swiper-item">
										<image class="swiper-item_image" :src="item" mode="aspectFill"
											@click="previewImage(item)"></image>
									</view>
								</swiper-item>
							</swiper>
						</view>
					</uni-swiper-dot>
				</view>
				<view class="PreviewPage_main">
					图片分辨率 ：（ 512 * 512 ）
				</view>
			</view>

		</view>

		<template #bottom>
			<view class="PreviewPage_footer">
				<view class="PreviewPage_footer_tips">
					超级高清放大（点击下载）
				</view>
				<view class="PreviewPage_footer_handlers">
					<view class="PreviewPage_footer_handlers_items"
						@click="toDownload(currentImages?.images[current], '1')">
						<up-icon name="download" size="28"></up-icon>
						<text>下载</text>
					</view>
					<view class="PreviewPage_footer_handlers_items">
						<up-icon name="share" size="28"></up-icon>
						<text>分享</text>
					</view>
					<view class="PreviewPage_footer_handlers_items" @click="againImages">
						<up-icon name="reload" size="28"></up-icon>
						<text>再来一张</text>
					</view>
					<view class="PreviewPage_footer_handlers_items" @click="deleteImages">
						<up-icon name="trash" size="28"></up-icon>
						<text>删除</text>
					</view>
				</view>

			</view>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CommonHeader from '@/components/CommonHeader.vue'
import CommonTitle from '@/components/CommonTitle.vue'
import { useDrawStore } from '@/store';
import { drawTaskJson, } from '@/store/draw';
import { useGlobalProperties } from '@/hooks/useGlobalHooks';
import { downloadBase64Image, saveFile } from '@/utils/downLoadLocal';
const drawStore = useDrawStore()
const { $api } = useGlobalProperties()
const current = ref(0)
const change = (e) => {
	current.value = e.detail.current;
}
const currentImages = ref<drawTaskJson>()
onMounted(() => {
	const index = drawStore.taskIdParmas[drawStore.seletedDrawProject].historyTasks.length
	if (index > 0) {
		currentImages.value = drawStore.taskIdParmas[drawStore.seletedDrawProject].historyTasks[index - 1] as drawTaskJson
		console.log(currentImages.value)
	} else {
		uni.$u.toast('没有找到查询任务！')
	}

})
const previewImage = (current: string) => {
	uni.previewImage({
		current,
		urls: currentImages.value?.images,
	});
};

const fileUrl = ref('')
const fileType = ref('')

const toDownload = async (url: string, type: string) => {
	// url转base64
	const res = await $api.get('api/v1/img/getbase64', { url: url });
	if (res.code == 200) {
		fileUrl.value = res.data;
		fileType.value = type;
		// #ifdef H5
		downloadBase64Image(res.data, 'image')
		// #endif
		// #ifdef MP-WEIXIN
		saveFile(res.data)
		// #endif
	} else {
		uni.$u.toast('获取图片链接失败请重试！')
	}
}

const deleteImages = () => {
	uni.showModal({
		title: '删除',
		content: '是否删除此组照片?',
		success: () => {
			console.log(drawStore.taskIdParmas)
		},
		fail: () => {
			console.log(52825259)
		}
	})
}
const againImages = () => {
	uni.showModal({
		title: '再来一张',
		content: '是否重新生成图片?',
		success: () => {
			console.log(drawStore.taskIdParmas)
		},
		fail: () => {
			console.log(52825259)
		}
	})
}
</script>

<style lang="scss" scoped>
.body {
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	padding: 25rpx 0;

}

.PreviewPage {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 1000rpx;
	justify-content: center;

	&_content {
		display: flex;
		width: 100%;
		height: 100%;
	}

	&_main {
		padding: 50rpx 0;
		font-size: 25rpx;
		font-weight: 800;
	}

	&_footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		&_tips {
			font-size: 25rpx;
			color: $aichat-border-color;
			font-weight: 700;
			padding: 20rpx 0;
		}

		&_handlers {
			width: 100%;
			align-items: center;

			display: flex;
			justify-content: space-between;

			&_items {
				display: flex;
				padding: 0 35rpx;
				align-items: center;
				flex-direction: column;
				font-size: 25rpx;
			}
		}
	}
}

.swiper-box {
	width: 100%;
	height: 100%;
}

.swiper {
	width: 100%;
	height: 100%;
}

.swiper-item {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	&_image {
		width: 100%;
		height: 100%;
	}
}
</style>