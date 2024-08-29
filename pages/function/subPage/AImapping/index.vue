<template>
	<z-paging ref="pagingRef" :show-scrollbar="false" :scroll-with-animation="true">
		<template #top>
			<CommonHeader defindTitle="AI思维导图" />
		</template>
		<view class="AImapping">
			<view class="AImapping_main">
				<view class="AImapping_main_TopInput">
					<view class="AImapping_main_TopInput_tabs" v-for="(item,index) in list1" :key="index"
						@click="handlerClick(index)">
						{{item.name}}
						<text :style="{display:index == current ? 'block' :'none'}"
							class="AImapping_main_TopInput_tabs_line"></text>
					</view>

				</view>
				<view class="AImapping_main_content">
					<template v-if="current == 0">
						<CreateMapTem @scrollBottom="onScroolToBottom" v-model:contentStr="contentStr" />
					</template>
					<template v-if="showMappingContent">
						<!-- <MappingContent v-model:contentStr="contentStr" /> -->
						23456312456
					</template>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script setup lang="ts">
	import { nextTick, reactive, ref, watch } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue'
	import CreateMapTem from './components/CreateMapTem'
	import { debounce } from '@/utils';
	const initValue = `# ChatGptWeb系统
## 基础功能
- 支持AI聊天
- 支持GPT4
- 支持DLLAE2
- 支持Midjourney
- 支持mind思维导图生成
- 更多功能等你探索......
	
## 更多内容
-  在上面输入您想要生成的内容
- 点击生成即可
`
	const current = ref(0)
	const pagingRef = ref(null)
	const list1 = reactive([
		// { name: '生成', keyName: 'Tab1', },
		// { name: '预览', keyName: 'Tab2', }
	]);
	const contentStr = ref(initValue)
	const showMappingContent = ref(false);
	// 监听 current 的变化
	watch(current, (newVal) => {
		if (newVal === 1) {
			// 延迟加载 MappingContent 组件
			setTimeout(() => {
				showMappingContent.value = true;
			}, 300); // 延迟 300 毫秒（根据需要调整时间）
		} else {
			showMappingContent.value = false;
		}
	});
	//滚动到底部
	const onScroolToBottom = debounce(() => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
		})
	}, 500)
	const handlerClick = (index : number) => {
		if (index) {
			// #ifdef H5
			uni.navigateTo({
				url: '/pages/function/subPage/AImappingPreview/index'
			})
			// #endif
			// #ifdef MP-WEIXIN
			uni.navigateTo({
				url: '/pages/function/subPage/WeChatWebview/index'
			})
			// #endif

		} else {
			current.value = index
		}
	}
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

				font-size: 25rpx;
			}
		}
	}
</style>