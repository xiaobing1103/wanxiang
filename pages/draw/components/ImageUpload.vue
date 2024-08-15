<template>
	<view class="ImageUploadCom">
		<view class="ImageUploadCom_content">
			<up-upload previewFullImage :customStyle="{width:'100%',height:'100%',padding:'20rpx',}" width="300"
				height="200" :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="3" :maxCount="1">
				<up-icon :custom-style="{justifyContent: 'center', display: 'block',width:'100%',textAlign:'center'}"
					name="photo-fill" size="100"></up-icon>
				<text class="ImageUploadCom_text">点击上传图片</text></up-upload>
		</view>
	</view>

</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { Image2TextParmas } from '../data';
	import { taskIdTypeKey } from '@/store/draw';
	import { fileToBase64, wxBase64 } from "@/utils/file2Base64"
	const props = defineProps<{ type : taskIdTypeKey }>()
	const parmas = defineModel<Image2TextParmas>("parmas");
	const fileList1 = ref([]);
	// 删除图片
	const deletePic = (event) => {
		fileList1.value.splice(event.index, 1);
	};
	// 新增图片
	const afterRead = async (event) => {
		// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
		let lists = [].concat(event.file);

		let fileListLen = fileList1.value.length;
		lists.map((item) => {
			fileList1.value.push({
				...item,
				status: 'uploading',
				message: '上传中',
			});
		});
		for (let i = 0; i < lists.length; i++) {
			const result = await uploadFilePromise(lists[i].url);
			let item = fileList1.value[fileListLen];
			fileList1.value.splice(fileListLen, 1, {
				...item,
				status: 'success',
				message: '',
				url: result,
			});
			fileListLen++;
		}
		if (fileList1.value[0].status == "success") {
			// #ifdef H5
			if (props.type == 'coloringLineArt_task_json') {
				fileToBase64(fileList1.value[0].file, (base64) => {
					parmas.value.image = base64
				})
			} else {
				parmas.value.image = fileList1.value[0].file
			}
			// #endif
			// #ifdef MP-WEIXIN
			debugger
			if (props.type == 'coloringLineArt_task_json') {
				const file = await wxBase64({ url: fileList1.value[0].url, type: 'png' })
				parmas.value.image = file
			} else {
				parmas.value.image = fileList1.value[0].file
			}
			// #endif

		}

	};

	const uploadFilePromise = (url) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(url);
			}, 2000);
		});
	};
</script>

<style lang="scss">
	.ImageUploadCom {
		padding: 25rpx 0 !important;
		width: 100%;
		height: 100%;

		&_content {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			position: relative;
			box-sizing: border-box;
			justify-content: center;
			box-shadow: 0 0 2rpx #ffffff80;
			border-radius: 10rpx;
			overflow: hidden;
			background-image: linear-gradient(45deg, #e6e6e6 25%, transparent 0, transparent 75%, #e6e6e6 0), linear-gradient(45deg, #e6e6e6 25%, transparent 0, transparent 75%, #e6e6e6 0);
			background-position: 0 0, 15rpx 15rpx;
			background-size: 30rpx 30rpx;
			border: #e4e4e4 2rpx solid;
		}

		&_text {
			width: 100%;
			display: block;
			text-align: center;
			color: $aichat-border-color;
			padding: 10rpx 0;
		}
	}
</style>