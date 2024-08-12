<template>
	<view class="BaseTem">
		<view class="BaseTem_baseModel">
			<view class="label">
				<text class="label_tops"> 基础模型 </text>
			</view>
			<view class="content">
				<TemImages :datas="models" v-model:parmas="parmas" type='model' />
			</view>
		</view>
		<view class="BaseTem_ImageStyle">
			<view class="label">
				<text class="label_tops"> 图片风格 </text>
				<text class="label_buttom">（风格强度越大，改变越大）</text>
			</view>
			<view class="content">
				<TemImages :datas="styles" v-model:parmas="parmas" type='style' />
			</view>
		</view>
		<view class="BaseTem_canvas">
			<view class="label">
				<text class="label_tops"> 画布比例 </text>
			</view>
			<view class="content">
				<CanvasProportion v-model:parmas="parmas" />
			</view>
		</view>
		<view class="BaseTem_imageNum">
			<view class="label">
				<text class="label_tops"> 图片数量 </text>
				<text class="label_buttom">（请选择你要生成的数量）</text>
			</view>
			<view class="content">
				<ImageNums v-model:parmas="parmas" />
			</view>
		</view>
		<view class="BaseTem_ImageQuality">
			<view class="label" :style="{display: 'flex',flexDirection: 'column'}">
				<text class="label_tops"> 图片画质 </text>
				<text class="label_buttom">普通分辨率消耗一张，高清分辨率消耗4张。选择的画质越高，需要生成的时间越长。</text>
			</view>
			<view class="content">
				<ImageQuality v-model:parmas="parmas" />
			</view>
		</view>

		<view class="BaseTem_loraScale">
			<view class="label">
				<text class="label_tops"> 风格强度 </text>
			</view>
			<view class="content">
				<ImageLoraScale v-model:parmas="parmas" min='1' max='100' type="loraScale" />
			</view>
		</view>
		<view class="BaseTem_step">
			<view class="label">
				<text class="label_tops"> 迭代数 </text>
			</view>
			<view class="content">
				<ImageLoraScale v-model:parmas="parmas" min='15' max='30' type="step" />
			</view>
		</view>
		<view class="BaseTem_textScale">
			<view class="label">
				<text class="label_tops"> 文本强度 </text>
			</view>
			<view class="content">
				<ImageLoraScale v-model:parmas="parmas" min='1' max='10' type="textScale" />
			</view>
		</view>
		<view class="BaseTem_simpler">
			<view class="label">
				<text class="label_tops"> 采样器 </text>
			</view>
			<view class="content">
				<ImageSimpler v-model:parmas="parmas" />
			</view>
		</view>

		<view class="BaseTem_seed">
			<view class="label" :style="{display: 'flex',flexDirection: 'column'}">
				<text class="label_tops"> 随机种子 </text>
				<text class="label_buttom">随意填写一串数字，种子相同生成·图片就相近或相同，为-1则完全不同</text>
			</view>
			<view class="content">
				<up-input class="BaseTem_seed_input" placeholder="请输入内容" border="surround"
					v-model="parmas.seed"></up-input>
			</view>
		</view>

		<view class="BaseTem_negative_prompt">
			<view class="label">
				<text class="label_tops"> 负标签 </text>
				<text class="label_buttom">（默认不要修改）</text>
			</view>
			<view class="content">
				<up-textarea class="BaseTem_negative_prompt_content" v-model="parmas.negative_prompt"
					placeholder="请输入内容"></up-textarea>
			</view>
		</view>
	</view>
	<!-- <up-loading-page :loading="true"></up-loading-page> -->
	<!-- 	<view class="footer">
		<view class="footer_box">
			<up-button class="footerButton" text="AI生成(消耗1次)"></up-button>
		</view> -->


</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { Image2TextParmas, modelsDTO, stylesDTO } from '../../data';
	import TemImages from './TemImages'
	import ImageNums from './ImageNums'
	import ImageQuality from './ImageQuality'
	import ImageLoraScale from './ImageLoraScale'
	import CanvasProportion from './CanvasProportion'
	import ImageSimpler from './ImageSimpler'
	const { $api } = useGlobalProperties()

	const models = ref<modelsDTO[]>([])
	const styles = ref<modelsDTO[]>([])
	const parmas = ref<Image2TextParmas>({
		cfg_scale: 7,
		height: 512,
		hire: 0,
		loraId: "fc1be0561c11fe7019f4424f5e7b2c85",
		loraScale: 66,
		model: "fd422ef3f7285ee610eee4d150ca87c9",
		negative_prompt:
			"easynegative, (worst quality:1.3), (low quality:1), (normal quality:1.4), lowres,skin spots, acnes, skin blemishes, age spot, glan, extra fingers, fewer fingers, strange fingers, bad hand, bad anatomy, fused fingers, missing leg, mutated hand, malformed limbs, missing feet,multiple legs,men,boy,logo, loli,3d,extra hands,extra foots",
		num: 2,
		prompt:
			"最高画质，超高清，杰作，精美的CG，一只可爱的白色博美，小狗，圆圆的脑袋，又大又圆的眼睛，微笑，可爱呆萌，大眼睛，可爱的笑容",
		seed: -1,
		simpler: "DPM++ SDE Karras",
		step: 20,
		width: 512,
		textScale: 6
	})
	onMounted(async () => {
		await getModels()
		await getStyles()
	})
	const getModels = async () => {
		const res = await $api.get<modelsDTO[]>('api/v1/img/get_models')
		if (res.code == 200) {
			models.value = res.data
		} else {
			uni.$u.toast(res.msg)
		}
	}
	const getStyles = async () => {
		const res = await $api.get<stylesDTO[]>('api/v1/img/get_styles')
		if (res.code == 200) {
			styles.value = res.data
		} else {
			uni.$u.toast(res.msg)
		}
	}
</script>

<style lang="scss" scoped>
	.BaseTem {
		width: 100%;

		&_baseModel {
			width: 100%;
		}
	}

	.label {
		padding: 15rpx 0;

		&_tops {
			font-weight: 700;
			font-size: 28rpx;
		}

		&_buttom {
			font-size: 20rpx;
		}
	}

	.content {
		width: 100%;
	}

	.BaseTem_seed_input {
		height: 50rpx;
		width: 80%;
		border: 2rpx solid #ccc;
	}

	.BaseTem_negative_prompt_content {}
</style>