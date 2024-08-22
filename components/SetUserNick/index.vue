<template>
	<up-popup :show="popupShow" @close="close" @open="open" round="15">
		<view class="bindPhone">
			<view class="bindPhone_header">
				<template v-if="titleIcon">
					<image class="bindPhone_header_img" :src="titleIcon" mode=""></image>
				</template>
				<text class="bindPhone_header_text">{{ title }}</text>
			</view>
			<view class="bindPhone_main">
				<view class="bindPhone_main_inputBox">
					<up-input class="bindPhone_main_input" clearable border="bottom" :placeholder="UserStore.userInfo?.nick" v-model="NickName"></up-input>
				</view>
			</view>
			<view class="bindPhone_footer">
				<view class="bindPhone_footer_button" @click="resetNickName">确定</view>
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../../store';
import { useGlobalProperties } from '../../hooks/useGlobalHooks';
const popupShow = defineModel<boolean>('popupShow');
const NickName = ref('');

const { $api } = useGlobalProperties();

defineProps<{ title: string; titleIcon?: string }>();
const UserStore = useUserStore();
const close = () => {
	popupShow.value = false;
};
const open = () => {
	popupShow.value = true;
};

const resetNickName = async () => {
	const result = await $api.post('api/v1/user/editNick', { newNick: NickName.value });
	if (result.code == 200) {
		uni.$u.toast('修改用戶名成功！');

		const users = await $api.get('api/v1/user/info');
		if (users.code == 200) {
			UserStore.userInfo = users.data;
			close();
		}
	} else {
		uni.$u.toast(result.msg);
	}
};
</script>

<style lang="scss">
.bindPhone {
	padding: 20rpx;

	&_header {
		display: flex;
		align-items: center;

		&_img {
			width: 35rpx;
			height: 35rpx;
			margin-right: 20rpx;
		}

		&_text {
			font-size: 30rpx;
			font-weight: 700;
		}
	}

	&_main {
		&_inputBox {
			display: flex;
			align-items: center;
			padding: 10rpx 0;
		}

		&_input {
			border-bottom: 1rpx solid #ccc;

			&_else {
				color: $u-primary;
				font-size: 25rpx;
			}
		}
	}

	&_footer {
		padding: 40rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		&_button {
			width: 80%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30rpx;
			padding: 10rpx 20rpx;
			border-radius: 1.09375rem !important;
			height: 60rpx !important;
			color: #ffffff !important;
			background: linear-gradient(to right, #1cd8ba, #06c0f9);
			cursor: pointer;
		}
	}
}
</style>
