<template>
	<up-modal :showConfirmButton="false" :show="showModel" :title="title" @close="onclose" closeOnClickOverlay>
		<view class="WxGongZhongHao">
			<view class="WxGongZhongHao_header">
				扫一扫，关注公众号
			</view>
			<view class="WxGongZhongHao_main">
				<image class="WxGongZhongHao_main_image" :src="$assets.gongZhongHao" mode=""></image>
			</view>
			<view class="WxGongZhongHao_footer">
				<view class="WxGongZhongHao_footer_saveButton" @click="toDownload($assets.gongZhongHao)">
					保存图片
				</view>
			</view>
		</view>
	</up-modal>

</template>

<script lang="ts" setup>
	import { useGlobalProperties } from '../../hooks/useGlobalHooks';
	import { downloadBase64Image } from '@/utils/downLoadLocal';
	import { saveImage } from '@/utils/saveImages';
	const showModel = defineModel<boolean>('showModel');
	const { $assets, $api } = useGlobalProperties();
	defineProps<{ title ?: string }>()
	const onclose = () => {
		showModel.value = false
	}

	const toDownload = async (url : string) => {
		// #ifdef H5
		const res = await $api.get('api/v1/img/getbase64', { url: url });
		if (res.code == 200) {
			downloadBase64Image(res.data, 'image');
		} else {
			uni.$u.toast('获取图片链接失败请重试！');
		}
		// #endif
		// #ifdef MP-WEIXIN
		saveImage(url);
		// #endif

	};
</script>

<style lang="scss">
	.WxGongZhongHao {
		box-sizing: border-box;
		width: 100%;

		&_header {
			display: flex;
			justify-content: center;
			font-size: 40rpx;
			font-weight: 800;
		}

		&_main {
			display: flex;
			align-items: center;

			&_image {
				// width: 300rpx;
				width: 100%;
			}
		}

		&_footer {
			padding: 25rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			&_saveButton {
				width: 80%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 30rpx;
				border-radius: 1.09375rem !important;
				height: 60rpx !important;
				color: #ffffff !important;
				background: linear-gradient(to right, #1cd8ba, #06c0f9);
				cursor: pointer;
			}
		}
	}
</style>