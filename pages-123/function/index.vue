<template>
	<z-paging :show-scrollbar="false">
		<template #top>
			<CommonHeader />
		</template>
		<view class="TranslatePages">
			<LeftMenus :currentProject="currentProject" @ChangeProJect='ChangeProJect' />
			<view class="TranslatePages_rightBox">
				<template v-if="newMenuLists[currentProject]?.length> 0">
					<view class="TranslatePages_rightBox_items" v-for="(items,index) in newMenuLists[currentProject]"
						@click="toPage(items,items?.id)" :key="index">
						<view class="TranslatePages_rightBox_items_left">
							<image class="TranslatePages_rightBox_items_left_image" :src="items.cover"
								mode="aspectFill">
							</image>
						</view>
						<view class="TranslatePages_rightBox_items_right">
							<view class="TranslatePages_rightBox_items_right_content">
								<view class="TranslatePages_rightBox_items_right_content_top">
									{{items.title}}
								</view>
								<view class="TranslatePages_rightBox_items_right_content_buttom">
									{{items.description}}
								</view>
							</view>
						</view>
					</view>
				</template>

				<template v-else>
					<view class="TranslatePages_rightBox">
						<view class="noData">
							<image class="noData_image" :src="$assets.noData" mode=""></image>
						</view>
					</view>
				</template>
			</view>
		</view>
		<template #bottom>
			<m-tabbar native safeBottom>
				<template v-slot:tabbar_index_2>
					<view class="custom_style">
						<view class="custom_style_icon">
							<image class="custom_style_icon_image" :src="$assets.DeepSeekModelIcon" mode=""></image>
							<image class="custom_style_icon_hotimage" :src="$assets.IndexHotIcon" mode=""></image>
						</view>
					</view>
				</template>
			</m-tabbar>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue'
	import AiAgentTemplate from './subPage/AIaiAgent/aiAgentTemplate'
	import LeftMenus from './LeftMenus.vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks'
	import { ref, reactive } from 'vue';
	import { useAiAgentChats } from '@/store';
	const currentProject = ref('AI智能体')
	const { $assets, $api } = useGlobalProperties()
	const imgConfig = {
		"论文辅助": $assets.Application2,
		"文章创作": $assets.Application3,
		"文案策划": $assets.Application4,
		"生活助手": $assets.Application5,
		"编程开发": $assets.Application6,
		"商业文书": $assets.Application7,
		"工作助手": $assets.Application8,
		"新媒体运营": $assets.Application9,
		"科教百科": $assets.Application10,
		"企业服务": $assets.Application11,
		"电商运营": $assets.Application12,
		"法律服务": $assets.Application13,
		"旅游攻略": $assets.Application14,
		"教学辅助": $assets.Application15,
		"经史典籍": $assets.Application16,
		"软件使用": $assets.Application17,
		"休闲娱乐": $assets.Application18,
		"学习辅导": $assets.Application19,
		"医疗健康": $assets.Application20,
		"占星问卜": $assets.Application21,
		"实用工具": $assets.Application22,
		"其他应用": $assets.Application23,
		"文创工具": $assets.Application24,

	}
	const toPage = (item, id : number) => {
		if (id) {
			uni.navigateTo({
				url: '/pages/function/subPage/AIApplication/index?id=' + item.id
			})
			return
		}

		if (!item.path) {
			uni.$u.toast('尚未开放')
			return
		}
		uni.navigateTo({
			url: item.path
		})
	}

	const ChangeProJect = async (val : string) => {
		if (val == 'AI应用') {
			await getAiApplication(val)
		}
		currentProject.value = val
	}
	const getAiApplication = async (index : string) => {
		const categoryListsReq = await $api.get('api/v1/nika/categoryLists')
		if (categoryListsReq.code == 1) {
			const newData = categoryListsReq.data.slice(2).map((items, dex) => {
				items.title = items.name
				if (imgConfig[items.name]) {
					items.cover = imgConfig[items.name]
				} else {
					items.cover = $assets.artistWriteIcon
				}
				items.description = 'AI应用创作，你的创作得力助手'
				return items

			})
			newMenuLists[index] = [...newMenuLists[index], ...newData]
			console.log(newMenuLists)
		}
	}
	const AiAgentChats = useAiAgentChats()
	const newMenuLists = reactive({
		"AI智能体": [
			...AiAgentChats.agentMenus
		],
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
</script>
<style lang="scss" scoped>
	.TranslatePages {
		padding: 30rpx 0;
		display: flex;
		max-width: 100vw;
		min-width: 100vw;
		width: 100vw;

		&_rightBox {
			flex: 1;
			width: 80vw;

			&_items {
				display: flex;
				padding: 20rpx;
				align-items: center;

				&_left {
					&_image {
						width: 200rpx;
						height: 150rpx;
						overflow: hidden;
						border-radius: 20rpx;
					}
				}

				&_right {
					flex: 1;
					padding: 20rpx;

					&_content {
						&_top {
							font-weight: 800;
							width: 300rpx;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}

						&_buttom {
							font-size: 27rpx;
							color: #888;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
					}
				}
			}
		}
	}

	.noData {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;

		&_image {
			width: 100%;
			height: 400rpx;
			padding: 50% 0;
		}

	}

	.custom_style {
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;

		&_icon {
			// font-size: 80rpx;
			width: 90rpx;
			height: 90rpx;
			border-radius: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			// margin-top: -40rpx;
			&_image {
				width: 98rpx;
				height: 70rpx;
			}

			&_hotimage {
				position: absolute;
				width: 32rpx;
				height: 20rpx;
				right: -20rpx;
				top: -5rpx;
			}
		}
	}
</style>