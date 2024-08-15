<template>
	<view class="ppt-con">
		<text class="description">
			 AI赋能,释放内容创造力，一键生成PPT.省去大量的时间,自动由人工智能驱动为你的主题/课题/论点生成大量:标题.大纲,子纲,要点,内容等,并自动生成一份简洁大气的PPT(可手动插入内容后由Ai帮你制造PPT演示文件)
		</text>
		<view class="create-type">
			<!-- 顶部切换 -->
			<view class="head">
				<text
					v-for="(item,index) in typeList" 
					@click="onTabChange(item)"
					:key="index" :class="['head-item',{'active-item':index == createEnum.TITLE}]">
					{{item.name}}
				</text>
			</view>
			<!-- 输入框 -->
			<view class="input-box">
				<u-textarea v-model="currentCreateItem.content"  :placeholder="currentCreateItem.placeholder"></u-textarea>
			</view>
			<!-- 开始按钮 -->
			<view class="btn">
				<u-button @click="onCreateContent" style="border-radius: 15rpx;height: 88rpx;" type="primary">第二步:开始生成内容</u-button>
			</view>
			<!-- 内容 -->
			<view v-if="contentStr" class="content">
				<u-textarea :maxlength="-1" :autoHeight="true" v-model="contentStr"></u-textarea>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref} from 'vue'
	import {useStreamHooks} from '@/hooks/useStreamHooks.ts'
	enum createEnum{
		'TITLE' = 'title',
		'CONTENT' = 'content'
	}
	interface TypeItem {
	  name: string;
	  key: createEnum;
	  btnText:string;
	  content:string;
	  placeholder:string;
	}
	const {streamRequest,isRecive} = useStreamHooks()
	//类型列表
	const typeList: Record<createEnum,TypeItem> = {
		[createEnum.TITLE]:{
			name: "主题由AI生成",
			key: createEnum.TITLE,
			btnText:'第二步:开始生成内容',
			content:"",
			placeholder:"请输入PPT主题,列如:运营岗位能力知识体系架构"
		},
		[createEnum.CONTENT]:{
			name: "有内容?内容梳理后生成",
			key: createEnum.CONTENT,
			btnText:'第二步:开始总结用户内容',
			content:"",
			placeholder:"你可以输入一片文章/演讲稿/新闻/报道/任意长的文字,AI会帮你整理该段文本,适配PPT演示格式"
		}
	}
	//发射事件
	const emit = defineEmits<{
		(e:'scrollToBottom'):void
	}>()
	//当前创建类型
	const currentCreateItem = ref<TypeItem>(typeList[createEnum.TITLE])
	
	// 导航栏切换
	const onTabChange = (item:TypeItem) =>{
		currentCreateItem.value = item
	}
	//当前输出的内容
	const contentStr = ref('')
	
	//开始生成内容
	const onCreateContent = () =>{
		const {key,content} = currentCreateItem.value
		const endContent = key == createEnum.TITLE ? `我的标题是:${content}` : `我的内容是:${content}`
		const params = [
			{
				role:'user',
				content:endContent,
			}
		]
		const data = {
			params:JSON.stringify(params),
			type:"Web-PPT生成内容",
			prompt:"我希望你根据我的标题生成文档，以下格式中 ## 为章节、###为大纲、####为小纲、- 为根据\"小纲\"补充的回答，必须对小纲进行回答，严格要求必须有2个以上章节，严格要求每个小纲必须有2个以上的回答，严格按照以下格式输出：\n\n# 标题\n\n## 1\n### 1.1\n#### 1.1.1\n- \n- \n\n#### 1.1.2\n- \n- \n\n#### 1.1.3\n- \n- \n\n### 1.2\n#### 1.2.1\n- \n- \n\n#### 1.2.2\n- \n- \n\n#### 1.2.3\n- \n- \n\n### 1.3\n#### 1.3.1\n- \n- \n\n#### 1.3.2\n- \n- \n\n#### 1.3.3\n- \n- \n\n## 2\n### 2.1\n#### 2.1.1\n- \n- \n\n#### 2.1.2\n- \n- \n\n#### 2.1.3\n- \n- \n\n### 2.2\n#### 2.2.1\n- \n- \n\n#### 2.2.2\n- \n- \n\n#### 2.2.3\n- \n- \n\n### 2.3\n#### 2.3.1\n- \n- \n\n#### 2.3.2\n- \n- \n\n#### 2.3.3\n- \n- \n\n## 3\n### 3.1\n#### 3.1.1\n- \n- \n\n#### 3.1.2\n- \n- \n\n#### 3.1.3\n- \n- \n\n### 3.2\n#### 3.2.1\n- \n- \n\n#### 3.2.2\n- \n- \n\n#### 3.2.3\n- \n- \n\n### 3.3\n#### 3.3.1\n- \n- \n\n#### 3.3.2\n- \n- \n\n#### 3.3.3\n- \n- \n\n\n## 4\n### 4.1\n#### 4.1.1\n- \n- \n\n#### 4.1.2\n- \n- \n\n#### 4.1.3\n- \n- \n\n### 4.2\n#### 4.2.1\n- \n- \n\n#### 4.2.2\n- \n- \n\n#### 4.2.3\n- \n- \n\n### 4.3\n#### 4.3.1\n- \n- \n\n#### 4.3.2\n- \n- \n\n#### 4.3.3\n- \n请严格按照我的设定回答"
		}
		streamRequest({
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage(text) {
				contentStr.value+=text
				emit('scrollToBottom')
			},
			onfinish() {
				console.log('成功')
			},
			onerror(err) {
				console.log(err,"错误")
			}
		})
	}
</script>

<style lang="scss" scoped>
	.ppt-con{
		.description{
			font-size: 24rpx;
			color: $uni-text-color-grey;
		}
		.create-type{
			padding-top: 40rpx;
			.input-box{
				margin-top: 60rpx;
				height: 300rpx;
				overflow: hidden;
				border-radius: 20rpx;
				border: 1px solid $uni-border-color;
			}
			.content{
				margin-top: 20rpx;
				min-height: 300rpx;
				border-radius: 20rpx;
				overflow: hidden;
				padding: 20rpx;
				border: 1px solid $uni-border-color;
			}
			.btn{
				margin-top: 20rpx;
			}
			.head{
				font-size: 32rpx;
				display: flex;
				gap: 30rpx;
				.head-item{
					position: relative;
				}
				.active-item{
					&::after{
						content: '';
						position: absolute;
						width: 50rpx;
						height: 6rpx;
						border-radius: 4rpx;
						bottom: -10rpx;
						left: 0;
						background-color: $uni-color-primary;
					}
				}
			}
		}
	}
</style>