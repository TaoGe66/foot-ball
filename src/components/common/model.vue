<template>
	<div class="bg">
		<div class="model">
			<p class="msg">{{title}}</p>
		</div>
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
.bg{
	position: fixed;
	top:0;
	left:0;
	right:0;
	bottom:0;
	margin: auto;
	background: rgba(0,0,0,0.5);
	z-index: 700;
}
.model{
	position: fixed;
	top:0;
	left:0;
	right:0;
	bottom:0;
	margin: auto;
	width: 200px;
	height: 50px;
	line-height: 50px;
	background: white;
	z-index: 800;
	border-radius: 10px;
}
.msg{
	color: #46277e;
	text-align: center;
}
</style>




