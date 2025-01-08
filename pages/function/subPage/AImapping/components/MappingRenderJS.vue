<template>
	<view class="mapping-container" :value="value" :change:value="renderScript.propObserver">
		<sp-html2canvas-render domId="render-dom-2" ref="renderRef" @renderOver="renderOver"></sp-html2canvas-render>
		<view class="mappingHandlerBox">
			<view @click="renderScript.restartData">刷新思维导图</view>
			<view class="mappingHandlerBox_right" @click="cusRenderDom">导出图片</view>
		</view>
		<view class="AImapping1 render-main" id="render-dom-2">
			<div class="svg-container" id="svgWrapRef">
				<svg class="svg-container" id="svgRef"></svg>
			</div>
		</view>
	</view>
</template>

<script>
	import {
		urlToBase64,
		pathToBase64,
		base64ToPath
	} from '@/uni_modules/sp-html2canvas-render/utils/index.js'
	import {
		saveBase64Img
	} from '@/utils'

	export default {
		props: {
			value: {
				type: String,
				default: '',
				required: true,
				reviewBaseImg: '',
				webImageBase1: '',
				webImageBase2: '',
				locImageBase: ''
			}
		},
		computed: {
			richimg() {
				return `
		    <img style="width: 200px; object-fit: cover" src="${this.webImageBase1}" />
		    <img style="width: 200px; object-fit: cover" src="${this.webImageBase2}" />
		    <img style="width: 200px; object-fit: cover" src="${this.locImageBase}" />
		    `
			}
		},
		created() {
			this.handleImage()
		},
		methods: {
			renderOver(e) {
				// console.log(e)
				// this.reviewBaseImg = e
				saveBase64Img(e)
				// base64ToPath(e).then((res) => {
				// 	console.log('==== path :', res)
				// })
			},
			cusRenderDom() {
				this.$refs.renderRef.h2cRenderDom()

			},
			handleContentChange(newContent) {
				this.$emit('input', newContent);
			},
		},
		mounted() {
			if (this.value) {
				this.renderScript?.propObserver?.(this.value);
			}
		}
	};
</script>

<script module="renderScript" lang="renderjs">
	export default {
		data() {
			return {
				transformer: null,
				markmapDOM: null,
				currentContent: '',
				isScriptsLoaded: false,
				defaultContent: `# ChatGptWeb系统
  ## 基础功能
  - 支持AI聊天
  - 支持GPT4
  - 支持DLLAE2
  - 支持Midjourney
  - 支持mind思维导图生成
  - 更多功能等你探索......

  ## 更多内容
  -  在上面输入您想要生成的内容
  - 点击生成即可
  `
			}
		},
		mounted() {
			// 按顺序加载所需资源
			this.loadBasicScripts();
		},
		methods: {
			loadBasicScripts() {
				// 先加载基础样式
				const baseStyle = document.createElement('style');
				baseStyle.textContent = `
	                .markmap-wrapper {
	                    width: 100%;
	                    height: 100%;
	                    min-height: 500px;
	                }
	                .markmap-svg {
	                    width: 100%;
	                    height: 100%;
	                }
	                .markmap-node {
	                    cursor: pointer;
	                }
	                .markmap-node-circle {
	                    fill: #fff;
	                    stroke: #999;
	                    stroke-width: 1.5px;
	                }
	                .markmap-node-text {
	                    fill: #333;
	                    font: 12px sans-serif;
	                }
	                .markmap-link {
	                    fill: none;
	                    stroke: #999;
	                    stroke-width: 1.5px;
	                }
	            `;
				document.head.appendChild(baseStyle);
				// 按顺序加载脚本
				this.loadScript('static/d3@7.js')
					.then(() => this.loadScript('static/markmap-lib.js'))
					.then(() => this.loadScript('static/markmap-view.js'))
					.then(() => {
						this.isScriptsLoaded = true;
						this.initializeMarkmap();
					})
					.catch(error => {
						console.error('脚本加载失败:', error);
					});
			},

			loadScript(src) {
				return new Promise((resolve, reject) => {
					const script = document.createElement('script');
					script.src = src;
					script.onload = resolve;
					script.onerror = reject;
					document.head.appendChild(script);
				});
			},
			initializeMarkmap() {
				try {
					if (!window.markmap || !window.d3) {
						throw new Error('必要的库未加载');
					}
					// 清理现有内容
					const container = document.getElementById('svgWrapRef');
					container.innerHTML = '';
					// 创建新的SVG元素
					const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					svg.setAttribute('id', 'svgRef');
					svg.setAttribute('class', 'markmap-svg');
					container.appendChild(svg);
					// 初始化transformer
					const {
						Transformer
					} = window.markmap;
					this.transformer = new Transformer();
					// 创建markmap实例
					this.markmapDOM = window.markmap.Markmap.create(svg, {
						autoFit: true,
						initialZoom: 0.9,
						maxWidth: 600,
						color: window.d3.scaleOrdinal(window.d3.schemeCategory10),
						nodeMinHeight: 16,
						spacingVertical: 5,
						spacingHorizontal: 80,
						duration: 500,
						embedGlobalCSS: true
					});
					// 初始渲染
					this.renderContent();
				} catch (error) {
					console.error('初始化失败:', error);
				}
			},
			restartData() {
				if (!this.isScriptsLoaded) {
					this.loadBasicScripts();
					return;
				}
				// this.currentContent = this.defaultContent
				this.initializeMarkmap();
			},
			propObserver(newValue) {
				if (!newValue) {
					console.warn('接收到空值');
					return;
				}
				try {
					this.currentContent = String(newValue);
					if (this.isScriptsLoaded && this.markmapDOM) {
						this.renderContent(this.currentContent);
					}
					// 通知内容更新
					this.$ownerInstance.callMethod('changeMap');
				} catch (error) {
					console.error('处理新内容失败:', error);
				}
			},
			renderContent(content) {
				if (!this.transformer || !this.markmapDOM) return;
				try {
					const contentToRender = String(content || this.currentContent);
					if (!contentToRender) {
						console.warn('没有可渲染的内容');
						return;
					}

					const {
						root
					} = this.transformer.transform(contentToRender);
					if (!root) {
						console.error('转换结果为空');
						return;
					}
					this.markmapDOM.setData(root);
					setTimeout(() => {
						if (this.markmapDOM && this.markmapDOM.fit) {
							this.markmapDOM.fit();
						}
					}, 300);
				} catch (error) {
					console.error('渲染内容失败:', error, '内容:', content);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index {
		padding: 24rpx;
		box-sizing: border-box;
	}

	.curpage-review {
		width: 100%;
		border: 1px solid #cccccc;
		display: flex;
		justify-content: center;

		.review-content {}
	}

	.mapping-container {
		width: 100%;
		height: 100%;
		height: 600rpx;
	}

	.AImapping1 {
		width: 100%;
		height: 100%;
		height: 600rpx;
	}

	.svg-container {
		width: 100%;
		height: 100%;
		min-height: 600rpx;
		position: relative;
	}


	.mappingHandlerBox {
		padding: 0 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		&_right {
			display: flex;
			align-items: center;
			background-color: rgb(41, 121, 255);
			padding: 10rpx 15rpx;
			font-size: 25rpx;
			border-radius: 10rpx;
			color: white
		}
	}

	.render-main {
		/* 若要渲染的盒子超出页面,建议给外层盒子一个overflow:auto */
		overflow: auto;
	}

	.base-img {
		width: 100%;
	}
</style>