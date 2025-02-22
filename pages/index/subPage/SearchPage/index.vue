<template>
	<z-paging fixed ref="srollRef" safe-area-inset-bottom :show-scrollbar="false" :pagingStyle="{
	  // backgroundImage:`url(${$assets.OverBGImage})`, 
	  backgroundRepeat: 'repeat',
	  padding: '0',
	  backgroundSize: 'cover',
	  backgroundPosition: '-491px 0px'
	}">
		<template #top>
			<view class="SearchPage">
				<view class="headerItems" :style="{marginTop: ScreenStore.navBarHeight + 'px' }">
					<up-icon @click="backPages" class="OverSearchBox_icon" name="arrow-left" size="20"></up-icon>
					<view class="OverSearchBox">
						<textarea :adjust-position="false" cursor-spacing="100rpx" :show-confirm-bar="false" auto-height
							disable-default-padding
							:style="{ margin:'10rpx' , overflow: 'scroll', maxHeight:'50rpx', padding:'0rpx', fontSize:'30rpx', width:'100%'}"
							maxlength="17" placeholder="请输入关键字" border="surround" v-model="searchValue"></textarea>
					</view>
					<up-icon class="OverSearchBox_icon" name="search" size="20"></up-icon>
				</view>
			</view>
			<view class="BixSearchPageMain">
				<view class="BixSearchPageMain_tabbar">
					<template v-for="(items,index) in tabbarDatas" :key="index">
						<view @click="changeTabbar(items.title)" class="BixSearchPageMain_tabbar_items">
							{{items.title}}
							<view
								:style="{backgroundColor:deaultTabbar == items.title ? 'rgb(73, 85, 245)':'rgb(0, 0, 0,0)'}"
								class="BixSearchPageMain_tabbar_lines">
							</view>
						</view>
					</template>
				</view>
			</view>
		</template>
		<view class="BixSearchPage">
			<view class="BixSearchPageMain">
				<template v-if="deaultTabbar == 'AI模型'">
					<view class="SearchAiModel">
						<template v-for="(items,key)  in filteredData" :key="key">
							<view class="items" @click="changeModel(key)">
								<view class="ImageBox">
									<image class="icon" :src="items.modelIcon" mode=""></image>
								</view>
								<view class="modelName">
									{{items.title}}
								</view>
							</view>
						</template>
					</view>
				</template>
				<template v-if="deaultTabbar == 'AI功能'">
					<view class="SearchAiFeatures">
						<template v-for="(items, category) in filteredData" :key="category">
							<!-- <view class="category-title">{{category}}</view> -->
							<view class="items-container">
								<template v-for="item in items" :key="item.title">
									<view class="items" @click="topath(item.path) ">
										<view class="ImageBox">
											<image class="icon" :src="item.cover" mode=""></image>
										</view>
										<view class="feature-content">
											<view class="feature-title">{{item.title}}</view>
											<!-- <view class="feature-desc">{{item.description}}</view> -->
										</view>
									</view>
								</template>
							</view>
						</template>
					</view>
				</template>
				<template v-if="deaultTabbar == '对话记录'">
					<view class="SearchChatHistory">
						<template v-for="chat in filteredData" :key="chat.id">
							<view class="chat-item">
								<view class="chat-item-main" @click="viewChatDetail(chat)">
									<view class="chat-icon">
										<image :src="chat.iconUrl" mode="aspectFit"></image>
									</view>
									<view class="chat-content">
										<view class="chat-title">{{ chat.title }}</view>
										<view class="chat-model">{{ chat.model }}</view>
									</view>
								</view>
								<view class="chat-actions">
									<view @click.stop="editChatTitle(chat)" class="action-btn">
										<up-icon name="edit-pen" size="20" class="action-icon"></up-icon>
									</view>
									<view @click.stop="deleteChat(chat.id)" class="action-btn">
										<up-icon name="trash" size="20" class="action-icon"></up-icon>
									</view>
								</view>
							</view>
						</template>

						<view v-if="filteredData.length === 0" class="empty-state">
							<text>暂无对话记录</text>
						</view>
					</view>
				</template>

			</view>
		</view>
	</z-paging>
