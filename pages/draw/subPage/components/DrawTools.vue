<template>
	<view class="content">
		<!-- #ifdef APP-PLUS || H5 -->
		<view :options="options" :type="type" :color="color" :strokeWidth="strokeWidth" :change:color="draw.setColor"
			:change:options="draw.setOption" :change:type="draw.action" :change:strokeWidth="draw.setStrokeWidth"
			:change:prop="draw.initKonva" :style="{paddingTop:top+'px'}" class="tools-box">
			<view class="left-tools">
				<view class="strok_width">
					<text :style="{width:item+'px',height:item+'px'}" @click="onStrokeChange(item)"
						:class="['item',{active:item == strokeWidth}]" v-for="(item,index) in strokes"
						:key="index"></text>
				</view>
				<view @click="onSelectColor" class="color">
					<text :style="{backgroundColor:color}" class="select-color"></text>
				</view>
			</view>
			<view class="right-tools">
				<text @click="drawActon('clear')" class="clear">清空</text>
				<text @click="drawActon('draw')" class="clear">涂鸦</text>
				<text @click="drawActon('easer')" class="easer">擦除</text>
				<text @click="draw.saveDraw" class="save">保存</text>
			</view>
		</view>
		<view class="draw-con">
			<view class="draw-box">
				<image ref="imageRef" style="width: 100%;opacity: 0.9;" @load="onImageLoad" mode="widthFix"
					:src="imgFile"></image>
				<view id="draw" class="draw"></view>
			</view>
		</view>
		<uv-pick-color ref="pickerColor" @confirm="confirm"></uv-pick-color>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgFile: '',
				top: 0,
				imageRef: null,
				screenWidth: 0,
				strokes: [10, 15, 20],
				type: 'draw',
				pickerColor: null,
				color: '#2d8cf0',
				strokeWidth: 10,
				options: {
					width: 0, //图片的宽
					height: 0, //图片的高
					originWidth: 0, //原始宽度
					originHeight: 0, //原始高度
					src: ''
				},
				imageSize: {
					width: 0,
					height: 0
				},

			}
		},
		props: {
			img: {
				type: String,
				required: true
			}
		},
		methods: {
			onUploadFile() {
				let that = this
				uni.chooseImage({
					count: 1,
					success(res) {
						const img = res.tempFilePaths[0]
						that.imgFile = img
					}
				})
			},
			//确认颜色
			confirm(value) {
				this.color = value.hex
			},
			onStrokeChange(value) {
				this.strokeWidth = value
			},
			onSelectColor() {
				this.$refs.pickerColor.open();
			},
			//保存
			saveFile(dataUrl) {
				// uni.previewImage({
				// 	count: 1,
				// 	urls: [dataUrl],
				// })
				this.$emit('saveImage', dataUrl)
			},
			//设置操作
			drawActon(type) {
				this.type = type
			},
			onImageLoad(e) {
				const originalWidth = e.detail.width;
				const originalHeight = e.detail.height;
				const width = this.screenWidth * 0.8;
				const height = parseInt((width / originalWidth) * originalHeight)
				this.options = {
					...this.options,
					width,
					height,
					originalWidth,
					originalHeight,
					src: this.imgFile
				}
				console.log(this.options)
			},
			//获取高度
			initPage() {
				let that = this
				uni.setNavigationBarColor({
					frontColor: '#fff'
				})
				uni.getSystemInfo({
					success(res) {
						let top = res.safeArea.top
						// #ifdef H5
						that.top = res.safeArea.top
						// #endif
						// #ifdef APP-PLUS
						that.top = res.safeArea.top + 20
						// #endif
						that.screenWidth = res.screenWidth
					}
				})
			}
		},
		mounted() {
			this.imgFile = this.img
			this.initPage()
		},
		// onLoad(options) {

		// }
	}
