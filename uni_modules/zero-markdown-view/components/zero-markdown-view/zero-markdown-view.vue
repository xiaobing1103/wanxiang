<template>
	<view class="zero-markdown-view">
		<mp-html
			:key="mpkey"
			:container-style="containerstyle"
			:selectable="selectable"
			:scroll-table="scrollTable"
			:tag-style="tagStyle"
			:markdown="true"
			:content="html"
		></mp-html>
	</view>
</template>

<script>
import mpHtml from '../mp-html/mp-html';

export default {
	name: 'zero-markdown-view',
	components: {
		mpHtml
	},
	props: {
		markdown: {
			type: String,
			default: ''
		},
		selectable: {
			type: [Boolean, String],
			default: true
		},
		scrollTable: {
			type: Boolean,
			default: true
		},
		themeColor: {
			type: String,
			default: '#4955f5'
		},
		codeBgColor: {
			type: String,
			default: '#2d2d2d'
		}
	},
	data() {
		return {
			html: '',
			tagStyle: '',
			containerstyle: 'pre;',
			mpkey: 'zero'
		};
	},
	watch: {
		markdown: function (val) {
			this.html = this.markdown;
		}
	},
	created() {
		this.initTagStyle();
	},
	mounted() {
		this.html = this.markdown;
	},
	methods: {
		initTagStyle() {
			const themeColor = this.themeColor;
			const codeBgColor = this.codeBgColor;
			let zeroStyle = {
				p: `
				// margin:5px 5px;
				// font-size: 15px;
				// line-height:1.75;
				// letter-spacing:0.2em;
				// word-spacing:0.1em;
				-webkit-margin-before: unset;
				margin-block-start: unset;
				-webkit-margin-after: unset;
				margin-block-end: unset;
				`,
				// 一级标题
				h1: `
				margin:20rpx 0;
				font-size: 24px;
				text-align: center;
				font-weight: bold;
				color: ${themeColor};
				padding:3rpx 10rpx 1rpx;
				border-bottom: 2rpx solid ${themeColor};
				border-top-right-radius:3rpx;
				border-top-left-radius:3rpx;
				`,
				// 二级标题
				h2: `
				margin:30rpx 0 20rpx 0;
				font-size: 20px;
				text-align:center;
				color:${themeColor};
				font-weight:bolder;
				padding-left:10rpx;
				// border:1rpx solid ${themeColor};
				`,
				// 三级标题
				h3: `
				margin:20rpx 0 10rpx 0;
				font-size: 18px;
				color: ${themeColor};
				padding-left:10rpx;
				border-left:3rpx solid ${themeColor};
				`,
				// 引用
				blockquote: `
				margin:15rpx 0;
				font-size:15px;
				color: #777777;
				border-left: 4rpx solid #dddddd;
				padding: 0 10rpx;
				 `,
				// 列表
				ul: `
				margin: 10rpx 0;
				color: #555;
				`,
				li: `
				margin: 5px 0;
				color: #555;
				`,
				// 链接
				a: `
				// color: ${themeColor};
				`,
				// 加粗
				strong: `
				font-weight: border;
				color: ${themeColor};
				`,
				// 斜体
				em: `
				color: ${themeColor};
				letter-spacing:0.3em;
				`,
				// 分割线
				hr: `
				height:1px;
				padding:0;
				border:none;
				// border-top:medium solid #333;
				text-align:center;
				background-image:linear-gradient(to right,rgba(248,57,41,0),${themeColor},rgba(248,57,41,0));
				`,
				// 表格
				table: `
				border-spacing:0;
				overflow:auto;
				min-width:100%;
				margin:10px 0;
				border-collapse: collapse;
				`,
				th: `
				border: 1px solid #202121;
				color: #555;
				`,
				td: `
				color:#555;
				border: 1px solid #555555;
				`,
				pre: `
				border-radius: 5px;
				white-space: pre;
				background: ${codeBgColor};
				font-size:12px;
				position: relative;
				`
			};
			this.tagStyle = zeroStyle;
		}
	}
};
</script>

<style lang="scss">
.zero-markdown-view {
	// padding: 15rpx;
	position: relative;
	max-width: 100%;
	overflow: hidden;
}
</style>
