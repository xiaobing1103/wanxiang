// commonModel.ts
import $assets from './assets.config';
import { ModelConfig, CommonModelKeys } from './type';

export const commonModel : Record<CommonModelKeys, ModelConfig> = {
	'v35': {
		title: '推荐模型（组合）',
		ModelPath: '',
		modelIcon: $assets.v35ModelIcon
	},
	'v40': {
		title: '智慧4.0模式',
		ModelPath: '',
		modelIcon: $assets.v40ModelIcon
	},
	'net': {
		title: '联网模式 (bate) ',
		ModelPath: '',
		modelIcon: $assets.netModelIcon
	},
	'echarts': {
		title: '图表模型',
		ModelPath: '',
		modelIcon: $assets.echartsModelIcon
	},
};