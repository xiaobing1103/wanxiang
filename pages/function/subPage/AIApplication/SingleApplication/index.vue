<template>
	<z-paging :scroll-with-animation="true" :show-scrollbar="false" ref="pagingRef" :pagingStyle="{padding:'24rpx'}">
		<template #top>
			<CommonHeader defindTitle="AI应用页面" />
		</template>
		<view class="SingleApplication">
			<view class="SingleApplication_title">
				<view class="SingleApplication_title_name">
					{{detailData.name}}
				</view>
				<view class="SingleApplication_title_example">
					插入示例
				</view>
			</view>

			<template v-if="detailData.form.length > 0">
				<template v-for="(items,index) in detailData.form" :key="items.id">
					<template v-if="items.name == 'WidgetTextarea'">
						<view class="label">
							{{items.props.title}}
						</view>
						<view class="WidgetTextarea">
							<up-textarea v-model="" border="surround" :autoHeight="items.props.autoHeight" count
								:placeholder="items.props.placeholder" :maxlength="items.props.maxlength"></up-textarea>
						</view>
					</template>
				</template>
			</template>

		</view>
	</z-paging>
</template>

<script setup lang="ts">
	import { onMounted, reactive, ref } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { DetailDTO } from './type';
	const { $api } = useGlobalProperties()
	const detailData = ref<DetailDTO | {}>({})
	onLoad(async (query) => {
		if (query.id) {
			await getDetail(query.id)
		}
	})
	const getDetail = async (id : string) => {
		console.log(id)
		const DetailReq : { data : DetailDTO, code : number } = await $api.get('api/v1/nika/detail?id=590')
		if (DetailReq.code == 1) {
			detailData.value = DetailReq.data
		}

	}
</script>

<style lang="scss" scoped>
	.SingleApplication {
		&_title {
			display: flex;
			justify-content: space-between;

			&_name {
				font-size: 30rpx;
			}

			&_example {
				color: red;
				;
			}
		}
	}

	.WidgetTextarea {
		margin: 30rpx 0;
		border: 1rpx solid #ccc;
		border-radius: 10rpx;
	}
</style>