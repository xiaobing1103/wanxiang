<template>
	<z-paging :scroll-with-animation="true" :show-scrollbar="false" ref="paging" :pagingStyle="{padding:'0rpx'}">
		<template #top>
			<CommonHeader defindTitle="其他客户端产品" />
		</template>
		<view class="otherPage">
			<template v-for="(items ,index) in appLists">
				<view class="appListsBox" @click="openPages(items.link)">
					<image @click="previewImage(items.img)" :src="items.img" mode=""></image>
					<view class="appListsBox_textBox">
						<text class="appListsBox_textBox_text1">{{items.title}}</text>
						<text class="appListsBox_textBox_text2">{{items.desc}}</text>
					</view>
					<view class="copyButton">
						<up-button :customStyle="btnStyle" @click="copy(items.link)">复制链接</up-button>
						<up-button :customStyle="btnStyle" @click="openLink(items.link)">打开链接</up-button>
					</view>
				</view>
			</template>
		</view>
	</z-paging>
</template>

<script setup lang="ts">
	import { toCopyText } from '@/utils'
	import CommonHeader from '@/components/CommonHeader.vue'
	const btnStyle = {
		width: '50%',
		border: '0',
		background: '#ecf5ff',
		margin: '20rpx 40rpx'
	}
	const openPages = (url : string) => {

	}
	const copy = (url : string) => {
		toCopyText(url)
	}
	const openLink = (url : string) => {
		//#ifdef H5
		// H5 端直接跳转
		window.location.href = url;
		//#endif

		//#ifdef MP
		uni.$u.toast('小程序端不支持页面跳转请复制链接到浏览器打开！');
		// 小程序端，使用 webview 加载外部链接
		// uni.navigateTo({
		// 	url: '/pages/function/subPage/webview/index?url=' + encodeURIComponent(url)
		// })
		//#endif

		//#ifdef APP-PLUS
		// App 端使用内置浏览器打开链接
		plus.runtime.openURL(url);
		//#endif
	}

	const previewImage = (url : string) => {
		uni.previewImage({
			urls: [url]
		})
	}
	const appLists = [
		{
			img: 'http://file.1foo.com/2025/01/23/928215ad8a12d926236c8bcb9f89e0cc.jpg',
			title: '边界AIchat - PC端',
			desc: '支持：windows/Mac Os',
			link: 'https://dmla.lanzoup.com/b05pp2tzc'
		},
		{
			img: 'http://file.1foo.com/2025/01/23/7f55cb8e48b3d3b2abd83cc38c27ca46.jpg',
			title: '边界AIchat - 网页端',
			desc: '支持：windows/Mac Os /浏览器/手机端',
			link: 'https://www.yyai8.com'
		},
		{
			img: 'http://file.1foo.com/2025/01/23/c3d1c2065e6ccac7a97a4e30664b26f9.jpg',
			title: '边界AIchat - 极速版',
			desc: '支持：安卓，无广告、启动快、简约',
			link: 'https://bgg.lanzout.com/b02fnso1e'
		},
	]
</script>

<style lang="scss" scoped>
	.otherPage {
		display: flex;
		flex-direction: column;
		align-items: center;

		.appListsBox {
			display: flex;
			flex-direction: column;

			&_textBox {
				display: flex;
				justify-content: space-between;
				padding: 20rpx 0;

				&_text1 {
					font-size: 24rpx;
				}

				&_text2 {
					font-size: 20rpx;
					color: red;
				}
			}
		}
	}

	.copyButton {
		display: flex;

	}
</style>