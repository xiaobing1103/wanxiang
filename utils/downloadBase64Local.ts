export const downloadReport = (base64) => {

	return new Promise((resolve, reject) => {
		// #ifndef APP
		const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
		const filepath = wx.env.USER_DATA_PATH + '/test.png';
		const fs = wx.getFileSystemManager();
		fs.writeFile({
			filePath: filepath,
			data: base64Data,
			encoding: 'base64',
			success: () => {
				wx.showLoading({
					title: '正在保存...',
					mask: true
				});
				// 保存图片到相册
				wx.saveImageToPhotosAlbum({
					filePath: filepath,
					success: () => {
						wx.hideLoading();
						wx.showToast({
							title: '保存成功！',
							icon: 'success',
							duration: 2000 // 持续的时间
						});
						resolve('保存成功');
					},
					fail: (err) => {
						wx.hideLoading();
						if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" ||
							err.errMsg === "saveImageToPhotosAlbum:fail auth deny" ||
							err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
							wx.showModal({
								title: '提示',
								content: '需要您授权保存相册',
								showCancel: false,
								success: () => {
									wx.openSetting({
										success: (settingdata) => {
											if (settingdata.authSetting['scope.writePhotosAlbum']) {
												wx.showModal({
													title: '提示',
													content: '获取权限成功,再次点击下载按钮进行保存',
													showCancel: false,
												});
											} else {
												wx.showModal({
													title: '提示',
													content: '获取权限失败，将无法保存到相册哦~',
													showCancel: false,
												});
											}
										}
									});
								}
							});
						}
						reject(err); // 将失败信息返回给外部调用
					}
				});
			},
			fail: (err) => {
				console.log('写入文件失败', err);
				reject(err); // 写入文件失败时返回错误信息
			}
		});
		// #endif
		// #ifdef APP
		const bitmap = new plus.nativeObj.Bitmap('test');
		bitmap.loadBase64Data(
			base64,
			function () {
				const url = '_doc/' + new Date() + '.png'; // url建议用时间戳命名方式
				console.log('url:', url);
				bitmap.save(
					url, {
					overwrite: true // 是否覆盖
					// quality: 'quality'  // 图片清晰度
				},
					i => {
						uni.saveImageToPhotosAlbum({
							filePath: url,
							success: function () {
								bitmap.clear();
								resolve('保存成功,已保存到相册！')
							}
						});
					},
					e => {
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						})
						console.log(e);
						bitmap.clear();
						reject(e);
					}
				);
			},
			e => {
				console.log('保存失败', e);
				bitmap.clear();
				reject('保存失败,图片为空白图片可能是因为上传了一个非人像图片！');
			}
		);

		// #endif

	});

};