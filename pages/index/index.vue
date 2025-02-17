<template>
	<template v-if="newIndex">
		<AllModelChatCom />
	</template>
	<!-- <template v-else>
		<NewIndexPage />
	</template> -->
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	// import { onLoad } from '@dcloudio/uni-app';
	import AllModelChatCom from './AllModelChatCom.vue';
	import NewIndexPage from './NewIndexPage.vue';
	const newIndex = ref(1);
	const gpList = ref([]);
	const searchContent = ref("");
	const KeyHight = ref(0);

	const tab = ref(1);
	// const onInputSearch = function (e) {
	// 	if (tab.value === 1) {
	// 		searchContent.value = e.detail.value;
	// 		if (searchContent.value !== "") {
	// 			search_index(searchContent.value);
	// 		}
	// 	}
	// };

	// onLoad((options) => {
	// 	uni.onKeyboardHeightChange((res) => {
	// 		KeyHight.value = res.height;
	// 	});
	// });

	// const clearSearch = () => {
	// 	searchContent.value = "";
	// };

	// const search_index = (word) => {
	// 	console.log(word);
	// };

	// const search = () => {
	// 	// 可以在这里添加搜索逻辑
	// };
</script>

<style lang="scss">
	// .pagesone {
	// 	width: 100%;
	// 	height: 100%;
	// }

	// .searchdemo {
	// 	width: 100vw;
	// 	position: absolute;
	// 	bottom: 0;
	// 	z-index: 99;
	// }

	// .input {
	// 	margin-left: 30rpx;
	// 	width: 75%;
	// 	display: flex;
	// 	flex-direction: row;
	// 	align-items: center;
	// 	border-radius: 10rpx;
	// 	padding-left: 20rpx;
	// 	padding-right: 20rpx;
	// 	background-color: #e0c0ff;
	// 	/* 可根据需要调整背景颜色 */
	// }

	// .input-text {
	// 	margin-left: 20rpx;
	// 	margin-right: 20rpx;
	// 	width: 100%;
	// 	font-size: 32rpx;

	// }

	// .placeholder-class {
	// 	color: #6F6F6F;
	// 	font-size: 32rpx;
	// }
</style>