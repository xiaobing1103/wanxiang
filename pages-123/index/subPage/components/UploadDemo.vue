<template>
	<view>
		<view @click="handleUploadClick">
			<slot name="defaultTemplate">
			</slot>
		</view>
		<view class="upload-wrap" v-if="!$slots.defaultTemplate || !$slots.defaultTemplate()">
			<view class="btn-click mgb-16 upload-btn" @click="handleUploadClick" v-show="!disabled">
				<image :src="icons.upload" mode="aspectFill" class="upload-icon" />
				<text class="upload-text">上传{{ title[type] }}</text>
			</view>
			<view class="mgb-16 file-wrap" v-for="(item, index) in fileList" :key="index">
				<view class="btn-click file-line" @click="handlePreview(item)">
					<view class="file-info">
						<image :src="icons[item.fileType || 'file']" mode="aspectFill" class="file-icon" />
						<text class="file-name">{{ item.name || title[type] }}</text>
					</view>
					<image :src="icons.close" mode="aspectFill" class="file-icon" v-if="!disabled"
						@click.stop="handleDeleteFile(index)" />
				</view>
			</view>
			<view class="mgb-16 file-wrap" v-if="fileList.length === 0 && disabled">
				<view class="file-line">
					<text class="file-empty">暂无数据</text>
				</view>
			</view>
		</view>
		<xe-upload ref="XeUpload" :options="uploadOptions" @callback="handleUploadCallback"></xe-upload>
	</view>
</template>

