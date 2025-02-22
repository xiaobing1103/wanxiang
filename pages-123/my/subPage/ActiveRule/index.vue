<template>
	<z-paging :pagingStyle="{ background: 'rgb(246, 247, 249)',
		backgroundImage:'url(http://file.1foo.com/2024/10/14/4a280259e65335bb282318abbd51f889.png)', 
		backgroundRepeat: 'no-repeat',
		padding: '0 30rpx' ,
		backgroundSize: 'cover',
		backgroundPosition: '-700rpx -613rpx'
		}">
		<template #top>
			<CommonHeader noBackGround defindTitle="活动规则" noRenderLastModal />
		</template>
		<view class="overRule">
			{{ScreenStore.lastDayDatas.rule}}
		</view>

	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	import { onMounted } from 'vue';
	import { useScreenStore } from '@/store'
	const ScreenStore = useScreenStore()
	onMounted(() => {

	})
</script>

<style lang="scss" scoped>
	.overRule {
		padding: 20rpx 0;
		white-space: pre-line;
		font-size: 27rpx;
	}
</style>