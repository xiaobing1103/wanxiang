<template>
	<view>

		<!-- 		<button @click="renderScript.emitData">直接调用renderjs中的emitData的方法</button>
		<button @click="changeMsg" class="app-view">改变msg的值,直接调用renderjs中receiveMsg的值</button>
		<button @click="renderScript.renferMsg">通过renderjs改变msg的值,同时调用renderjs中的emitData的方法</button> -->
		<button @click="renderScript.restartData">更新数据</button>

	</view>
	<view class="AImapping1">
		<div class="svg-container" id="svgWrapRef">
			<svg class="svg-container_svg" id="svgRef"></svg>
			<!-- <div class="mapping_svgToolBar" id="refToolbar" /> -->
		</div>
	</view>

	<view :msg="msg" :change:msg="renderScript.receiveMsg" class="renderjs" id="renderjs-view">
		{{msg}}
	</view>
</template>

<script>
	import {
		Transformer
	} from 'markmap-lib'
	import {
		Markmap
	} from 'markmap-view'
	import {
		html2Image
	} from './CreateMapTem/html2Canvas';

	export default {
		data() {
			return {
				msg: '我是service层原来的msg',
			};
		},
		methods: {
			// 触发逻辑层出入renderjs数据改变
			changeMsg() {
				this.msg = "msg值改变了";
			},
			// 接收renderjs发回的数据
			receiveRenderData(val) {
				console.log('renderjs返回的值-->', val);
			},
			//接收renderjs发回的数据,同时触发:change:msg,调用enderjs中的emitData的方法
			serviceClick(e) {
				this.msg = e
			},
		},
		mounted() {
			this.$emit('initMap', '组件开始')
		},

	};
</script>

<script module="renderScript" lang="renderjs">
	export default {
		data() {
			return {
				name: '我是renderjs数据',
				transformer: null,
				markmapDOM: null,
				descInput: ''
			}
		},
		mounted() {
			const loadScript = (src) => {
				return new Promise((resolve, reject) => {
					const script = document.createElement('script');
					script.src = src;
					script.onload = resolve;
					script.onerror = () => {
						reject(new Error(`Failed to load script: ${src}`));
					};
					document.head.appendChild(script);
				});
			};
			Promise.allSettled([
				loadScript('static/markmap-lib.js'),
				loadScript('static/d3@7.js'),
				loadScript('static/markmap-view.js')
			]).then((results) => {
				const failedScripts = results.filter((result) => result.status === "rejected");
				if (failedScripts.length === 0) {
					this.initMapping();
				} else {
					failedScripts.forEach((failed) => {
						console.error(failed.reason.message);
					});
				}
			});
		},
		methods: {
			initMapping() {
				console.log(typeof window.markmap)
				if (typeof window.markmap === 'object') {
					const { Transformer } = window.markmap
					
					this.transformer = new Transformer()
					const { markmap } = window
					const ElTag = document.getElementById('svgRef')
					console.log('markmap',markmap)
					console.log('ElTag',ElTag)
					this.markmapDOM = markmap.Markmap.create(ElTag)
				} else {
					console.error('markmap is not available in window.');
				}
			},
			renderMarkMap() {
				const {
					root
				} = this.transformer.transform(this.descInput);
				console.log('root object:', root);
				this.markmapDOM?.setData(root);
				console.log('Setting data to markmapDOM:', root);
				this.markmapDOM?.fit(root);
				console.log('Fitting markmapDOM with root:', root);
			},
			async exportImg(type) {
				const data = await html2Image(
					this.$refs.svgWrapRef, {
						type
					}, {
						backgroundColor: '#fff',
						scale: window.devicePixelRatio * 1.5
					}
				)
			},
			renferMsg(event, ownerInstance) {
				// 调用 service层的serviceClick方法,传值
				ownerInstance.callMethod('serviceClick', {
					test: '这是点击renderjs的区域，向service层传递变量'
				})
			},
			// 接收逻辑层发送的数据
			receiveMsg(newValue, oldValue, ownerVm, vm) {
				console.log('msg变化了newValue', newValue)
				console.log('msg变化了oldValue', oldValue)
				console.log('msg变化了ownerVm', ownerVm)
				console.log('msg变化了vm', vm)
			},
			// 发送数据到逻辑层
			emitData(e, ownerVm) {
				ownerVm.callMethod('receiveRenderData', this.name)
			},
			restartData(e) {
				this.descInput = `# 缅因猫
- 日期：[填写日期]
- 目标：深入了解缅因猫的特点和历史
- 进展：
  - [缅因猫起源和分布]
    - [缅因猫的起源]
    - [缅因猫的分布]
  - [缅因猫外观特征]
    - [体型和毛发]
    - [颜色和图案]
  - [缅因猫性格特点]
    - [友好性]
    - [独立性]
- 问题：
  - [问题1]
    - 缅因猫在寒冷气候下的适应性如何？
  - [问题2]
    - 缅因猫的护理需求有哪些？
  - [问题3]
    - 缅因猫的饲养环境有哪些注意事项？
- 下周计划：
  - [填写任务1计划]
    - 查阅更多关于缅因猫的健康信息
  - [填写任务2计划]
    - 了解缅因猫的繁殖情况
  - [填写任务3计划]
    - 收集缅因猫的饲养经验和注意事项`
				this.renderMarkMap()
			}
		},
		// watch: {
		// 	descInput(oldVal, newVal) {
		// 		this.renderMarkMap();
		// 	}
		// }
	};
</script>


<style lang="scss" scoped>
	.AImapping1 {
		width: 100vw;
	}

	.svg-container {
		width: 100vw;
		display: flex;
		justify-content: center;
		height: 600rpx;

		&_svg {
			width: 100%;
			height: 100%;
		}
	}
</style>