</script>
<script module="draw" lang="renderjs">
	export default {
		mounted() {
			const script = document.createElement('script')
			script.src = 'static/konva.js'
			document.head.appendChild(script)

		},
		data() {
			return {
				statge: null, //舞台
				layer: null, //图层
				options: null,
				color: '', //颜色
				strokeWidth: '',
				mode: 'brush', //模式brush绘画 eraser擦除
			}
		},
		methods: {
			//设置粗细
			setStrokeWidth(value) {
				this.strokeWidth = value
			},
			//设置颜色
			setColor(value) {
				this.color = value
			},
			//参数
			setOption(options) {
				this.options = options
				if (options.width != 0 && options.height != 0 && !this.statge) {
					this.initKonva()
				}
			},
			//擦除
			onEaser() {
				this.mode = 'eraser'
			},
			//涂鸦
			onDrawLine() {
				this.mode = 'brush'
			},
			//清空画布
			clearDraw() {
				// this.layer.destroyChildren()

				// this.layer.draw();
				// this.layer.children.forEach((child) => {
				// 	if (!(child instanceof Konva.Image)) {
				// 		child.destroy();
				// 	}
				// });
				this.layer.children.forEach((child) => {
					if (child.getAttr('isDrawingPath')) {
						child.destroy();
					}
				});
				this.layer.draw();
				this.layer.draw();
			},
			//操作
			action(type) {
				console.log(type)
				switch (type) {
					case 'easer': //擦除
						this.onEaser()
						break;
					case 'draw': //绘画
						this.onDrawLine()
						break;
					case 'clear': //清除
						this.clearDraw()
						break;
				}
			},
			//保存
			saveDraw(event, ownerInstance) {
				const {
					originWidth,
					originHeight
				} = this.options

				// const byteString = atob(dataUrl.split(',')[1]);
				// const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
				// const ab = new ArrayBuffer(byteString.length);
				// const ia = new Uint8Array(ab);
				// for (let i = 0; i < byteString.length; i++) {
				// 	ia[i] = byteString.charCodeAt(i);
				// }
				// const blob = new Blob([ab], {
				// 	type: mimeString
				// });
				// // 创建临时URL
				// const blobUrl = URL.createObjectURL(blob);


				// this.stage.toBlob((blob) => {
				// 	if (blob) {
				// 		const blobUrl = URL.createObjectURL(blob);
				// 		console.log(blobUrl);
				// 		ownerInstance.callMethod('saveFile', blobUrl);
				// 	}
				// }, 'image/png', {
				// 	width: originWidth,
				// 	height: originHeight
				// });

				const dataUrl = this.stage.toDataURL({
					width: originWidth,
					height: originHeight
				})
				ownerInstance.callMethod('saveFile', dataUrl)
			},
			//绘制线条
			drawLine() {
				let isPaint = false;
				let lastLine;
				this.stage.on('mousedown touchstart', (e) => {
					isPaint = true;
					let pos = this.stage.getPointerPosition();
					lastLine = new Konva.Line({
						stroke: this.color,
						strokeWidth: this.strokeWidth,
						globalCompositeOperation: this.mode === 'brush' ? 'source-over' :
							'destination-out',
						points: [pos.x, pos.y],
						isDrawingPath: true

					});
					this.layer.add(lastLine);
				});
				this.stage.on('mousemove touchmove', () => {
					if (!isPaint) {
						return;
					}
					const pos = this.stage.getPointerPosition();
					let newPoints = lastLine.points().concat([pos.x, pos.y]);
					lastLine.points(newPoints);
					this.layer?.batchDraw();
				});
				this.stage.on('mouseup touchend', () => {
					isPaint = false;
				});
			},
			initKonva() {
				const {
					width,
					height,
					src
				} = this.options
				console.log(width,
					height,
					src)
				console.log(window.Konva)
				if (width == 0) return
				if (!window.Konva) return
				console.log(src)
				this.stage = new window.Konva.Stage({
					container: 'draw',
					width: width,
					height: height
				})
				this.drawLine() //默认开启
				this.layer = new Konva.Layer();
				this.stage.add(this.layer);
				let imageObj = new Image();
				imageObj.crossOrigin = 'anonymous';
				imageObj.onload = () => {
					console.log(123123)
					const image = new window.Konva.Image({
						x: 0,
						y: 0,
						width,
						height,
						image: imageObj
					});
					this.layer.add(image);
					this.layer.batchDraw();
				}
				imageObj.onerror = (error) => {
					console.error('Image loading failed:', error);
				};
				imageObj.src = src
			}
		}
	}
</script>
<style lang="scss" scoped>
	.content {
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;

		.tools-box {
			background-color: green;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: white;
			background: black;
			box-sizing: border-box;
			padding: 20rpx 30rpx;

			.left-tools {
				display: flex;
				gap: 20rpx;
				align-items: center;
				justify-content: flex-start;

				.strok_width {
					display: flex;
					align-items: center;
					gap: 10rpx;

					.active {
						border: 5rpx solid #2d8cf0;
					}

					.item {
						display: block;
						background-color: white;
						border-radius: 50%;
					}
				}

				.color {
					width: 45rpx;
					height: 45rpx;
					background: white;
					border-radius: 50%;
					display: flex;
					margin-left: 20rpx;
					justify-content: center;
					align-items: center;

					.select-color {
						width: 35rpx;
						height: 35rpx;
						border-radius: 50%;
					}
				}
			}

			.right-tools {
				display: flex;
				gap: 20rpx;
			}
		}

		.draw-con {
			width: 100vw;
			flex: 1;
			background-color: white;
			display: flex;
			justify-content: center;
			align-items: center;

			.draw-box {
				width: 80vw;
				position: relative;

				.draw {
					position: absolute;
					top: 0;
				}
			}
		}
	}

	.clear {
		padding: 0 20rpx;
	}

	.easer {
		padding: 0 20rpx;
	}

	.save {
		padding: 0 20rpx;
	}
</style>