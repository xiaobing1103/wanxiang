<template>
	<view class="content">
		<CommonHeader />
		<CommonChat />
		<CommonTabbar :indexValue="0" />
	</view>
</template>

<script setup>
import api from '@/api/api.ts'
import CommonTabbar from '@/components/CommonTabbar.vue'
import CommonHeader from '@/components/CommonHeader.vue'
import CommonChat from '@/components/CommonChat/index.vue'
import {
	ref
} from 'vue';
const show = ref(true);
const title = ref('带我去带我去五点前')
const list = ref([{
	text: '点赞',
	color: 'blue',
	fontSize: 28
},
{
	text: '分享'
},
{
	text: '评论'
}
]);

const onLoad = () => {
	console.log(123)
}


api.login().then(res => {
	console.log(res)
})
// export default {
// 	components: {

// 	},
// 	data() {
// 		return {
// 			title: 'He带我去带我去五点前llo'
// 		}
// 	},
// 	onLoad() {

// 	},
// 	methods: {

// 	}
// }
</script>

<style lang="scss">
.content {
	display: flex;
	flex-direction: column
}
</style>