<script>
	export default {
		name: 'UploadDemo',
		components: {},
		props: {
			type: {
				default: 'image', // image, video, file 
				type: String,
			},
			list: {
				default: () => ([]),
				type: Array,
			},
			count: {
				default: 5,
				type: Number,
			},
			disabled: {
				default: false,
				type: Boolean,
			},
			limitSize: {
				default: 5,
				type: Number,
			}
		},
		data() {
			return {
				// uploadOptions 参数跟uni.uploadFile的参数是一样的（除了类型为Function的属性）
				uploadOptions: {
					// url: 'http://192.168.31.185:3000/api/upload', // 不传入上传地址则返回本地链接
				},
				fileList: [],
				title: {
					image: '图片',
					video: '视频',
					file: '文件',
				},
				icons: {
					upload: 'http://file.1foo.com/2024/12/26/902f4f78e2d7636e9324a33a484522ab.png',
					close: 'http://file.1foo.com/2024/12/26/078552d7cc1930630ff48f02758eb64c.png',
					image: 'http://file.1foo.com/2024/12/26/17b6695a927a5d0e46eaef1fdfe2df0c.png',
					video: 'http://file.1foo.com/2024/02/22/1c76f2f33e6ac2778e894da18b1caf22.png',
					file: 'http://file.1foo.com/2024/12/26/e82d6073ddc8a37e5bef953a07b46030.png',
				},
			};
		},
		watch: {
			list: {
				handler(val) {
					this.fileList = val || [];
				},
				immediate: true,
				deep: true,
			},
		},
		methods: {
			handleUploadClick() {
				// 使用默认配置则不需要传入第二个参数
				// App、H5 文件拓展名过滤 { extension: ['.doc', '.docx'] } 或者 { extension: '.doc, .docx' }
				this.$refs.XeUpload.upload(this.type);
				// 可以根据当前的平台，传入选择文件的参数，例如
				// 注意 当chooseMedia可用时，会优先使用chooseMedia
				// // uni.chooseImage
				// this.$refs.XeUpload.upload(type, {
				// 	count: 6,
				// 	sizeType: ['original', 'compressed'],
				// 	sourceType: ['album'],
				// });
				// // uni.chooseVideo
				// this.$refs.XeUpload.upload(type, {
				// 	sourceType: ['camera', 'album'],
				// });
				// // uni.chooseMedia (微信小程序2.10.0+;抖音小程序、飞书小程序;京东小程序支持)
				// this.$refs.XeUpload.upload(type, {
				// 	count: 9,
				// 	sourceType: ['album', 'camera'],
				// });
			},
			handleUploadCallback(e) {
				console.log('UploadCallback', e);
				if (['choose', 'success'].includes(e.type)) {
					// 根据接口返回修改对应的response相关的逻辑
					const tmpFiles = (e.data || []).map(({
						response,
						tempFilePath,
						name,
						fileType,
						size
					}) => {
						// 当前测试服务返回的数据结构如下
						// {
						//   "result": {
						//       "fileName": "fileName",
						//       "filePath": `http://192.168.1.121:3000/static/xxxxx.png`,
						//   },
						//   "success": true,
						// }
						const res = response?.result || {};
						const tmpUrl = res.filePath ?? tempFilePath;
						const tmpName = res.fileName ?? name;

						return {
							...res,
							url: tmpUrl,
							name: tmpName,
							fileType,
							size
						};
					});
					if (this.count == 1) {
						this.fileList = tmpFiles
					} else {
						this.fileList.push(...tmpFiles);
					}
					this.$emit('UploadCallback', this.fileList)
				}
			},
			// 自定义上传
			handleUploadFile({
				url
			}) {
				console.log('UploadFile', url);
				uni.uploadFile({
					url: 'http://192.168.31.185:3000/api/upload',
					filePath: url,
					name: 'file',
					success: (res) => {
						console.log('handleUpload success', res);
						const tmpData = JSON.parse(res.data);
						uni.showToast({
							title: tmpData.success ? '上传成功' : '上传失败',
							icon: 'none'
						});
					},
					fail: (err) => {
						console.log('handleUpload fail', err);
						uni.showToast({
							title: '出错啦',
							icon: 'none'
						});
					},
				});
			},
			// 预览
			handlePreview({
				url
			}) {
				console.log('PreviewFile', url);
				const fileType = this.getFileType(url);
				if (fileType === 'image') {
					return uni.previewImage({
						current: url,
						urls: [url],
					});
				}
				// #ifndef H5
				if (fileType === 'office') {
					return uni.openDocument({
						filePath: url,
						fail: (err) => {
							console.log(err);
							uni.showToast({
								icon: 'none',
								title: '文件预览失败'
							});
						},
					});
				}
				// #endif
				uni.showModal({
					title: '提示',
					content: url,
					showCancel: false,
				});
			},
			handleDeleteFile(index) {
				this.fileList.splice(index, 1);
			},
			/**
			 * 获取文件类型
			 * @param {String} fileName 文件链接
			 * @returns {String} fileType => '', image, video, audio, office, unknown
			 */
			getFileType(fileName = '') {
				const flieArr = fileName.split('.');
				let suffix = flieArr[flieArr.length - 1];
				if (!suffix) return '';
				suffix = suffix.toLocaleLowerCase();
				const image = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp'];
				if (image.includes(suffix)) return 'image';
				const video = ['mp4', 'm4v'];
				if (video.includes(suffix)) return 'video';
				const audio = ['mp3', 'm4a', 'wav', 'aac'];
				if (audio.includes(suffix)) return 'audio';
				const office = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'plain'];
				if (office.includes(suffix)) return 'office';
				return 'unknown';
			},
		},
	};
</script>

<style lang="scss" scoped>
	view {
		box-sizing: border-box;
	}

	.btn-click {
		transition: all 0.3s;
		opacity: 1;
	}

	.btn-click:active {
		opacity: 0.5;
	}

	.mgb-16 {
		margin-bottom: 16rpx;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.upload-wrap {
		width: 100%;
		border-radius: 16rpx;
		background: white;
		padding: 32rpx;

		.upload-btn {
			width: 100%;
			height: 176rpx;
			border: 2rpx dashed #AAAAAA;
			background: #FAFAFA;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			.upload-icon {
				width: 48rpx;
				height: 48rpx;
				margin-bottom: 8rpx;
			}

			.upload-text {
				font-size: 26rpx;
				color: #9E9E9E;
				line-height: 40rpx;
			}
		}

		.file-wrap {
			.file-line {
				width: 100%;
				background: #F5F5F5;
				border-radius: 8rpx;
				padding: 16rpx;
				font-size: 26rpx;
				color: #1A1A1A;
				line-height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.file-info {
					width: 90%;
					display: flex;
					align-items: center;

					.file-name {
						max-width: 80%;
						padding-left: 16rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}

				.file-icon {
					width: 40rpx;
					height: 40rpx;
					flex-shrink: 0;
				}

				.file-empty {
					color: #999999;
				}
			}
		}
	}
</style>