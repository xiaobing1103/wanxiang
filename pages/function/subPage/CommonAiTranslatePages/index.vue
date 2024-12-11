<template>
	<z-paging :pagingStyle="{ background: 'rgb(246, 247, 249)'}" :show-scrollbar=" false">
		<template #top>
			<CommonHeader defindTitle="AI通用翻译" />
		</template>
		<view class="TranslatePages">
			<view class="uploadFileTranslate">
				<view class="uploadFileTranslate_top">
					<view class="uploadFileTranslate_left">
						自动检测源语言
					</view>
					<view class="uploadFileTranslate_middle">
						→
					</view>
					<view class="uploadFileTranslate_right" @click="changeLang">
						{{currentLang}} <up-icon :style="{margin:'0 10rpx'}" name="arrow-down" size="15"></up-icon>
					</view>
				</view>
				<view class="uploadFileTranslate_content">
					<view class="translateContent">
						<view class="translateContent_middle">
							<up-textarea height="200" class="translateContent_middle_content" v-model="textValue"
								placeholder="请输入或粘贴要翻译的内容" count maxlength="2000"></up-textarea>
						</view>
					</view>
				</view>
			</view>
			<view class="bottomView">
				<view class="bottomView_title">
					<text class="bottomView_title_text">定制翻译</text>
				</view>
			</view>
			<view class="seletedTypeBigBox">
				<view class="seletedTypeBox">
					<view class="seletedType" v-for="(items,index) in typeList" :key="index">
						<view class="seletedType_items" @click="changeShowPicker(items,index)">
							<text> {{newKeys[index]}}</text> <up-icon :customStyle="{margin:'0 6rpx'}" size="12"
								name="arrow-down"></up-icon>
						</view>
					</view>
				</view>
			</view>
			<view class="bottomView">
				<view class="bottomView_title">
					<text class="bottomView_title_text">翻译结果</text>
				</view>
			</view>

			<view class="Zero">
				<zero-markdown-view :markdown="msgContent" />
			</view>
		</view>
		<template #bottom>
			<view class="bottom">
				<up-button @click="onFetchChat" size="mini" shape="circle" :hairline="false" type="primary"
					:customStyle="{padding:'30rpx',fontSize:'27rpx',margin:'10rpx'}"
					class="bottom_button">立即翻译</up-button>
				<up-button @click="copy" size="mini" shape="circle" :hairline="false" type="primary"
					:customStyle="{padding:'30rpx',fontSize:'27rpx',margin:'10rpx'}"
					class="bottom_button">复制结果</up-button>
			</view>
		</template>
	</z-paging>

	<up-popup :show="openPopup" round="15" @open="openPopup = true" @close="openPopup = false">
		<view class="upPopupLayout">
			<view class="upPopup" v-for="(items,index) in languages" :key="index"
				@click="currentLang = items; openPopup = false">
				<text>{{items}}</text>
			</view>
		</view>
	</up-popup>
	<up-picker @cancel="showpicker= false" :show="showpicker" :columns="changeTypeList" @confirm="confirm"></up-picker>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { languages } from '../TranslatePages/type'
	import { reactive, ref } from 'vue';
	import { toCopyText, uploadFileBefore } from '@/utils';
	import { useUserStore, useChatStore } from '@/store';
	import { saveFile } from '../TranslatePages/downLoadLocal';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	const currentLang = ref('英文')
	const { streamRequest, isRecive } = useStreamHooks()
	const showpicker = ref(false)
	const ChatStore = useChatStore()
	const textValue = ref('')
	const currentType = ref('')
	const msgContent = ref(`👆请在上面输入要翻译的内容`)
	const openPopup = ref(false)
	const isTransLateLoading = ref(false)
	const { userInfo } = useUserStore()
	const { $api } = useGlobalProperties()
	// const { checkNumFun, checkSubmit } = useStreamHooks('fun_doc_translate')
	const changeLang = () => {
		openPopup.value = !openPopup.value
	}
	const changeTypeList = ref([])

	const changeShowPicker = (items : Array<string>, index : string) => {
		currentType.value = index
		changePromise(items).then((res) => {
			showpicker.value = true
		})

	}
	const confirm = ({ value }) => {
		console.log(currentType.value)
		console.log(value)
		newKeys[currentType.value] = value[0]
		showpicker.value = false
	}
	const currentTypeList = ref([])
	const changePromise = (items) => {
		return new Promise((resolve, reject) => {
			changeTypeList.value = [items]
			resolve()
		})
	}

	const copy = () => {
		toCopyText(msgContent.value, '复制翻译结果成功！')
	}
	const newKeys = reactive({
		'文本类型': '文本类型',
		'长度': '长度',
		'结构': '结构',
		'语言风格': '语言风格',
	});
	const typeList = reactive({
		'文本类型': ['通用', '学术论文', '生活', '邮件', '营销文案', '申请书', '小说'],
		'长度': ['简洁一些', '长一些'],
		'结构': ['合并短句', '拆分长句', '使用主句', '使用被动', '添加连接词', '多样化用词', '剔除复杂词', '补充细节', '结构简明'],
		'语言风格': ['地道口语', '书面表达', '幽默诙谐', '生动有趣', '专业正式', '现代风格', '传统风格'],
	})
	const onFetchChat = async (content ?: string) => {
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		const prompt = `你现在作为一个翻译师，请帮我将这该内容翻译为${currentLang.value},在这个过程中翻译方向主要是用于${newKeys['文本类型']},长度${newKeys['长度']},内容结构为${newKeys['结构']},并且语言风格是${newKeys['语言风格']}`
		const questions = [
			{
				role: 'user',
				content: textValue.value
			}
		]

		const data = {
			params: JSON.stringify(questions),
			prompt,
		}
		msgContent.value = ''
		const streamOptions = {
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage(text) {
				console.log(text)
				msgContent.value += text
			},
			onfinish() {
				console.log('成功')
			},
			onerror(err) {
				if (err.includes('请升级会员')) {
					ChatStore.setShowLevelUpVipContent(err)
					ChatStore.setShowlevelUpVip(true)
				}
				console.log(err, "错误")
			},
			checkNumsType: 'fun'
		}
		streamRequest(streamOptions)
	}
