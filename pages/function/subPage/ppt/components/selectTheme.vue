<template>
	<z-paging>
		<template #top>
			<view class="top">
				<up-navbar :auto-back="true" title="AI一键生成PPT" :fixed="false"></up-navbar>
				<text class="title">第四步,选择你喜欢的主题吧</text>
				<text
					class="description">所有模板我们团队会不断的在后台进行上传，只需要选择你喜欢的模板，AI即刻开始任务，不久后你就的PPT就完成啦!当然，我们非常希望你能够给我们提供更多的模板，这样，我们的AI生态即会更加完整。</text>
				<!-- 选择项 -->
				<view class="select-box">
					<!-- 风格 -->
					<view class="style-action action-item">
						<text class="label">风格：</text>
						<scroll-view :scroll-x="true">
							<view class="style-box">
								<text @click="onStyleChange(item.id)"
									:class="['style-item',{'active-style':item.id == searchForm.style}]"
									v-for="(item,index) in style" :key="item.id">{{item.title}}</text>
							</view>
						</scroll-view>
					</view>
					<!-- 颜色 -->
					<view class="style-action action-item">
						<text class="label">颜色：</text>
						<scroll-view :scroll-x="true">
							<view class="color-box">
								<text :style="{background:item.color}" v-for="(item,index) in color" :key="index"
									@click="searchForm.color = item.value"
									:class="['color-item',{'color-active':item.value == searchForm.color}]"></text>
							</view>
						</scroll-view>
					</view>
					<!-- 时间 -->
					<view class="style-action action-item">
						<text class="label">时间：</text>
						<view class="time-box">
							<text @click="searchForm.time = item.label"
								:class="['time-item',{'active-time':item.value == searchForm.time}]"
								v-for="(item,index) in timeType" :key="item.value">{{item.label}}</text>
						</view>
					</view>
				</view>
			</view>
		</template>
		<view class="body">
			<view class="template">
				<view @click="searchForm.themeId = item.id" v-for="(item,index) in templateList" :key="item.id" class="template-item">
					<image class="theme" :src="templateSrc(item.id)"></image>
					<view v-if="item.id == searchForm.themeId" class="icon">
						<u-icon size="24" color="var(--primary-color)" name="checkmark"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<template #bottom>
			<view class="bottom-box">
				<view class="radom">
					<u-checkbox label="随机模版(有选择困难症就那就勾选这里吧)" name="radom" usedAlone v-model:checked="radomCheck">
					</u-checkbox>
				</view>
				<u-button @click="onCreatePPt" style="border-radius: 15rpx;height: 88rpx;" type="primary">第四步:修改AI生成内容</u-button>
			</view>
		</template>
	</z-paging>
</template>
<script lang="ts" setup>
	import { reactive, onMounted, ref, computed } from 'vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks.ts'

	interface TemplateItem {
		id : string
	}
	const { $api } = useGlobalProperties()
	const templateList = ref<TemplateItem[]>([])
	const radomCheck = ref(false)
	const style = [
		{ id: 1, title: "全部" },
		{ id: 2, title: "扁平简约" },
		{ id: 3, title: "商务科技" },
		{ id: 4, title: "文艺清新" },
		{ id: 5, title: "卡通手绘" },
		{ id: 6, title: "中国风" },
		{ id: 7, title: "创意时尚" },
		{ id: 8, title: "创意趣味" },
	];

	const color = [
		{ id: 1, color: "conic-gradient(#5efce8,#736efe,#E72425,#DE6FFE)", title: "全部", value: "all" },
		{ id: 2, color: "#F38503", value: "橙" },
		{ id: 3, color: "#E72425", value: "红" },
		{ id: 4, color: "#FBE271", value: "黄" },
		{ id: 5, color: "#9DE16F", value: "绿" },
		{ id: 6, color: "#37D8B7", value: "深绿" },
		{ id: 7, color: "#DE6FFE", value: "紫" },
		{ id: 8, color: "#53AFFE", value: "蓝" },
		{ id: 9, color: "#B07652", value: "棕" },
	];
	const timeType = [
		{
			label: "默认排序",
			value: "default"
		},
		{
			label: "按更新时间",
			value: "update"
		}
	]
	const searchForm = reactive({
		style: 1,
		color: 'all',
		time: 'default',
		themeId: ''
	})

	const emit = defineEmits<{
		(e:'next',val:string):void
	}>()
	const onStyleChange = (id : number) => {
		searchForm.style = id
	}
	//获取模板图片地址
	const templateSrc = computed(() => {
		return (name : string) => {
			return `http://pptx-img.java68.cn/${name}/index.jpeg`;
		};
	});
	//获取魔板
	const getPptTemplate = async () => {
		const res = await $api.post('api/v1/ppt/templete')
		templateList.value = res.data
	}
	//创建ppt
	const onCreatePPt = () =>{
		if(!searchForm.themeId)
			return uni.$u.toast('请选择ppt模版')
		emit('next',searchForm.themeId)
	}
	onMounted(() => {
		getPptTemplate()
	})