</template>


<script setup lang="ts">
	import { computed, reactive, ref } from 'vue';
	import { useChatStore, useScreenStore } from '@/store';
	import { commonModel } from '@/config/modelConfig';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	const searchValue = ref('')
	const ScreenStore = useScreenStore()
	const deaultTabbar = ref('AI模型')
	const { $assets } = useGlobalProperties()
	const newMenuLists = reactive({
		"AI论文": [
			{
				cover: $assets.artistWriteIcon,
				title: 'AI论文模式',
				description: '使用本模式后可以写出非常优秀、领域性的文章，例如可用于论文、研究报告、学术论坛、学术文章、科学研究、学术期刊',
				path: '/pages/function/subPage/ArtistWrite/index'
			},
			{
				cover: $assets.aixz_cover,
				title: 'AI长论文写作',
				description: '千字大纲，万字毕业课题论文',
				path: '/pages/function/subPage/longText/index'
			},
		],
		'AI写作': [
			{
				cover: $assets.officeWriteIcon,
				title: '公文写作',
				description: '公文写作是机关最重要的工作之一。公文是传达政令的重要工具，是实施决策和指导工作的重要载体，AI能够在此基础上提供一定的帮助，但也不能作为最终成果发布。',
				path: '/pages/function/subPage/OfficeWrite/index'
			},

			{
				cover: $assets.wzyh_cover,
				title: 'AI文章纠正',
				description: 'AI帮你纠正语句错误,优化内容',
				path: '/pages/function/subPage/AiarticleReset/index'
			},
			{
				cover: $assets.AImappingPreview,
				title: 'AIGC检测',
				description: '文章查重、文章降重、文章检测',
				path: '/pages/function/subPage/ArtistTest/index'
			},
			{
				cover: $assets.ArtistDownIdon,
				title: '智能降AIGC',
				description: '文章查重、文章降重、文章检测',
				path: '/pages/function/subPage/ArticlePlagiarism/index'
			},
			{
				cover: $assets.AIWriteSomething,
				title: 'AI智能写作',
				description: 'AI智能写作，你的创作神器',
				path: '/pages/function/subPage/AIWriteSomething/index'
			},
			{
				cover: $assets.AIzhaiYaoIcon,
				title: 'AI关键词提取',
				description: '提取文章中的关键词，关键字',
				path: '/pages/function/subPage/importantTextExport/index'
			},
			{
				cover: $assets.AIThesamePointIcon,
				title: '相似度检测',
				description: '检测两段文字的相似度',
				path: '/pages/function/subPage/TheSamePointTest/index'
			},
			{
				cover: $assets.InspiredWritingIcon,
				title: '灵感写作',
				description: 'AI赋予你不一样的写作灵感',
				path: '/pages/function/subPage/InspiredWriting/index'
			},
			{
				cover: $assets.articleWritingIcon,
				title: '写作助手',
				description: '你的最佳写作帮手',
				path: '/pages/function/subPage/articleWriting/index'
			},
			{
				cover: $assets.createTitleIcon,
				title: '标题生成',
				description: 'AI帮你生成文章标题',
				path: '/pages/function/subPage/createTitle/index'
			},
		],
		'AI文档': [
			{
				cover: $assets.ppt_cover,
				title: '一键生成PPT',
				description: '海量PPT末班任你选择',
				path: '/pages/function/subPage/ppt/index'
			},
			{
				cover: $assets.swdt_cover,
				title: 'AI思维导图',
				description: '理解重点,生成可视化思维导图',
				path: '/pages/function/subPage/AImapping/index',
			},
			{
				cover: $assets.gzzj_cover,
				title: 'AI工作总结',
				description: '超实用,AI帮写周报月报总结',
				path: '/pages/function/subPage/AiDailyModel/index'
			},
			{
				cover: $assets.wddh_cover,
				title: 'AI文档对话',
				description: '通过Ai对话快速获取文档信息',
				path: '/pages/function/subPage/AidocumentChat/index'
			},
			{
				cover: $assets.ORCPageIcon,
				title: 'OCR-DOC办公文档识别',
				description: '可对办公类文档的版面进行分析，输出图、表、标题、文本、目录、栏、页眉、页码、和脚注的位置，并输出 分版块内容的OCR识别结果，支持中、英两种语言，手写、印刷体混排多种场景',
				path: '/pages/function/subPage/AiORCModel/index'
			},
		],
		'AI翻译': [

			{
				cover: $assets.TranslatePagesIcon,
				title: 'AI文档翻译',
				description: '由人工智能提取信息后翻译',
				path: '/pages/function/subPage/TranslatePages/index'
			},
			{
				cover: $assets.translate20,
				title: 'AI文档翻译2.0',
				description: '由人工智能提取信息后翻译',
				path: '/pages/function/subPage/TranslatePages/TranslatePages20'
			},
			{
				path: '/pages/function/subPage/CommonAiTranslatePages/index',
				title: 'AI翻译通用',
				description: '由人工智能提取信息后翻译',
				cover: $assets.AiTranslateIcon
			},
			{
				path: '/pages/function/subPage/OldArticelTranslate/index',
				title: '文言文翻译',
				description: '通过文言文和白话文之间相互翻译',
				cover: $assets.oldTranslateIcon,
			},
			{
				path: '/pages/function/subPage/AiVioceTranslate/index',
				title: 'AI录音翻译',
				description: '直接录音或者上传文件方式进行翻译',
				cover: $assets.AiVioceTrasnlate,
			},
			{
				path: '/pages/function/subPage/AiImageTranslate/index',
				title: 'AI图像翻译',
				description: '对图片文件方式进行直接翻译',
				cover: $assets.AiImageTranslate,
			},
			{
				path: '/pages/function/subPage/ArticelTranslate/index',
				title: '论文翻译',
				description: '对论文进行翻译',
				cover: $assets.ArticleTranslate,
			},
			{
				path: '/pages/function/subPage/ZhArticelTranslate/index',
				title: '中文学术翻译',
				description: '对中文论文进行翻译',
				cover: $assets.lunWenXueShuTranslate,
			},

			{
				path: '/pages/function/subPage/EnArticelTranslate/index',
				title: '英文学术翻译',
				description: '对英文论文进行翻译',
				cover: $assets.enXueShuTranslate,
			},
		],
		"AI语音": [
			{
				cover: $assets.AiVioceCreateIcon,
				title: 'AI真人语音合成',
				description: '高拟真度、灵活配置的语音合成产品，打通人机交互的闭环，让应用逼真发声。多种角色可供选择，并提供调节语速、语调、音量等功能',
				path: '/pages/function/subPage/AiVioceCreate/index'
			},

		],
		"AI音乐": [
			{
				cover: $assets.AImusicBackIcon,
				title: 'AI音乐',
				description: '自定义创作歌曲,发挥你的想象力。',
				path: '/pages/function/subPage/AiMusicCreate/index?currentPages=0'
			},
			{
				cover: $assets.AIZidongCreateSong,
				title: 'AI自动作曲',
				description: '自定义创作歌曲,发挥你的想象力。',
				path: '/pages/function/subPage/AiMusicCreate/index?currentPages=1'
			},
			{
				cover: $assets.AIMyCreateSong,
				title: '我的创作',
				description: '自定义创作歌曲,发挥你的想象力。',
				path: '/pages/function/subPage/AiMusicCreate/index?currentPages=2'
			},
			{
				cover: $assets.MusicSquare,
				title: '音乐广场',
				description: '用户使用ai创作后，上传的优质音乐',
				path: '/pages/function/subPage/MusicSquare/index'
			}
		],
		"AI视频": [
			{
				cover: $assets.text2videoIcon,
				title: '文生视频',
				description: '对标(sora,科灵,Pica)',
				path: '/pages/function/subPage/TextCreateVideo/index?currentPages=0'
			},
			{
				cover: $assets.image2videoIcon,
				title: '图生视频',
				description: '对标(sora,科灵,Pica)',
				path: '/pages/function/subPage/TextCreateVideo/index?currentPages=1'
			},
			{
				cover: $assets.AINumersPeopleBgImage,
				title: 'AI数字人',
				description: '仅需图片即可生成数字人动态口播视频',
				path: '/pages/function/subPage/TextCreateVideo/AINumersPeople/index'
			},
			{
				cover: $assets.AIVideoHandlerImageBgImage,
				title: 'AI视频抠图',
				description: '一键视频抠图合成视频',
				path: '/pages/function/subPage/TextCreateVideo/AIVideoHandlerImage/index'
			},
			{
				cover: $assets.AIExtractMusicImageBgImage,
				title: 'AI提取音频',
				description: '一键提取视频中的音频',
				path: '/pages/function/subPage/TextCreateVideo/AIExtractMusic/index'
			},
		]
		, 'AI应用': [
			{
				cover: $assets.aiApplication,
				title: 'AI应用中心',
				description: 'AI应用智能创作中心',
				path: '/pages/function/subPage/AIApplication/index'
			},
		]
	})
	const chatStore = useChatStore()
	const tabbarDatas = [
		{
			title: 'AI模型',

		},
		{
			title: 'AI功能',

		},
		{
			title: '对话记录',

		},
	]
	const topath = (url : string) => {
		uni.navigateTo({
			url
		})
	}
	const changeModel = (modelKey : string) => {
		chatStore.setModel(modelKey)
		uni.navigateTo({
			url: '/pages/index/subPage/AllChatPage/index',
		})
	}
	const changeTabbar = (title : string) => {
		deaultTabbar.value = title
	}

	const filteredData = computed(() => {
		const keyword = searchValue.value.toLowerCase().trim()

		switch (deaultTabbar.value) {
			case 'AI模型':
				return Object.entries(commonModel).filter(([key, model]) =>
					!keyword ||
					model.title.toLowerCase().includes(keyword) ||
					model.modelDesc?.toLowerCase().includes(keyword)
				).reduce((acc, [key, value]) => {
					acc[key] = value
					return acc
				}, {})

				if (!keyword) return newMenuLists
				return Object.entries(newMenuLists).reduce((acc, [category, items]) => {
					const filteredItems = items.filter((item : any) =>
						item.title.toLowerCase().includes(keyword) ||
						item.description.toLowerCase().includes(keyword)
					)
					if (filteredItems.length > 0) {
						acc[category] = filteredItems
					}
					return acc
				}, {})

			case 'AI功能':
				// 如果没有关键字，返回所有菜单
				if (!keyword) return newMenuLists

				// 有关键字时，过滤菜单
				return Object.entries(newMenuLists).reduce((acc : any, [category, items]) => {
					const filteredItems = (items as any[]).filter(item =>
						item.title.toLowerCase().includes(keyword) ||
						item.description.toLowerCase().includes(keyword)
					)
					if (filteredItems.length > 0) {
						acc[category] = filteredItems
					}
					return acc
				}, {})
			case '对话记录':
				return chatStore.chats.filter(chat =>
					!keyword ||
					chat.title.toLowerCase().includes(keyword)
				)


			default:
				return []
		}
	})

	// 修改对话标题
	const editChatTitle = (chat : any) => {
		if (chatStore.loadingMessage) {
			uni.$u.toast('请等待消息回复完成...')
			return
		}

		uni.showModal({
			title: '修改标题',
			editable: true,
			placeholderText: '请输入新标题',
			content: chat.title,
			success: (res) => {
				if (res.confirm && res.content) {
					chatStore.updateChatTitle(chat.id, res.content)
				}
			}
		})
	}

	// 删除单条对话
	const deleteChat = (chatId : string) => {
		if (chatStore.loadingMessage) {
			uni.$u.toast('请等待消息回复完成...')
			return
		}

		uni.showModal({
			title: '提示',
			content: '确定要删除这条对话记录吗？',
			success: (res) => {
				if (res.confirm) {
					chatStore.delChats(chatId)
				}
			}
		})
	}

	// 查看对话详情
	const viewChatDetail = (chat : any) => {
		chatStore.setModel(chat.model)
		chatStore.changeSelectChatId(chat.id)
		uni.navigateTo({
			url: '/pages/index/subPage/AllChatPage/index',
		})
	}
	const backPages = () => {
		uni.navigateBack()
	}
