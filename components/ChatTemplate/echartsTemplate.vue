<template>
	<view class="echartsTemplate">
		<view class="echartsTemplate_header">
			<text class="echartsTemplate_header_topText"> 你好，我是AI-图表模型，试试对话处理表格</text>
			<text class="echartsTemplate_header_bottomText"> 我可以帮你处理表格信息，并且生成表格。支持Eharts代码数据可视化图表库</text>
		</view>
		<view class="echartsTemplate_main">
			<view class="echartsTemplate_main_box" v-for="(items,index) in icons" :key="index"
				@click="choose(items.getPrompt,items.type)">
				<view class="echartsTemplate_main_leftBox">
					<image class="echartsTemplate_main_leftBox_iamge" :src="items.imgSrc" mode=""></image>
				</view>
				<view class="echartsTemplate_main_title">
					<text class="echartsTemplate_main_title_top">{{items.title}}</text>
					<text class="echartsTemplate_main_title_bottom">{{items.desc}}</text>
				</view>
			</view>
		</view>
	</view>
	<up-modal :show="showModal" @confirm="confirm" showCancelButton @close="showModal = false" @cancel="showModal = false" closeOnClickOverlay>
		<view class="echartsModal">
			<view class="echartsModal_title">
				请选择你想输出的图表示例
			</view>
			<view class="echartsModal_header" v-for="(items,index) in tagList" :key="index" @click="seleted(items)">
				<text :style="{color:seletedItems == items ? '#0958d9': ''}"
					class="echartsModal_header_text">{{items}}</text>
			</view>
		</view>
	</up-modal>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	const showModal = ref(false)
	const seletedItems = ref('')
	const seletedEcharts = ref('')
	const uchartsType = ref('pie')
	const choose = (fn : () => string, type : string) => {
		showModal.value = true
		seletedEcharts.value = fn()
		uchartsType.value = type
	}
	const emit = defineEmits(['onsendTemMessage'])
	const confirm = () => {
		const parmas = {
			uchartsType: uchartsType.value,
			messages:
				[{
					role: "system",
					content: seletedEcharts.value
				},
				{
					role: "user",
					content: seletedItems.value
				}
				]

		}
		emit('onsendTemMessage', parmas,)
		showModal.value = false
	}
	const seleted = (str : string) => {
		seletedItems.value = str
	}

	const tagList = [
		'世界上人口最多的五个国家',
		'2023年中国各省人口总数',
		'2023年中国各省人口男女比例',
		'2023年深圳各区GDP数据',
		'全球各国男人平均年龄',
		'全球各国女人平均年龄',
		'全国各省宠物家庭总数',
		'2023年五个最靠前的a股股票数据',
		'2023年毕业生各省总数',
		'2023年23-29岁男女消费比例',
		'2023年23-29岁年轻人各省失业比例'
	]
	const icons = [
		{
			title: '饼图',
			desc: '快速生成精美的饼状图表',
			imgSrc: 'http://file.1foo.com/2024/09/09/46232b0a476899d9add36c85cbb48018.svg',
			getPrompt: function () {
				return generatePrompt('饼状图表', '饼状图', 'uCharts', '数据从百度、Wikipedia、搜狗、腾讯、网易等网站获取', 'pie', `{
  "series": [
    {
      "data": [
        {"name": "一班", "value": 50},
        {"name": "二班", "value": 30},
        {"name": "三班", "value": 20},
        {"name": "四班", "value": 18},
        {"name": "五班", "value": 8}
      ]
    }
  ]
}
`);
			},
			type: 'pie'
		},

		{
			title: '散点图',
			desc: '快速生成精美的散点图表',
			imgSrc: 'http://file.1foo.com/2024/09/09/fb1e62647da2d2947b4ec0e8041548de.svg',
			getPrompt: function () {
				return generatePrompt('散点图表', '散点图', 'uCharts', '数据从百度、Wikipedia、搜狗、腾讯、网易等网站获取,散点图series的data数据格式是一个二维数组，用来展示每个点的坐标请你按照数据转换成点坐标，series的name是散点的label,输出的时候不要出现注释', 'scatter', `{
            series: [
              {
                name: "散点一",
                data: [[10,8.04],[8.07,6.95],[13,7.58],[9.05,8.81],[11,8.33],[14,7.66],[13.4,6.81],[10,6.33],[14,8.96],[12.5,6.82]]
              },
              {
                name: "散点二",
                data: [[9.15,7.2],[11.5,7.2],[3.03,4.23],[12.2,7.83],[2.02,4.47],[1.05,3.33],[4.05,4.96],[6.03,7.24],[12,6.26],[12,8.84],[7.08,5.82],[5.02,5.68]]
              }
            ]
          }
		`);
			},
			type: 'scatter'
		},




		{
			title: '折线图',
			desc: '生成详尽的折线图表',
			imgSrc: 'http://file.1foo.com/2024/09/09/26434c5602ca5f9ba5f9ee09ef7a3a4d.svg',
			getPrompt: function () {
				return generatePrompt(
					'折线图表',
					'折线图',
					'uCharts',
					'数据从百度、Wikipedia、搜狗、腾讯、网易等网站获取',
					'line', `{
  "categories": ["2018", "2019", "2020", "2021", "2022", "2023"],
  "series": [
    {
      "name": "成交量A",
      "data": [35, 8, 25, 37, 4, 20]
    },
    {
      "name": "成交量B",
      "data": [70, 40, 65, 100, 44, 68]
    },
    {
      "name": "成交量C",
      "data": [100, 80, 95, 150, 112, 132]
    }
  ]
}
`);
			},
			type: 'line'
		},
		{
			title: '玫瑰图',
			desc: '为你生成清晰的面积玫瑰图',
			imgSrc: 'http://file.1foo.com/2024/09/09/3e01127f6cad69c7bf7e0f23c057bcc3.svg',
			getPrompt: function () {
				return generatePrompt(
					'玫瑰图表',
					'玫瑰图',
					'uCharts',
					'数据从百度、Wikipedia、搜狗、腾讯、网易等网站获取',
					'column', `{
            series: [
              {
                data: [{"name":"一班","value":50},{"name":"二班","value":30},{"name":"三班","value":20},{"name":"四班","value":18},{"name":"五班","value":8}]
              }
            ]
          }
				`)
			},
			type: 'rose'
		},
		{
			title: '柱状图',
			desc: '生成详尽的柱状图表',
			imgSrc: 'http://file.1foo.com/2024/09/09/4e28b87e8e13308528b91d822c6fc2fb.svg',
			getPrompt: function () {
				return generatePrompt(
					'柱状图表',
					'柱状图',
					'uCharts',
					'数据从百度、Wikipedia、搜狗、腾讯、网易等网站获取',
					'column', `{
  "categories": ["2018", "2019", "2020", "2021", "2022", "2023"],
  "series": [
    {
      "name": "目标值",
      "data": [35, 36, 31, 33, 13, 34]
    },
    {
      "name": "完成量",
      "data": [18, 27, 21, 24, 6, 28]
    }
  ]
}
`);
			},
			type: 'column'
		},
		{
			title: '区域图',
			desc: '创建一个可视化区域图的表格',
			imgSrc: 'http://file.1foo.com/2024/09/09/b491bdcf60bf0b7826adc870bf7480c4.svg',
			getPrompt: function () {
				return generatePrompt(
					'区域图图表',
					'区域图',
					'uCharts',
					'数据从百度、Wikipedia、搜狗、腾讯、网易等网站获取',
					'extra', `{
  "series": [
    {
      "data": [
        {"name": "一班", "value": 82},
        {"name": "二班", "value": 63},
        {"name": "三班", "value": 86},
        {"name": "四班", "value": 65},
        {"name": "五班", "value": 79}
      ]
    }
  ]
}`);
			},
			type: 'extra'
		},
		{
			title: '条形图',
			desc: '生成一个条形图表格',
			imgSrc: 'http://file.1foo.com/2024/09/09/24314d9b22b246916d91d197fca1e013.svg',
			getPrompt: function () {
				return generatePrompt(
					'条形图表格图表',
					'条形图',
					'uCharts',
					'数据从百度、Wikipedia、搜狗、腾讯、网易等网站获取',
					'bar', `{
  "categories": ["2018", "2019", "2020", "2021", "2022", "2023"],
  "series": [
    {
      "name": "目标值",
      "data": [35, 36, 31, 33, 13, 34]
    },
    {
      "name": "完成量",
      "data": [18, 27, 21, 24, 6, 28]
    }
  ]
}
`);
			},
			type: 'bar'
		}
	];

	// 通用的 prompt 生成函数
	function generatePrompt(chartType : string, title : string, chartLibrary : string, dataSource : string, type : string, content : string) {
		return `
		    用中文回答，请根据我提供的内容使用${chartLibrary}生成${chartType}，要求使用${chartLibrary}语法生成严谨的json代码，不要携带反斜杠，一定要注意逗号的位置和不要使用大写逗号，json代码的书写格式必须是正确的，要根据参考模板来，请保持简洁。
		    ${dataSource}
		    参考模板为：
		    \`\`\`${chartLibrary}
			${content}
		    \`\`\`
		  `;
	}
