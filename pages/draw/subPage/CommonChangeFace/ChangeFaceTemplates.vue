<template>
	<view class="ChangeFaceTemplates">
		<view class="ChangeFaceTemplates_title">
			{{title}}
		</view>

		<view class="ChangeFaceTemplates_main">
			<view class="ChangeFaceTemplates_main_header">
				<up-tabs :current="current" scrollable :list="faceTems" @change="changeTem"></up-tabs>
			</view>
			<view class="ChangeFaceTemplates_main_content">
				<template v-for="(currents,index) in currentTems" :key="index">
					<image @click="seletedImages(currents)" class="ChangeFaceTemplates_main_content_images"
						:src="currents" mode="aspectFill"></image>
				</template>
			</view>
		</view>
	</view>

</template>

<script setup lang="ts">
	import { computed, ref } from 'vue';
	import { FaceImageTypes } from '../data';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	const current = ref<number>(0)
	const props = defineProps<{ faceTems : FaceImageTypes[], title : string }>()
	const currentTems = computed<string[]>(() => props.faceTems[current.value]?.data)
	const images = defineModel('images')

	const { $api } = useGlobalProperties()
	// 定义方法  
	const changeTem = (item : { data : string[], index : number, name : string }) => {
		current.value = item.index
	}

	const seletedImages = async (url : string) => {
		images.value = url
		// const base64Images = await $api.get(`api/v1/img/getbase64?url=${url}`)
		// if (base64Images.code == 200) {
		// 	images.value = base64Images.data
		// } else {
		// 	uni.$u.toast('设置图片错误请重试！');
		// }

	}
</script>

<style lang="scss">
	.ChangeFaceTemplates {
		padding: 25rpx;
		box-sizing: border-box;

		&_title {
			font-size: 30rpx;
			font-weight: 800;
		}


		&_main {
			&_header {
				display: flex;

				&_title {
					padding: 0 10rpx;
				}
			}

			&_content {
				display: grid;
				grid-template-columns: repeat(50, 2fr);
				overflow-x: scroll;

				&_images {
					width: 200rpx;
					height: 200rpx;
					margin: 10rpx;
					overflow: hidden;
					border-radius: 20rpx;
					box-sizing: border-box;
				}
			}

		}
	}
</style>