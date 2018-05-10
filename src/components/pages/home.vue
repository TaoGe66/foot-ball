<template>
	<div class="home" :class="modeTab=='TD'?'lottery_type':'game_type'">
		<div v-title>竞彩足球</div>
		<header>
			<img src="./fotbal.png" alt="logo" class="logo">
			<span>竞彩足球</span>
		</header>
		<!-- 玩法切换 -->
		<div class="type_select">
			<ul class="select_btn">
				<li v-for="(item,index) in methodType" @click="type(index,item)" class="method_type" :class="{classname: typeIdex==item.path,'lottery_type_btn':modeTab=='TD','game_type_btn':modeTab=='GAME'}">
					<!-- <router-link :to="{item.path}"> -->
						{{item.name}}
					<!-- </router-link> -->
				</li>
			</ul>
		</div>
		<!-- 玩法切换载体 -->
		<router-view></router-view>
		<!-- 切换模式弹窗 -->
		<div class="login_wrap" v-show="typeModel">
			<div class="bg_model">
				<div class="ms_login">
					<p class="model_tips">温馨提示</p>
					<p class="model_content">当前模式已经切换</p>
					<p class="model_btn" @click="typeTabModelHide()">确定</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import bus from '../../assets/bus'
export default {
	data () {
		return{
			uid:'',
			deviceNo:'',
			modeTab:'GAME',
            localTab:'',
			typeModel:false,
			methodType:[{
				name:'胜平负',
				path:'winning'
	        },{
				name:'让球胜平负',
				path:'concede'
	        },{
				name:'比分',
				path:'score'
	        },{
				name:'总进球数',
				path:'totalGoals'
	        },{
				name:'半全场',
				path:'halfAll'
	        },{
				name:'混合过关',
				path:'mixing'
	        }],
//        	typeIdex: this.$route.path.slice(1),
        	typeIdex: 'winning',
		}
	},
	created(){
		let _this = this;
        localStorage.setItem('localTypeTab','');
		this.getRequest();
		this.firstGetType();
		setInterval(function(){
			_this.getType();
		},2000);
		//console.log(this.modeTab);
	},
	methods:{
		// 获取路由参数
		getRequest(){
			this.uid = this.$route.query.uid;
			this.deviceNo = this.$route.query.deviceNo;
			//console.log(this.uid);
		},
		// 第一次获取模式本地保存
		firstGetType(){
			let _this = this;
			let params = {
				deviceNo:this.deviceNo,
				// deviceNo:'0123456789ABCDE2',
			};
			//测试接口：http://dev.hcb66.com:7300
			//正式接口：http://v3api.hcb66.com
			_this.$http.post('http://dev.hcb66.com:7300/device/mode/query',params).then(function(res){
				// console.log(res.data);
				if(res.data.status == 10000){
					_this.modeTab = res.data.data;
//					localStorage.setItem('localTypeTab',_this.modeTab);
					_this.$router.replace({path:'/winning',query: {uid: _this.uid,deviceNo: _this.deviceNo}});
				}
			},function(err){
				console.log(err);
			})
		},
		// 轮询获取模式
		getType(){
			let _this = this;
			let params = {
				deviceNo:this.deviceNo,
				// deviceNo:'0123456789ABCDE2',
			};
			//测试接口：http://dev.hcb66.com:7300
			//正式接口：http://v3api.hcb66.com
			_this.$http.post('http://dev.hcb66.com:7300/device/mode/query',params).then(function(res){
				if(res.data.status == 10000){
					// console.log(res.data)
					_this.localTab = res.data.data;
//					_this.localTab = localStorage.getItem('localTypeTab');
//                    console.log(_this.localTab)
					if(_this.localTab === _this.modeTab){
						_this.typeModel = false;
					}else{
//					    alert('这是home的 '+_this.localTab);
//					    alert('这是home的 '+_this.modeTab);
						_this.typeModel = true;
                        _this.modeTab = _this.localTab;
//						localStorage.setItem('localTypeTab',_this.modeTab);
						_this.emitModeType();
						setTimeout(function(){
							_this.typeModel = false;
						},5000)
					}
				}
			},function(err){
				console.log(err);
			})
		},
		// 组件通信
		emitModeType(){
//		  	alert('modeTab的---'+this.modeTab);
//		  	alert('home的local---'+localStorage.getItem('localTypeTab'));
			bus.$emit('getModeType',this.localTab);
		},
		// 玩法类型选择
		type(index,item){
			this.typeIdex = item.path;
			this.$router.replace({path:item.path,query: {uid: this.uid,deviceNo: this.deviceNo}});
		},
        // 隐藏切换模式弹窗
        typeTabModelHide(){
        	this.typeModel = false;
        },
	},
}
</script>

<style scoped>
/*.redBg{
	background: red;
	color: white;
}*/
.game_type{
	/*transition:0.5s;*/
	background: #7034b0;
}
.lottery_type{
	/*transition:0.5s;*/
	background: #2a3040;
}
.game_type_btn{
	background: #7a41df;
}
.lottery_type_btn{
	background: #373c52;
}

.home{
	position: relative;
	width: 100%;
	/*background: #2a3040;*/
	height: 100vh;
	color: white;
}
header{
	font-size: 0;
	height: 60px;
	line-height: 60px;
	width: 100%;
	padding: 0 40px;
	/*background: #fff;*/
	color: white;
}
header .logo{
	display: inline-block;
	width: 40px;
	height: 40px;
	vertical-align: top;
	margin: 10px 10px 0 0;
}
header span{
	font-size: 30px;
}
.type_select{
    padding: 0 30px;
    color: white;
    border-bottom: 1px solid white;
}
.type_select .select_btn .method_type{
	display: inline-block;
	padding: 0 20px;
	height: 40px;
	line-height: 40px;
	margin: 10px 10px 0;
	text-align: center;
	border: 1px solid #ccc9c9;
	border-bottom: none;
	font-size: 20px;
}
.method_type a{
	display: block;
	color: white;
	outline: none;
}
.classname{
	background: #ff51aa;
	color: white;
}

/*模式切换model*/
.login_wrap{
	width: 100%;
	height: 100%;
	text-align: center;
}
.bg_model{
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0,0,0,0.6);
	z-index: 900;
}
.ms_login{
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 20%;
	height: 180px;
	margin: auto;
	border-radius: 10px;
	background: white;
}
.model_tips{
	height: 50px;
	line-height: 50px;
	color: #373c52;
	font-weight: 600;
	border-bottom: 1px solid #ccc9c9;
}
.model_content{
	height: 80px;
	line-height: 80px;
	color: #373c52;
	border-bottom: 1px solid #ccc9c9;
}
.model_btn{
	width: 100%;
	height: 50px;
	line-height: 50px;
	color: red;
}

</style>




