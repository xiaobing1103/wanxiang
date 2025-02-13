<template>
	<template v-if="newIndex">
		<AllModelChatCom />
	</template>
	<template v-else>
		<NewIndexPage />
		<!-- <view class="pagesone">
			<view class="searchdemo" :style="{ bottom: KeyHight ? KeyHight + 'px' : '0px' }">
				<view class="input">
					<textarea
						:style="{margin:'0rpx' ,overflow: 'scroll',maxHeight:'100rpx', padding:'0rpx', fontSize:'30rpx', width:'100%'}"
						:show-confirm-bar="false" :adjust-position="false" :always-system="true" :value="searchContent"
						confirm-type="search" @confirm="search" @input="onInputSearch" class="input-text"
						placeholder="输入股票名称/缩写/代码" placeholder-class="placeholder-class" :focus="true"></textarea>
				</view>
			</view>
			<view style="position: fixed; width: 100%; height: 100%; z-index: 0;"></view>
		</view> -->
	</template>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import AllModelChatCom from './AllModelChatCom.vue';
	import NewIndexPage from './NewIndexPage.vue';
	const gpList = ref([]);
	const searchContent = ref("");
	const KeyHight = ref(0);
	const newIndex = ref(1);
	const tab = ref(1);
	const onInputSearch = function (e) {
		if (tab.value === 1) {
			searchContent.value = e.detail.value;
			if (searchContent.value !== "") {
				search_index(searchContent.value);
			}
		}
	};

	onLoad((options) => {
		uni.onKeyboardHeightChange((res) => {
			KeyHight.value = res.height;
		});
	});

	const clearSearch = () => {
		searchContent.value = "";
	};

	const search_index = (word) => {
		console.log(word);
	};

	const search = () => {
		// 可以在这里添加搜索逻辑
	};
</script>

<style lang="scss">
	.pagesone {
		width: 100%;
		height: 100%;
	}

	.searchdemo {
		width: 100vw;
		position: absolute;
		bottom: 0;
		z-index: 99;
	}

	.input {
		margin-left: 30rpx;
		width: 75%;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 10rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		background-color: #e0c0ff;
		/* 可根据需要调整背景颜色 */
	}

	.input-text {
		margin-left: 20rpx;
		margin-right: 20rpx;
		width: 100%;
		font-size: 32rpx;

	}

	.placeholder-class {
		color: #6F6F6F;
		font-size: 32rpx;
	}
</style>