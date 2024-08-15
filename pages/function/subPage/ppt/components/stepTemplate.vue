<template>
	<view class="ppt-con">
		<text class="description">
			AI赋能,释放内容创造力，一键生成PPT.省去大量的时间,自动由人工智能驱动为你的主题/课题/论点生成大量:标题.大纲,子纲,要点,内容等,并自动生成一份简洁大气的PPT(可手动插入内容后由Ai帮你制造PPT演示文件)
		</text>
		<view class="list">
			<view v-for="(item,index) in operationList" :key="index" class="list-item">
				<view class="left-icon">
					<image class="icon" :src="item.icon"></image>
				</view>
				<view class="right-info">
					<text class="title">{{item.title}}</text>
					<text class="contnet">{{item.contnet}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	const operationList = [
	  {
	    title: "第一步",
	    contnet: "输入特定主题、长文章，剩下交给AI吧！",
	    icon: "//file.1foo.com/2023/11/03/fdf9961d90b0b01d8bed7a250c85e354.png",
	  },
	  {
	    title: "第二步",
	    contnet:
	      "如特定主题，AI会自动生成相关内容；如长文章，AI会自动总结成相关内容，你只需确定好内容是否符合即可",
	    icon: "//file.1foo.com/2023/11/03/a2e22f6d72b09d830be61c06a21b5ada.png",
	  },
	  {
	    title: "第三步",
	    contnet:
	      "在章节标题与章节内容类型的PPT页面中,可自行修改内容或重新生成局部内容",
	    icon: "//file.1foo.com/2023/11/03/cdf8c05f929d810ad6b078b3a61bcf0d.png",
	  },
	  {
	    title: "第四步",
	    contnet: "选择喜欢的样式主题或随机样式，进入下一步",
	    icon: "//file.1foo.com/2023/11/03/d385051a59301394e1d9942ce3a2ccae.png",
	  },
	  {
	    title: "第五步",
	    contnet: "静待AI进入工作，静候完成即可啦，一个精美的PPT由此生成。",
	    icon: "//file.1foo.com/2023/11/03/c744fef5c00f065642460095a9f4ed05.png",
	  },
	];
</script>

<style lang="scss" scoped>
	.ppt-con{
		.description{
			font-size: 24rpx;
			color: $uni-text-color-grey;
		}
		.list{
			display: flex;
			flex-direction: column;
			padding: 40rpx;
			gap: 20rpx;
			.list-item{
				display: flex;
				align-items: center;
				background-color: #ebf2fc;
				padding: 20rpx;
				border-radius: 10rpx;
				.left-icon{
					padding-right: 20rpx;
					.icon{
						width: 70rpx;
						height: 70rpx;
					}
				}
				.right-info{
					display: flex;
					flex-direction: column;
					.title{
						font-size: 28rpx;
						padding-bottom: 4rpx;
					}
					.contnet{
						font-size: 24rpx;
						line-height: 40rpx;
					}
				}
			}
		}
	}
</style>