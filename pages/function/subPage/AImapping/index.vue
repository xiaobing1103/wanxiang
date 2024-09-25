<template>
	<z-paging ref="pagingRef" :show-scrollbar="false" :scroll-with-animation="true">
		<template #top>
			<CommonHeader defindTitle="AI思维导图" />
		</template>
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
	import { nextTick, ref, } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue'
	import CreateMapTem from './components/CreateMapTem'
	import { debounce } from '@/utils';
	const current = ref(0)
	const pagingRef = ref(null)

	//滚动到底部
	const onScroolToBottom = debounce(() => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
		})
	}, 500)
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