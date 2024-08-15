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

		<view class="BaseTem_loraScale">
			<view class="label">
				<text class="label_tops"> 变化强度 </text>
			</view>
			<view class="content">
				<ImageLoraScale v-model:parmas="parmas" min='1' max='100' type="denoising_strength" />
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
				<ImageLoraScale v-model:parmas="parmas" min='1' max='10' type="cfg_scale" />
			</view>
		</view>

		<view class="BaseTem_textScale" v-if="IamgeTypes.historyType == 'coloringLineArt_task_json'">
			<view class="label">
				<text class="label_tops"> 权重 </text>
			</view>
			<view class="content">
				<ImageLoraScale v-model:parmas="parmas" min='1' max='200' type="weight" />
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
	import { taskIdTypeKey } from '@/store/draw';
	const { $api } = useGlobalProperties()
	const parmas = defineModel<Image2TextParmas>("parmas")
	const props = defineProps<{
		IamgeTypes : {
			type : string,
			historyType : taskIdTypeKey,
			api : string
		}
	}>()
	const models = ref<modelsDTO[]>([])
	const styles = ref<modelsDTO[]>([])
	onMounted(async () => {
		await getModels()
		await getStyles()
	})
	const getModels = async () => {
		const res = await $api.get<modelsDTO[]>('api/v1/img/get_models')
		if (res.code == 200) {
			let modelArr : modelsDTO[]
			if (props.IamgeTypes.historyType == 'coloringLineArt_task_json') {
				const modelsIds = [
					{ name: '局部重绘模型1', id: 'b49012a9071407209652d332517a182e' },
					{ name: '局部重绘模型2', id: 'fd422ef3f7285ee610eee4d150ca87c9' },
					{ name: '局部重绘模型3', id: '1fea14929fbb9f9c1ed8b476846321fd' }
				]
				modelArr = reservedModels(res.data, modelsIds)
			}
			if (props.IamgeTypes.historyType == 'image2cartoon_task_json') {
				const modelsIds = [
					{ name: '卡通模型1', id: 'f5d0ca1136c4ad76bfea44a3647ca773' },
					{ name: '卡通模型2', id: '3ee5312de41b73edafc3bb7aab39e231' },
					{ name: '卡通模型3', id: '613849e5bfa7850f4d8af46103e610fe' },
					{ name: '卡通模型4', id: '9e3cd7a5ea80540d329084ae41b820e6' },
					{ name: '卡通模型5', id: '18932d336b165cb6b945bf3e72eb3802' }
				]
				modelArr = reservedModels(res.data, modelsIds)
			}
			if (props.IamgeTypes.historyType == 'partialRepaint_task_json') {
				const modelsIds = [
					{ id: 'b49012a9071407209652d332517a182e', name: '通用上色模型1' },
					{ id: '7f772e53d91b0ffe53af17934b9ece40', name: '真人上色模型2' },
					{ id: '613849e5bfa7850f4d8af46103e610fe', name: '卡通上色模型3' }
				]
				modelArr = reservedModels(res.data, modelsIds)
			}
			models.value = modelArr
		} else {
			uni.$u.toast(res.msg)
		}
	}

	const reservedModels = (
		models : modelsDTO[],
		modelsIds : { id : string; name : string }[]
	) => {
		const base = models.filter((item) => modelsIds.some((modelId) => modelId.id === item.id)).map((item) => {
			const matchedModel = modelsIds.find((modelId) => modelId.id === item.id)
			return {
				...item,
				name: matchedModel?.name
			}
		})

		return base as modelsDTO[]
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