</script>

<style lang="scss">
	.TranslatePages {
		padding: 30rpx 0;
		display: flex;
		flex-direction: column;

		&_rightBox {
			flex: 1;
		}
	}

	.uploadFileTranslate {
		padding: 0 30rpx;
		display: flex;
		width: 100%;
		flex-direction: column;



		&_top {
			display: flex;
			text-align: center;
			justify-content: space-between;
			align-items: center;
		}

		&_left {
			padding: 10rpx;
			border-radius: 10rpx;
			border: 1rpx solid #ccc;
		}

		&_right {
			padding: 10rpx;
			border-radius: 10rpx;
			border: 1rpx solid #ccc;
		}

		&_middle {
			padding: 0 50rpx;

		}

		&_right {
			display: flex;
			align-items: center;
		}

		&_content {
			margin: 30rpx 0;
			border-radius: 15rpx;
		}
	}

	.upPopupLayout {
		padding: 30rpx;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	.upPopup {
		display: flex;
		justify-content: center;
		padding: 20rpx;
	}

	.translateContent {
		width: 100%;
		border: 1rpx #ccc solid;
		border-radius: 20rpx;
		overflow: hidden;

		&_top {
			padding: 20rpx 0;
			text-align: center;
		}

		&_middle {
			display: flex;

			&_content {}

			&_button {
				margin: 20rpx;
			}

			&_button2 {
				width: 50%;
				background-color: $aichat-border-color;
				margin: 20rpx;
				display: flex;
				align-items: center;
				color: white;
				border-radius: 10rpx;
				font-size: 27rpx;
			}
		}

		&_buttom {
			padding: 20rpx 0;
			font-size: 27rpx;

			&_items {
				padding: 10rpx 0;
			}
		}
	}

	.overlayBox {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.noData {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 500rpx;

		&_image {
			width: 100%;
			height: 400rpx;
		}

	}

	.bottomView {
		padding: 0 30rpx;

		&_title {
			display: flex;
			height: 100%;
			align-items: center;

			&::before {
				content: '';
				margin-right: 10rpx;
				display: block;
				height: 40rpx;
				border-radius: 10rpx;
				width: 10rpx;
				background-color: $aichat-border-color;
			}

			&_zero {
				border: 1rpx solid #ccc;
			}
		}

	}

	.seletedType {
		font-size: 27rpx;
		padding: 10rpx;
		border: 1rpx solid #ccc;
		border-radius: 15rpx;
		margin: 0 20rpx;

		&_items {
			display: flex;
			align-items: center;
		}
	}

	.seletedTypeBigBox {
		padding: 0 10rpx;

		margin: 30rpx 0;
		overflow: scroll;
	}

	.seletedTypeBox {
		display: flex;

		width: max-content;

	}

	.Zero {
		background-color: #fff;
		min-height: 400rpx;
		margin: 30rpx;
		padding: 15rpx;
		border-radius: 15rpx;
		border: 1rpx solid #ccc;
	}

	.bottom {
		margin: 30rpx;
		display: flex;

		&_button {

			// padding: \;
		}
	}
</style>