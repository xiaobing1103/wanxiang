<template>
	<z-paging :scroll-with-animation="true" :show-scrollbar="false" ref="pagingRef" :pagingStyle="{padding:'24rpx'}">
		<template #top>
			<CommonHeader defindTitle="AI工作总结" />
		</template>
		<view class="ppt-con">
			<view class="create-type">
				<view class="create-type_header">
					<image class="create-type_header_image"
						src="http://file.1foo.com/2024/08/29/81eb525913b77b5dbe01588186b8564b.png" mode=""></image>
					请简单描述你的工作内容
				</view>
				<view class="input-box">
					<textarea class="input-box_textarea" autoHeight ref="textareaRef" height="200" v-model="value"
						placeholder="例如:完成了项目的ppt介绍,送了三天外卖"></textarea>
				</view>
				<view class="create_types">
					<view class="create_types_header">
						生成类型：
					</view>
					<view class="create_types_header_changes">
						<up-radio-group v-model="radiovalue1" placement="row">
							<up-radio :customStyle="{marginRight :'8px'}" v-for="(item, index) in radiolist1"
								:key="index" :label="item.name" :name="item.name">
							</up-radio>
						</up-radio-group>
					</view>
					<view class="create_types_header_carcer">
						<text>我的职业：</text>
						<view class="create_types_header_carcer_input">
							<up-input v-model="career" :customStyle="{height:'50rpx',fontSize:'20rpx'}"
								placeholderClass="placeClass" :placeholderStyle="{ fontSize:'20rpx' }"
								class="create_types_header_carcer_input_int" type="text"
								placeholder="请输入你的职业,生成效果会更好" />
						</view>
					</view>

					<view class="create_types_header_carcer">
						<text>生成字数：</text>
						<view class="create_types_header_carcer_nums" @click="show = true">
							<text class="create_types_header_carcer_nums_text">{{seletedNums}} 字</text> <up-icon
								name="arrow-down"></up-icon>
						</view>
					</view>

					<text class="create_types_header_desc">（AI无法具体字数，只能大概的字数，建议生成完成自行再检查）</text>
				</view>


				<view class="btn">
					<u-button :customStyle="{height:'60rpx', borderRadius:'25rpx',width:'80%'}" class="bth_content"
						:disabled="isRecive" @click="onCreateContent" type="primary">生成报告</u-button>
				</view>

				<view class="btn">
					<u-button :customStyle="{height:'60rpx', borderRadius:'25rpx',width:'80%'}" class="bth_content"
						:disabled="isRecive" @click="exportFile">导出</u-button>
				</view>
			</view>
		</view>


		<view class="AiDailyModel_footer">
			<text class="AiDailyModel_footer_content">特别说明：本页面的所有文章内容为概率模型所生成，同一标题每次点击 “生成”
				将会产生不同内容。生成内容不代表本应用的观点和立场</text>
		</view>
	</z-paging>
	<up-popup v-model:show="show" round="15">
		<view class="overPopup">
			<view class="overPopup_header">
				请选择
			</view>
			<view class="overPopup_main" v-for="(items,index) in numList" :key="index" @click="changeNums(items)">
				<text>{{items}} 字</text>
			</view>
		</view>

	</up-popup>

</template>

