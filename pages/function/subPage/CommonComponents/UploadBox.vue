<template>
	<view class="uploadBox">
		<up-upload :customStyle="{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}"
			:fileList="fileList1" @afterRead="afterRead" name="4" multiple accept="all" :maxCount="1">
			<view class="uploadBoxmain">
				<view class="uploadBoxmain_title">
					<view class="uploadBoxmain_title_image" v-for="(items,index)  in publicMethods.uploadImageSrc"
						:key="index">
						<image class="uploadBoxmain_title_image_items" :src="items" mode=""></image>
					</view>
				</view>
				<view class="uploadBoxmain_desc">
					支持pdf, txt, docx, pptx, excel 等格式编码的文件
				</view>
				<view class="uploadBoxmain_elseDesc">
					(部分音频内容比较多,可能Ai无法理解)
				</view>
				<view class="uploadBoxmain_button">
					<up-button size="mini" :customStyle="{width:'50%',borderRadius:'15rpx',height:'50rpx'}"
						type="primary">点击上传文档</up-button>
				</view>
			</view>
		</up-upload>
	</view>

</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
</style>