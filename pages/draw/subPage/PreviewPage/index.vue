<template>
	<z-paging ref="srollRef" :pagingStyle="{ background: 'rgb(246, 247, 249)', padding: '0 30rpx' }">
		<template #top>
			<CommonHeader defindTitle="图片预览" :defindPath="drawProjectConfig[drawStore.seletedDrawProject].path" />
		</template>
		<view class="body">
			<view class="PreviewPage">
				<!-- 	<view class="PreviewPage_header">
					<CommonTitle title="图片预览" desc="" />
				</view> -->
				<view class="PreviewPage_content">
					<uni-swiper-dot :style="{ height: '100%', width: '100%' }" :info="currentImages?.images"
						:current="current" field="content" :mode="'round'">
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
				<view class="PreviewPage_main">图片分辨率 ：（ 512 * 512 ）</view>
			</view>
		</view>

		<template #bottom>
			<view class="PreviewPage_footer">
				<view class="PreviewPage_footer_tips">超级高清放大（点击下载）</view>
				<view class="PreviewPage_footer_handlers">
					<view class="PreviewPage_footer_handlers_items"
						@click="toDownload(currentImages?.images[current], '1')">
						<up-icon name="download" size="28"></up-icon>
						<text>下载</text>
					</view>
					<!-- #ifdef MP-WEIXIN -->
					<view class="PreviewPage_footer_handlers_items" open-type="share" @click="goShareClick">
						<up-icon name="share" size="28"></up-icon>
						<text>分享</text>
					</view>
					<!-- #endif -->

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
			<cc-shareMenu ref="share" :contentHeight="580" :shareList="shareList"
				@click="shareMenuClick"></cc-shareMenu>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue';
	import { useDrawStore } from '@/store';
	import { drawTaskJson } from '@/store/draw';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { downloadBase64Image, saveFile } from '@/utils/downLoadLocal';
	import { saveImage } from '@/utils/saveImages';
	import { onShareAppMessage } from '@dcloudio/uni-app';

	import { drawProjectConfig } from '../../data';


	const sharepopup = ref(null);
	onShareAppMessage(() => {
		return {
			title: '自定义分享标题',
			path: '/pages/test/test?id=123'
		};
	});
	const share = ref(null);
	const shareList = [
		{
			type: 1,
			icon: 'http://file.1foo.com/2024/08/20/89749b5acda3775b7bd150074f7c8491.png',
			text: '微信好友'
		},
		{
			type: 2,
			icon: 'http://file.1foo.com/2024/08/20/65ae500ca0f7de249febad7bea7a3848.png',
			text: '朋友圈'
		},
		{
			type: 3,
			icon: '/static/share_qq.png',
			text: 'QQ好友'
		},
		{
			type: 4,
			icon: '/static/share_qqzone.png',
			text: 'QQ空间'
		},
		{
			type: 5,
			icon: '/static/share_weibo.png',
			text: '微博'
		}
	];
	const goShareClick = () => {
		wx.downloadFile({
			url: currentImages?.value.images[current.value],
			success: (res) => {
				wx.showShareImageMenu({
					path: res.tempFilePath
				});
			}
		});
	};
	const shareMenuClick = (name) => {
		uni.showModal({
			title: '温馨提示',
			content: '点击的分享菜单名称是 = ' + name
		});
	};
	const drawStore = useDrawStore();
	const { $api } = useGlobalProperties();
	const current = ref(0);
	const change = (e) => {
		current.value = e.detail.current;
	};
	// onShareAppMessage(() => {
	// 	return {
	// 		title: '转发标题',
	// 		imageUrl: currentImages?.value.images[current.value] // 图片 URL
	// 	}
	// })
	const returnPage = ref(drawProjectConfig[drawStore.seletedDrawProject].path)
	const currentImages = ref<drawTaskJson>();
	onMounted(async () => {
		const index = drawStore.taskIdParmas[drawStore.seletedDrawProject].historyTasks.length;
		if (index > 0) {
			currentImages.value = drawStore.taskIdParmas[drawStore.seletedDrawProject].historyTasks[index - 1] as drawTaskJson;
		} else {
			uni.$u.toast('没有找到查询任务！');
		}
		const pages = getCurrentPages(); // 当前页面
		const beforePage = pages[pages.length - 3]; // 前一个页面
		if (beforePage?.route == '/pages/draw/index') {
			returnPage.value = beforePage?.route
		}
	});
	const previewImage = (current : string) => {
		uni.previewImage({
			current,
			urls: currentImages.value?.images
		});
	};
	const fileUrl = ref('');
	const fileType = ref('');
	const toDownload = async (url : string, type : string) => {
		// #ifdef H5
		const res = await $api.get('api/v1/img/getbase64', { url: url });
		if (res.code == 200) {
			fileUrl.value = res.data;
			fileType.value = type;
			downloadBase64Image(res.data, 'image');
		} else {
			uni.$u.toast('获取图片链接失败请重试！');
		}
		// #endif
		// #ifdef MP-WEIXIN
		saveImage(url);
		// #endif

	};

	const deleteImages = () => {
		uni.showModal({
			title: '删除',
			content: '是否删除此组照片?',
			success: (res) => {
				console.log(res);
				console.log(drawStore.taskIdParmas);
			},
			fail: () => {
				console.log(52825259);
			}
		});
	};
	const againImages = () => {
		uni.showModal({
			title: '再来一张',
			content: '是否重新生成图片?',
			success: (res) => {
				if (res.confirm) {
					// 用户点击了“确定”
					drawStore.getTask(drawStore.currentParmasData);
				} else if (res.cancel) {
					// 用户点击了“取消”
					console.log(52825259);
				}
			},
			fail: () => {
				console.log(52825259);
			}
		});
	};
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
			font-size: 27rpx;
			font-weight: 800;
		}

		&_footer {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			&_tips {
				font-size: 27rpx;
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
					font-size: 27rpx;
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