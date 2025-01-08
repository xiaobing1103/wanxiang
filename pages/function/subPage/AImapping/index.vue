<template>
	<z-paging ref="pagingRef" :show-scrollbar="false" :scroll-with-animation="true">
		<template #top>
			<CommonHeader defindTitle="AI思维导图" />
		</template>
		<!-- #ifdef APP -->
		<!-- <web-view :src="url" @message="getMessage" /> -->
		<!-- #endif -->
		<view class="AImapping">
			<view class="AImapping_main">
				<view class="AImapping_main_content">
					<template v-if="current == 0">
						<CreateMapTem @scrollBottom="onScroolToBottom" />
					</template>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script setup lang="ts">
	import { nextTick, ref, computed } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue'
	import CreateMapTem from './components/CreateMapTem'
	import { debounce } from '@/utils';
	import config from '@/config'
	import { base64ToPath } from '@/utils/imgPath';
	import { useUserStore } from '@/store';
	const current = ref(0)
	const pagingRef = ref(null)
	const UserStore = useUserStore()
	//滚动到底部
	const onScroolToBottom = debounce(() => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
		})
	}, 500)

	const getMessage = async (event : any) => {
		const data = event.detail.data
		const path = await base64ToPath(data[0].base64)
		uni.saveImageToPhotosAlbum({
			filePath: path,
			success: (result) => {
				uni.$u.toast('保存成功！')
			},
			fail: (err) => {
				uni.$u.toast('保存失败！')
			}
		})
	}
	const url = computed(() => {
		const domain = config.baseUrl
		return `https://ai.ai068.com/mobile/packages/pages/mind_map/webview?is_web_view=1&token=&client=isApp`
	})
</script>

<style lang="scss" scoped>
	.AImapping {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;

		&_main {
			flex: 1;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			&_svg {
				width: 100%;
				height: 100%;
			}

			&_content {
				width: 100%;
			}

			&_TopInput {
				width: 100%;
				display: flex;

				&_tabs {
					width: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;

					&_line {
						display: none;
						position: absolute;
						width: 20%;
						bottom: -10rpx;
						border-radius: 7rpx;
						height: 8rpx;
						background-color: $aichat-border-color;
					}
				}
			}

			&_text {

				font-size: 27rpx;
			}
		}
	}
</style>