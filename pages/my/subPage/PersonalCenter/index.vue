<template>
	<z-paging ref="srollRef" :pagingStyle="{ background: 'rgb(246, 247, 249)', padding: '0 30rpx' }">
		<template #top>
			<CommonHeader defindTitle="个人中心" />
		</template>
		<!-- 对话框 -->
		<view class="PersonalCenter">
			<view class="PersonalCenter_header">
				<image class="PersonalCenter_header_image" :src="UserStore.userInfo?.avatar" mode=""></image>
				<text class="PersonalCenter_header_text">更改头像</text>
			</view>
			<view class="PersonalCenter_mianbox">
				<view class="PersonalCenter_mianbox_lable">个人信息</view>
				<view class="PersonalCenter_main">
					<form-cell label="手机号" :description="UserStore.userInfo?.phone || '未绑定'" @click="bindPhone">
						<template #label>
							<view class="formLabels">
								<image class="iconItems" :src="$assets.phoneIcon" mode=""></image>
								<text class="textItems">手机号</text>
							</view>
						</template>
					</form-cell>
					<form-cell :description="UserStore.userInfo?.email || '未绑定'" @click="bindEmailFn">
						<template #label>
							<view class="formLabels">
								<image class="iconItems" :src="$assets.emailIcon" mode=""></image>
								<text class="textItems">邮箱</text>
							</view>
						</template>
					</form-cell>

					<form-cell :description="UserStore.userInfo?.nick || '未绑定'" @click="setUserNick">
						<template #label>
							<view class="formLabels">
								<image class="iconItems" :src="$assets.userIcon" mode=""></image>
								<text class="textItems">用户名</text>
							</view>
						</template>
					</form-cell>
					<form-cell :description="UserStore.userInfo?.qqid || '未绑定'">
						<template #label>
							<view class="formLabels">
								<image class="iconItems" :src="$assets.qqIcon" mode=""></image>
								<text class="textItems">QQ</text>
							</view>
						</template>
					</form-cell>
					<form-cell>
						<template #label>
							<view class="formLabels">
								<image class="iconItems" :src="$assets.weixinIcon" mode=""></image>
								<text class="textItems">微信公众号</text>
							</view>
						</template>
					</form-cell>
				</view>
				<view class="PersonalCenter_mianbox_lable">安全</view>
				<view class="PersonalCenter_main">
					<form-cell>
						<template #label>
							<view class="formLabels">
								<image class="iconItems" :src="$assets.miyaoIcon" mode=""></image>
								<text class="textItems">密钥</text>
							</view>
						</template>
					</form-cell>
					<form-cell>
						<template #label>
							<view class="formLabels">
								<image class="iconItems" :src="$assets.resetPassWord" mode=""></image>
								<text class="textItems">修改密码</text>
							</view>
						</template>
					</form-cell>
					<form-cell>
						<template #label>
							<view class="formLabels">
								<image class="iconItems" :src="$assets.deleteAccount" mode=""></image>
								<text class="textItems">注销账号</text>
							</view>
						</template>
					</form-cell>
				</view>
			</view>
			<BindPhone v-model:popupShow="popupShow" title="绑定手机号" :titleIcon="$assets.phoneIcon" />
			<BindEmail v-model:popupShow="popupShow2" title="绑定邮箱" :titleIcon="$assets.emailChangeIcon" />
			<SetUserNick v-model:popupShow="popupShow3" title="设置用户名" :titleIcon="$assets.emailChangeIcon" />
		</view>
		<template #bottom>
			<view class="footer">
				<view class="footer_outLogin">退出登录</view>
			</view>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';
import CommonHeader from '@/components/CommonHeader.vue';
import FormCell from '@/components/FormCell/index.vue';
import BindPhone from '@/components/BindPhone/index.vue';
import BindEmail from '@/components/BindEmail/index.vue';
import SetUserNick from '@/components/SetUserNick/index.vue';
import { useGlobalProperties } from '../../../../hooks/useGlobalHooks';
import { ref } from 'vue';
const { $assets } = useGlobalProperties();
const UserStore = useUserStore();
const popupShow = ref(false);
const popupShow2 = ref(false);
const popupShow3 = ref(false);
const bindPhone = () => {
	popupShow.value = true;
};
const bindEmailFn = () => {
	popupShow2.value = true;
};
const setUserNick = () => {
	popupShow3.value = true;
};
</script>

<style lang="scss">
.PersonalCenter {
	&_header {
		display: flex;
		justify-content: center;
		padding: 50rpx 0;
		position: relative;

		&_image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}

		&_text {
			position: absolute;
			// background-color: $u-primary;
			background-color: $uni-bg-color;
			// color: $u-primary-light;
			border: 1rpx solid $u-primary;
			border-radius: 15rpx;
			font-size: 25rpx;
			padding: 5rpx 15rpx;
			bottom: 15rpx;
		}
	}

	&_mianbox_lable {
		font-size: 30rpx;
		font-weight: 800;
	}

	&_main {
		margin: 30rpx 0;
		border-radius: 25rpx;
		overflow: hidden;
	}
}

.formLabels {
	display: flex;
	align-items: center;
}

.iconItems {
	width: 35rpx;
	height: 35rpx;
	padding-right: 20rpx;
}

.textItems {
	font-size: 28rpx;
}

.footer {
	padding: 25rpx 0;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;

	&_outLogin {
		width: 80%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		border-radius: 1.09375rem !important;
		height: 80rpx !important;
		color: #ffffff !important;
		background: linear-gradient(to right, #1cd8ba, #06c0f9);
		cursor: pointer;
	}
}
</style>