</script>

<style lang="scss" scoped>
	.bottom-box {
		.radom {
			padding-bottom: 10rpx;
			font-size: 26rpx;
		}

		padding: 30rpx 24rpx;
		background-color: white;

	}

	.body {
		padding: 0 24rpx;
		--primary-color:#{$uni-color-primary};
		.template {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 24rpx;

			.template-item {
				height: 200rpx;
				background-size: 100% 100%;
				position: relative;
				overflow: hidden;
				border-radius: 10rpx;

				.theme {
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
				}
				.icon{
					position: absolute;
					bottom: 10rpx;
					right: 10rpx;
				}
			}
		}
	}

	.top {
		display: flex;
		flex-direction: column;
		padding: 0 24rpx;

		.select-box {
			display: flex;
			flex-direction: column;
			margin-top: 30rpx;

			.action-item {
				display: flex;
				align-items: center;
				// margin-bottom: 24rpx;
				padding: 10rpx 0;

				.label {
					width: 100rpx;
					flex-shrink: 0;
					display: block;
					font-size: 28rpx;
					color: $uni-text-color-grey;
				}

				.color-box {
					display: flex;
					flex: 1;
					flex-wrap: nowrap;
					gap: 20rpx;
					align-items: center;
					padding-right: 40rpx;

					.color-item {
						display: block;
						width: 55rpx;
						height: 55rpx;
						border-radius: 10rpx;
						flex-shrink: 0;
					}

					.color-active {
						transform: scale(1.3);
						transition: all .5s ease-in-out;
					}
				}

				.time-box {
					display: flex;
					flex: 1;
					flex-wrap: nowrap;
					gap: 20rpx;
					align-items: center;

					.time-item {
						font-size: 30rpx;
						font-weight: 700;
						height: 100%;
						display: block;
						color: #808192;
						padding-bottom: 10rpx;
						flex-shrink: 0;
					}

					.active-time {
						color: #333333 !important;
						position: relative;

						&::after {
							position: absolute;
							content: '';
							width: 30rpx;
							height: 4rpx;
							background-color: $uni-color-primary;
							border-radius: 4rpx;
							bottom: 0rpx;
							left: 50%;
							transform: translate(-50%, 0);
						}
					}
				}

				.style-box {
					display: flex;
					flex: 1;
					flex-wrap: nowrap;
					gap: 20rpx;
					align-items: center;

					.style-item {
						font-size: 30rpx;
						font-weight: 700;
						height: 100%;
						display: block;
						color: #808192;
						padding-bottom: 10rpx;
						flex-shrink: 0;
					}

					.active-style {
						color: #333333 !important;
						position: relative;

						&::after {
							position: absolute;
							content: '';
							width: 30rpx;
							height: 4rpx;
							background-color: $uni-color-primary;
							border-radius: 4rpx;
							bottom: 0rpx;
							left: 50%;
							transform: translate(-50%, 0);
						}
					}
				}
			}
		}

		.title {
			font-size: 32rpx;
			font-weight: 700;
			margin: 40rpx 0;
			text-align: center;
		}

		.description {
			font-size: 24rpx;
			line-height: 44rpx;
			color: $uni-text-color-grey;
		}
	}
</style>