<template>
	<z-paging>
		<!-- #ifdef H5 -->
		<template #top>
			<CommonHeader defindTitle="隐私协议" />
		</template>
		<!-- #endif -->

		<view class="UserAgreement">
			<web-view :fullscreen="!isH5" class="UserAgreement_main" src="https://gpt.53at.com/privacy-agreement.txt"
				frameBorder="0" />
		</view>
	</z-paging>

</template>

<script setup lang='ts'>
	import {
		onMounted,
		ref
	} from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue'
	const isH5 = ref(false)
	onMounted(() => {
		// 	// #ifdef H5
		// 	isH5.value = true
		// 	// #endif
		// })
		// const webviewStyles = ref({
		// 	progress: {
		// 		color: '#FF3333',

		// 	},
		// 	width: '100vw',
		// 	height: '100vh'



	})
</script>

<style lang="scss" scoped>
	.UserAgreement {
		width: 100%;
		height: 1200rpx;

		&_main {
			width: 100%;
			height: 100%;

			iframe {
				width: 100% !important;
				height: 100% !important;
			}
		}
	}
</style>