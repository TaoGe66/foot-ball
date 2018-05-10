<template>
	<div class="tips">
		<p class="msg">{{title}}</p>
	</div>
</template>

<script>
export default {
	props:["title"],
	methods:{
		
	},
}
</script>

<style scoped>
.tips{
	position: fixed;
	top:0;
	left:0;
	right:0;
	bottom:0;
	margin: auto;
	width: 300px;
	height: 50px;
	line-height: 50px;
	background: rgba(0,0,0,0.6);
	z-index: 800;
	border-radius: 25px;
}
.msg{
	color: white;
	text-align: center;
}
</style>