<script setup lang="ts">
	import { ref, nextTick, reactive, onMounted } from 'vue'
	import CommonHeader from '@/components/CommonHeader.vue'

	import { useStreamHooks } from '@/hooks/useStreamHooks'
	import { debounce, exportTxt } from '@/utils';
	const show = ref(false)
	const seletedNums = ref(150)
	const changeNums = (nums : number) => {
		seletedNums.value = nums
		show.value = false
	}
	const textareaRef = ref(null);
	const career = ref('')
	const value = ref('')
	const numList = ref([100, 150, 200, 250, 300, 350, 400, 450, 500])
	const radiovalue1 = ref('日报');
	const radiolist1 = reactive([
		{
			name: '日报',
			disabled: false,
		},
		{
			name: '周报',
			disabled: false,
		},
		{
			name: '月报',
			disabled: false,
		},
	]);

	const exportFile = () => {
		if (value.value) {
			exportTxt(value.value);
		}
	}
	const { streamRequest, isRecive } = useStreamHooks()
	const pagingRef = ref()
	//滚动到底部
	const onScroolToBottom = debounce(() => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
		})
	}, 500)
	//开始生成内容
	const onCreateContent = () => {
		if (!value.value) {
			uni.$u.toast('请输入内容！')
			return
		}
		if (!career.value) {
			uni.$u.toast('请输入职业！')
			return
		}
		const params = [
			{
				role: 'user',
				content: `我的职业是 ${career.value} 我今天的工作内容是 ${value.value}。帮我写一个 ${seletedNums.value} 字左右的日报`
			}
		]
		const data = {
			params: JSON.stringify(params),
			type: "Web-日报周报月报生成器",
			prompt: `角色：工作${radiovalue1.value}助手\n" +
        "能力：你可以根据我给的工作内容，以我的名义写出详细的工作日报。\n" +
        "输出格式：\n" +
        "\n" +
        "## 今日工作内容：\n" +
        "丰富描述和润色我的工作内容，让其看上去显得做了很多很重要的工作。\n" +
        "\n" +
        "## 明日工作计划：\n" +
        "根据今日工作内容推断明日要做的工作计划，并拆解成5个以上的工作任务。\n" +
        "\n" +
        "## 遇到的问题与解决方案：\n" +
        "请自行推理，尽量丰富点\n" +
        "\n" +
        "## 今日心得总结：\n" +
        "请自行推理，尽量丰富点\n" +
        "\n" +
        "回答身份：始终以工作日报助手的口吻回答我的任何问题。`
		}
		value.value = ''
		streamRequest({
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage(text) {
				value.value += text
				onScroolToBottom()
			},
			onfinish() {
				console.log('成功')
			},
			onerror(err) {
				console.log(err, "错误")
			}
		})
	}
</script>

<style lang="scss" scoped>
	::v-deep .placeClass {
		font-size: 25rpx;
	}

	.head {
		font-size: 32rpx;
		display: flex;
		width: 100%;
		gap: 30rpx;
		margin: 40rpx 0;

		.head-item {
			position: relative;
		}

		.active-item {
			&::after {
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

	.description {
		font-size: 24rpx;
		color: $uni-text-color-grey;
	}

	.ppt-con {
		margin-bottom: 24rpx;

		.create-type {

			&_header {
				font-size: 34rpx;
				font-weight: 800;
				padding: 15rpx 0;
				display: flex;
				align-items: center;

				&_image {
					height: 50rpx;
					width: 50rpx;
					margin-right: 10rpx;
				}
			}

			.input-box {
				overflow: scroll;
				border-radius: 20rpx;
				border: 1px solid $uni-border-color;
				min-height: 400rpx;
				padding: 10rpx;

				&_textarea {
					min-height: 400rpx;
				}
			}

			.content {
				margin-top: 20rpx;
				border-radius: 20rpx;
				overflow: hidden;
				box-sizing: border-box;
				border: 2rpx solid $uni-border-color;
			}


		}
	}

	.create_types {

		&_header {
			padding: 25rpx 0;
			font-size: 25rpx;

			&_changes {
				display: flex;
				font-size: 20rpx;
			}

			&_desc {
				font-size: 20rpx;
				color: #ccc;
			}

			&_carcer {
				display: flex;
				font-size: 25rpx;
				align-items: center;
				padding: 25rpx 0;

				&_nums {
					height: 50rpx;
					font-size: 25rpx;
					display: flex;
					align-items: center;
					border: 1rpx solid #ccc;
					border-radius: 15rpx;
					padding: 10rpx 15rpx;

					&_text {
						margin-right: 15rpx;
					}
				}

				&_input {
					width: 80%;
					border-radius: 15rpx;
					border: 1rpx solid #ccc;

					&_int {
						font-size: 20rpx;
						display: flex;
						align-items: center;
					}
				}
			}
		}
	}


	.overPopup {
		display: flex;
		align-items: center;
		flex-direction: column;

		&_header {
			font-size: 30rpx;
			font-weight: 800;
			padding: 20rpx 0;
		}

		&_main {
			font-size: 25rpx;
			padding: 10rpx 0;
			width: 100%;
			display: flex;
			justify-content: center;
			border-bottom: 1rpx solid #f1f1ff;
		}
	}

	.btn {
		margin-top: 30rpx;
		width: 100%;

		&_content {
			border-radius: 15rpx;
		}
	}


	.AiDailyModel_footer {
		display: flex;
		align-items: center;
		justify-content: center;

		&_content {
			font-size: 25rpx;
			color: $aichat-text-color;
		}
	}
</style>