</script>

<style lang="scss" scoped>
	.echartsTemplate {
		display: flex;
		flex-direction: column;
		background-color: white;
		padding: 25rpx;
		border-radius: 15rpx;

		&_header {
			display: flex;
			flex-direction: column;

			&_topText {
				font-size: 25rpx;
				font-weight: 800;
			}

			&_bottomText {
				font-size: 25rpx;
				font-weight: 500;
				padding: 10rpx 0;
			}
		}

		&_main {
			&_box {
				display: flex;
				align-items: center;
				background-color: #ececec;
				margin: 15rpx 0;
				padding: 10rpx;
				border-radius: 20rpx;
			}

			&_leftBox {
				display: flex;


				&_iamge {
					width: 40rpx;
					height: 40rpx;
					margin-right: 20rpx;
				}
			}

			&_title {
				display: flex;
				flex-direction: column;
				font-size: 25rpx;

				&_top {
					font-weight: 800;
					padding: 10rpx 0;
				}
			}
		}

	}

	.echartsModal {
		display: flex;
		flex-wrap: wrap;

		&_title {
			font-size: 30rpx;
			font-weight: 800;
			padding: 20rpx 10rpx;
		}

		&_header {


			&_text {
				padding: 10rpx;
				box-sizing: border-box;
				border-radius: 15rpx;
				font-size: 25rpx;
			}
		}
	}
</style>