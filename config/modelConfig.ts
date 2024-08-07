// commonModel.ts
import { ModelType } from '../type/chatData';
import $assets from './assets.config';
import { ModelConfig } from './type';

export const commonModel : Record<ModelType, ModelConfig> = {
	'v35': {
		title: '推荐模型（组合）',
		ModelPath: '',
		ModelApi: 'api/v1/chat2/v35',
		modelIcon: $assets.v35ModelIcon
	},
	'v40': {
		title: '智慧4.0模式',
		ModelPath: '',
		ModelApi: 'api/v1/chat2/v40',
		modelIcon: $assets.v40ModelIcon
	},
	'net': {
		title: '联网模式 (bate) ',
		ModelPath: '',
		ModelApi: 'api/v1/chat2/completionNet',
		modelIcon: $assets.netModelIcon
	},
	'echarts': {
		title: '图表模型',
		ModelPath: '',
		ModelApi: 'api/v1/chat2/v35',
		modelIcon: $assets.echartsModelIcon
	},
};