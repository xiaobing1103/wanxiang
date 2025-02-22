<template>
	<z-paging :scroll-with-animation="true" v-model="creationLists" @query="getLists" :show-scrollbar="false"
		ref="paging" :pagingStyle="{padding:'0rpx'}">
		<template #top>
			<CommonHeader defindTitle="AI应用中心" />
		</template>
		<view class="AIApplication">
			<view class="AIApplication_header">
				<SearchBox v-model:TextValue="TextValue" @SearchValue="SearchValue" />
			</view>
			<view class="AIApplication_main">
				<template v-for="(items,index) in creationLists">
					<view class="AIApplication_mainBox" @click="toNextPath(items.id)">
						<view class="AIApplication_mainBox_name">
							<image class="AIApplication_mainBox_name_image" :src="items.image"></image>
							<text class="AIApplication_mainBox_name_text">{{items.name}}</text>
						</view>
						<view class="AIApplication_mainBox_desc">
							{{items.tips}}
						</view>
						<view class="AIApplication_mainBox_bottom">
							<text>🔥{{items.use_num}}人使用过</text>
							<up-icon name="arrow-rightward" size="25" color="red"></up-icon>
						</view>
					</view>
				</template>
			</view>

		</view>
		<template #bottom>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import CommonHeader from '@/components/CommonHeader.vue'
	import SearchBox from './SearchBox.vue'
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app'
	const { $assets, $api } = useGlobalProperties()
	const TextValue = ref('')
	const creationLists = ref([])
	const paging = ref(null)
	const category_id = ref('')
	const getLists = async (page_no : number = 1, value : string = '', page_size ?: number = 15) => {
		const parmas = {
			page_no,
			page_size: 10
		}
		const creationListsReq = await $api.get(`api/v1/nika/creationLists?keyword=${TextValue.value}&category_id=${category_id.value}`, parmas)
		if (creationListsReq.code == 1) {
			paging.value.complete(creationListsReq.data.lists)
		} else {
			paging.value.complete(false);
		}
	}
	const SearchValue = async (val : string) => {
		const parmas = {
			keyword: val ? val : undefined,
			category_id: 0,
			page_no: 1,
			page_size: 50
		}
		const creationListsReq = await $api.get('api/v1/nika/creationLists', parmas)
		if (creationListsReq.code == 1) {
			creationLists.value = creationListsReq.data.lists
		}
	}
	onLoad(async (query) => {
		if (query.id) {
			category_id.value = query.id
		}
	})

	const toNextPath = (id : string) => {
		uni.navigateTo({
			url: `/pages/function/subPage/AIApplication/SingleApplication/index?id=${id}`
		})
	}
</script>

<style lang="scss" scoped>
	.AIApplication {
		padding: 30rpx;


		&_header {
			height: 300rpx;
			background: url(https://ai.ai068.com/resource/image/adminapi/default/bg_creation.jpg);
			background-size: cover;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-radius: 20rpx;
			padding: 40rpx 0;
		}

		&_main {
			margin: 30rpx 0;
		}

		&_mainBox {
			// background-color: $aichat-border-color;
			border-radius: 20rpx;
			box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
			padding: 20rpx;
			margin: 50rpx 0;

			&_name {
				display: flex;
				justify-content: flex-start;
				padding: 30rpx 0;
				align-items: center;

				&_image {
					width: 70rpx;
					height: 70rpx;
					margin-right: 20rpx;
				}

				&_text {
					font-weight: 900;
					font-size: 35rpx;
				}

			}

			&_desc {
				font-size: 27rpx;
				color: #ccc;
			}

			&_bottom {
				align-items: center;
				font-size: 27rpx;
				display: flex;
				margin-top: 20rpx;
				justify-content: space-between;
			}
		}
	}
</style>