</script>

<style lang="scss" scoped>
	.BixSearchPage {
		display: flex;
		flex-direction: column;
		width: 100%;

	}

	.BixSearchPageMain {

		width: 100%;

		padding: 0 30rpx;
		margin: 50rpx 0;
		font-weight: 800;

		&_tabbar {
			display: flex;
			justify-content: space-between;


			&_items {
				padding: 0 30rpx;
			}

			&_lines {
				height: 4rpx;
				width: 100%;
				background-color: rgb(73, 85, 245);
				margin-top: 10rpx;

			}
		}
	}

	.SearchPage {
		.headerItems {
			display: flex;
			align-items: center;
			padding: 0 10rpx;

			.OverSearchBox {
				display: flex;
				border-bottom: 4rpx solid #888;
				// border-radius: 15rpx;
				width: 100%;
				justify-content: space-between;
				align-items: center;
				padding: 10rpx;
				// background-color: white;

				.placeHolder {
					flex: 1;
					display: flex;
					color: rgb(191, 191, 191);
					height: 50rpx;
					font-size: 28rpx;
					align-items: center;
				}

				&_icon {
					padding: 0 10rpx;

				}
			}
		}

	}


	.SearchAiModel {
		.items {
			display: flex;
			margin: 20rpx 0;
			align-items: center;
			font-size: 28rpx;

			.ImageBox {
				border: 1rpx solid #ccc;
				padding: 10rpx;
				border-radius: 20rpx;
			}

			.icon {
				height: 70rpx;
				width: 70rpx;
			}

			.modelName {
				margin-left: 30rpx;
			}
		}
	}

	.SearchAiFeatures {
		.category-title {
			font-size: 32rpx;
			font-weight: bold;
			margin: 30rpx 0 20rpx;
		}

		.items-container {
			.items {
				display: flex;
				align-items: center;
				padding: 20rpx;
				margin-bottom: 20rpx;
				// background: #fff;
				border-radius: 16rpx;

				.ImageBox {
					width: 80rpx;
					height: 80rpx;
					margin-right: 20rpx;

					.icon {
						width: 100%;
						height: 100%;
						border-radius: 16rpx;
					}
				}

				.feature-content {
					flex: 1;

					.feature-title {
						font-size: 28rpx;
						font-weight: bold;
						margin-bottom: 8rpx;
					}

					.feature-desc {
						font-size: 24rpx;
						color: #666;
					}
				}
			}
		}
	}

	.SearchChatHistory {
		padding: 20rpx 0;

		.chat-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;
			margin-bottom: 20rpx;
			background: #fff;
			border-radius: 16rpx;
			border: 2rpx solid #eaeaee;

			&-main {
				flex: 1;
				display: flex;
				align-items: center;
			}

			.chat-icon {
				width: 60rpx;
				height: 60rpx;
				margin-right: 20rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 8rpx;
				}
			}

			.chat-content {
				flex: 1;

				.chat-title {
					font-size: 28rpx;
					font-weight: bold;
					margin-bottom: 8rpx;
					width: 400rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.chat-model {
					font-size: 24rpx;
					color: #666;
				}
			}

			.chat-actions {
				display: flex;
				gap: 20rpx;

				.action-icon {
					padding: 10rpx;
					color: #666;

					&:active {
						opacity: 0.7;
					}
				}
			}
		}

		.empty-state {
			text-align: center;
			padding: 40rpx;
			color: #999;
			font-size: 28rpx;
		}
	}
</style>