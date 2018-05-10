<template>
	<div class="home">
		<div v-title>竞彩足球</div>
		<header>
			<img src="./fotbal.png" alt="logo" class="logo">
			<span>竞彩足球</span>
		</header>
		<!-- 玩法切换 -->
		<div class="type_select">
			<ul class="select_btn">
				<li v-for="(item,index) in methodType" @click="type(index,item)" class="method_type" :class="{classname: index==typeIdex}">{{item.name}}</li>
			</ul>
		</div>
		<section v-if="methodTab">
			<!-- left赛事选择区 -->
			<div class="match">
				<p class="match_number">共 {{leftBlock.length}} 场比赛可投注</p>
				<ul class="match_ul">
					<li v-for="(items,index) in leftBlock" class="match_li">
						<p class="match_titel">{{items.title}}</p>
						<div class="match_detail">
							<div class="one_info match_select">
								<p class="oneLogo" v-if="items.gameType=='dg'">单</p>
								<p class="match_date">{{items.date}}</p>
								<p class="country">{{items.country}}</p>
								<p class="match_time">{{items.time}}</p>
							</div>
							<div v-for="(innerItem,innerIndex) in items.type" class="match_select match_block" :class="{'actives': curIndexs.indexOf(index + '' + innerIndex) >= 0}" @click="ChooseRed(index,items,innerItem,innerIndex)">{{innerItem}}</div>
						</div>
					</li>
				</ul>
			</div>
			<!-- right赛事选择区 -->
			<div class="betting_detail">
				<div v-if="detailShow">
					<div v-show="bettingTitle">
						<p class="betting_title">投注明细</p>
						<div class="betting_index">
							<p class="betting_number">场次</p>
						</div>
						<div class="betting_info">
							<p class="betting_mingxi">明细</p>
						</div>
					</div>
					<!-- 序号 -->
					<ul>
						<li v-for="temp in rightArr" v-if="temp.title != ''">
							<div class="index">{{temp.date}}</div>
							<!-- 已选择赛事 -->
							<ul class="have_chosen">
								<li class="betting_block">
									<p class="block_title">{{temp.title}}</p>
									<ul>
										<li class="detail_home" v-show="temp.type[0]">胜 {{temp.type[0]}}</li>
										<li class="detail_level" v-show="temp.type[1]">平 {{temp.type[1]}}</li>
										<li class="detail_away" v-show="temp.type[2]">负 {{temp.type[2]}}</li>
									</ul>
								</li>
							</ul>
						</li>
					</ul>
				</div>
				<div v-else>
					<p style="text-align:center;margin-top:400px;">暂无选择场次</p>
				</div>
			</div>
			<!-- 右下投注详情 -->
			<div class="bottom_detail">
				<ul class="type_method_ul">
					<li class="type_method" v-if="index<=rightArr.length-2" v-for="(typeMethodBlock,index) in typeMethodSelect" @click="chuanSelect(typeMethodBlock,index)" :class="{classname: index==chuanIdex,classname2:index!==chuanIdex}">{{typeMethodBlock}}</li>
				</ul>
				<div class="select_result">
					<p class="bottom_text" style="display:inline-block;"><span v-if="gameNumShow">共选择{{gameNum}}场比赛</span> <span v-show="typeMethodShow">{{typeMethodNum}}串1</span><span v-show="typeMethodShowFont">单关</span> 共{{bettingNum}}注 {{bettingNum*2*100*times}}积分</p>
					<div style="display:inline-block;">
				        <span class="reduce" @click="reduce()">－</span>
				        <input type="number" class="times" v-model="times">
				        <span class="add" @click="add()">＋</span>
				        <span class="max_add" @click="maxAdd()">99倍</span>
				    </div>
				</div>
			    <div>
			    	<span class="delete_order" @click="deleteAll()">清空订单</span>
			    	<span class="submit_order" :class="{isSub_btn,isSub_btn_red}" v-show="submitBtn1" @click="submit()">提交订单</span>
			    	<span class="submit_order2" v-show="submitBtn2" @click="submit()">提交订单</span>
			    </div>
			</div>
		</section>

		<!-- 敬请期待 -->
		<p style="text-align:center;margin-top:200px" v-else>敬请期待</p>
		<tips v-if="tipsShow" title="请至少选择两场比赛"></tips>
		<tipsPrice v-if="tipsShowPrice" title="单注最大积分不能超过200万"></tipsPrice>
		<tipsExceed v-if="tipsShowExceed" title="最大比赛场次不能超过8场"></tipsExceed>
	</div>
</template>

<script>
import Tips from '../common/tips'
import TipsPrice from '../common/tips'
import TipsExceed from '../common/tips'
export default {
	components:{Tips,TipsPrice,TipsExceed},
	data () {
		return{
			methodType:[{
				name:'胜平负',
	        },{
				name:'让球胜平负',
	        },{
				name:'比分',
	        },{
				name:'总进球数',
	        },{
				name:'半全场',
	        },{
				name:'混合过关',
	        }],
	        methodTab:true,
	        typeMethodSelect:['2串1','3串1','4串1','5串1','6串1','7串1','8串1',],
        	typeIdex: "0",
        	chuanIdex: "0",
        	chuanIdexArr: [],
        	chuanIdexName: 0,
        	detailShow: false,
        	leftBlock:[],
			isRedBg:false,
			bettingTitle: true,
        	times:1,
        	gameNum:0,
        	gameNumShow:false,
        	bettingNum:0,
        	total:0,
			curIndexs: [],//
			rightArr: [],//
			testData: [],
			chuanIdex:[],//
			complexArr:[],//
			typeMethodNum: 0,//
			typeMethodShow: false,//
			typeMethodShowFont: false,//
			x2: 2,//
			x3: 3,//
			x4: 4,//
			x5: 5,//
			x6: 6,//
			x7: 7,//
			x8: 8,//
			isSub_btn:true,
			isSub_btn_red:false,
			submitBtn1:true,
			submitBtn2:false,
			tipsShow:false,
			tipsShowPrice:false,
			tipsShowExceed:false,
		}
	},
	created(){
		this.query();
	},
	methods:{
		query(){
			let _this = this;
			let params = {
				lotteryId: 'spf'
			};
			_this.$http.post('/jz/queryAgainstList',params).then((res)=>{
				console.log(res.data.leftBlock);
				if(res.data.code == 10000){
					this.leftBlock = res.data.leftBlock;
				}
			})
		},
		// 点击选择比赛结果
		ChooseRed(index,items,innerItem,innerIndex){
			let _this = this;
			let temIndex = index + '' + innerIndex
			let temInd = this.curIndexs.indexOf(temIndex);
			let params = {
				title:'',
				type:['','',''],
				date:'',
				idex:index,
				matchId:'',
				gameType:'',
			};
			if(temInd >= 0){
				this.curIndexs.splice(temInd, 1);
				for(var i=0;i<this.rightArr.length;i++){
					let oparams = this.rightArr[i];
					if(oparams.idex == params.idex){
						oparams.type[innerIndex]='';
						if(oparams.type[0] == ''&&oparams.type[1] == ''&&oparams.type[2] == ''){
							this.rightArr.splice(i,1);
						};
					}
				};
			}else{
				if(this.rightArr.length > 7){
					for(var i=0;i<this.rightArr.length;i++){
						let cparams = null;
						if(this.rightArr[i].idex == params.idex){
							cparams = this.rightArr[i];
							cparams.type[innerIndex] = innerItem;
							this.curIndexs.push(temIndex);
							this.tipsShowExceed = false;
							return;
						}else{
				        	this.tipsShowExceed = true;
				        	setTimeout(function(){
					        	_this.tipsShowExceed = false;
				        	},2000);
						}
					};
				}else{
					params.title = items.title;
					params.date = items.date;
					params.matchId = items.matchId;
					params.gameType = items.gameType;
					this.curIndexs.push(temIndex);

					if(this.rightArr.length > 0){
						for(var i=0;i<this.rightArr.length;i++){
							let cparams = null;
							if(this.rightArr[i].idex == params.idex){
								cparams = this.rightArr[i];
								cparams.type[innerIndex] = innerItem;
								return;
							}
						};
					};
					params.type[innerIndex] = innerItem;
					this.rightArr.push(params);
				}
			};
					// console.log(this.curIndexs);
		},
		//去掉type为空的选项
		test(){
			this.testData = [];
			this.testData = JSON.parse(JSON.stringify(this.rightArr));
			let testData = this.testData;
			// 循环去掉type为空的选项
			for(var i=0;i<testData.length;i++){
				let aparams = testData[i];
				for(var j=0,len=aparams.type.length;j<len;j++){
					if(aparams.type[j]==""){
						aparams.type.splice(j,1);
						len--;
						if(aparams.type[j]==""){
							aparams.type.splice(j,1);
							len--;
						}
					}
				}
			}
			// 循环获取每场比赛选项的长度
			let jcArr = [];
			for(var i=0;i<testData.length;i++){
				jcArr.push(testData[i].type.length);
			}
			this.bettingNum = Math.round(this.jC(jcArr));
		},
		// 串关循环
		chuanGuan(){
			// this.bettingNum = 0;
			this.complexArr = [];
			this.complexArr = JSON.parse(JSON.stringify(this.rightArr));
			// 循环去掉type为空的选项
			for(var i=0;i<this.complexArr.length;i++){
				let aparams = this.complexArr[i];
				for(var j=0,len=aparams.type.length;j<len;j++){
					if(aparams.type[j]==""){
						aparams.type.splice(j,1);
						len--;
						if(aparams.type[j]==""){
							aparams.type.splice(j,1);
							len--;
						}
					}
				}
			}
			this.chuanZhJc();
		},
		// 串关组合阶乘
		chuanZhJc(){
			let partArr = this.chooseZH(this.complexArr,this.chuanIdexName);
			let chuanGuanNum = [];
			for(var i=0;i<partArr.length;i++){
				// 循环获取每场比赛选项的长度
				let jcArrLen = [];
				let partArr2 = partArr[i];
				for(var j=0;j<partArr2.length;j++){
					jcArrLen.push(partArr2[j].type.length);
				}
				chuanGuanNum.push(Math.round(this.jC(jcArrLen)));
			}
			// console.log(chuanGuanNum);
			this.bettingNum = this.jJia(chuanGuanNum);
			// console.log(this.bettingNum);
		},
		// 玩法类型选择
		type(index,item){
			this.typeIdex = index;
			if(index == 0){
				this.methodTab = true;
			}
			if(index == 1||index == 2||index == 3||index == 4||index == 5){
				this.methodTab = false;
			}
		},
		// 串数玩法选择
		chuanSelect(typeMethodBlock,index){
			this.chuanIdex = index;
			this.chuanIdexName = 0;
			this.chuanIdexArr.push(index);
			if(typeMethodBlock == '2串1'){
				this.chuanIdexName = 2;
			}
			if(typeMethodBlock == '3串1'){
				this.chuanIdexName = 3;
			}
			if(typeMethodBlock == '4串1'){
				this.chuanIdexName = 4;
			}
			if(typeMethodBlock == '5串1'){
				this.chuanIdexName = 5;
			}
			if(typeMethodBlock == '6串1'){
				this.chuanIdexName = 6;
			}
			if(typeMethodBlock == '7串1'){
				this.chuanIdexName = 7;
			}
			if(typeMethodBlock == '8串1'){
				this.chuanIdexName = 8;
			}
			this.chuanGuan();
		},
		// 减倍数
        reduce(){
        	this.times--;
        	if(this.times<1){
          	this.times=1;
        	}
        	// this.tableDemo.multiple = this.times;
      	},
      	// 增加倍数
      	add(){
	        this.times++;
	        if(this.times>99){
	          this.times=99;
	        }
	        // this.tableDemo.multiple = this.times;
      	},
      	// 最大倍数
      	maxAdd(){
        	this.times = 99;
        	// this.tableDemo.multiple = this.times;
      	},
      	// 清空
      	deleteAll(){
      		this.rightArr = [];
      		this.curIndexs = [];
      		this.chuanIdex = [];
      		this.typeMethodShow = false;
      		this.gameNumShow = false;
      		this.bettingNum = 0;
      	},
      	//阶加
      	jJia(arry){
	        var sum3 = 0;
	        for(var i=0;i<arry.length;i++){
	          sum3 += arry[i]
	        }
	        return sum3
	    },
      	//默认阶乘
      	jC(num){
	        var sum = 1;
	        for(var i=0;i<num.length;i++){
	          sum *= num[i]
	        }
	        return sum
	    },
		// 递归组合
		chooseZH(arr, size) {
            var allResult = [];
            (function haveFun(arr, size, result) {
                var arrLen = arr.length;
                if (size > arrLen) {
                    return;
                }
                if (size == arrLen) {
                    allResult.push([].concat(result, arr))
                } else {
                    for (var i = 0 ; i < arrLen; i++) {
                        var newResult = [].concat(result);
                        newResult.push(arr[i]);

                        if (size == 1) {
                            allResult.push(newResult);
                        } else {
                            var newArr = [].concat(arr);
                            newArr.splice(0, i + 1);
                            haveFun(newArr, size - 1, newResult);
                        }
                    }
                }
            })(arr, size, []);
            return allResult;
        },
        // 提交订单
        submit(){
        	let _this = this;
        	let params = {
        		userId:'5a72e459f57b05216546d540',
        		deviceNo:'0123456789ABCDE2',
        		lotteryName:'jz',
        		moneySum:this.bettingNum*2,
        		tableData:{
        			playName:'spf',
        			playType:this.typeMethodNum+'*1',
        			dzList:this.rightArr,
        			multiple:this.times,
        			investCount:this.bettingNum,
        		},
        	};
        	this.submitBtn1 = false;
        	this.submitBtn2 = true;

        	// 判断最终投注金额或倍数是否满足规则
        	if(this.bettingNum > 0 && this.times !== ''){
        		let totalPrice = this.bettingNum*this.times*2*100;
        		// 判断投注金额是否超过2万
        		if(totalPrice > 2000000){
        			// console.log('金额太大');
		        	this.tipsShowPrice = true;
	        		this.submitBtn1 = true;
		        	this.submitBtn2 = false;
		        	setTimeout(function(){
			        	_this.tipsShowPrice = false;
		        	},2000);
        		}else{
			    	_this.$http.post('/jz/betting',params).then((res)=>{
			    		console.log(res.data);
			    		if(res.data.code == 10000){
				        	this.submitBtn1 = true;
				        	this.submitBtn2 = false;
				        	// 相关数据清空
				        	this.rightArr = [];
				        	this.curIndexs = [];
				        	this.bettingNum = 0;
				        	this.typeMethodShow = false;
			    		}
			    	},(err)=>{
			    		console.log(err);
			    	})
        		}
        	}else{
	        	this.tipsShow = true;
        		this.submitBtn1 = true;
	        	this.submitBtn2 = false;
	        	setTimeout(function(){
		        	_this.tipsShow = false;
	        	},2000);
        	}
        },
	},
	updated(){
		if(this.chuanIdexArr.length == 0){
			if(this.rightArr.length == 0){
				this.gameNumShow = false;
				this.detailShow = false;
				this.typeMethodShow = false;
				this.typeMethodShowFont = false;
				this.bettingNum = 0;
			}else{
				this.gameNumShow = true;
				this.detailShow = true;
				// 判断是否支持单关
				if(this.rightArr.length == 1){
					this.gameNum = 1;
					if(this.rightArr[0].gameType == 'dg'){
						this.test();
						this.typeMethodShow = false;
						this.typeMethodShowFont = true;
						this.typeMethodNum = 1;
					}else{
						this.typeMethodShow = false;
						this.typeMethodShowFont = false;
						this.bettingNum = 0;
					}
				}else{
					if(this.rightArr.length == 2){
						this.typeMethodNum = this.x2;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 2;
						this.test();
					}
					if(this.rightArr.length == 3){
						this.typeMethodNum = this.x3;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 3;
						this.test();
					}
					if(this.rightArr.length == 4){
						this.typeMethodNum = this.x4;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 4;
						this.test();
					}
					if(this.rightArr.length == 5){
						this.typeMethodNum = this.x5;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 5;
						this.test();
					}
					if(this.rightArr.length == 6){
						this.typeMethodNum = this.x6;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 6;
						this.test();
					}
					if(this.rightArr.length == 7){
						this.typeMethodNum = this.x7;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 7;
						this.test();
					}
					if(this.rightArr.length == 8){
						this.typeMethodNum = this.x8;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 8;
						this.test();
					}

					// 选择比赛场次超过8场

					// if(this.rightArr.length > 7){
					// 	this.chuanIdexName = 8;
					// 	this.chuanGuan();
					// 	this.typeMethodNum = this.x8;
					// 	this.typeMethodShow = true;
					// 	if(this.rightArr.length == 8){
					// 		this.gameNum = 8;
					// 	}
					// 	if(this.rightArr.length == 9){
					// 		this.gameNum = 9;
					// 	}
					// 	if(this.rightArr.length == 10){
					// 		this.gameNum = 10;
					// 	}
					// 	if(this.rightArr.length == 11){
					// 		this.gameNum = 11;
					// 	}
					// 	if(this.rightArr.length == 12){
					// 		this.gameNum = 12;
					// 	}
					// 	if(this.rightArr.length == 13){
					// 		this.gameNum = 13;
					// 	}
					// 	if(this.rightArr.length == 14){
					// 		this.gameNum = 14;
					// 	}
					// 	if(this.rightArr.length == 15){
					// 		this.gameNum = 15;
					// 	}
					// }
				}
			}
		}else{
			if(this.rightArr.length !== 0){
				this.chuanGuan();
				if(this.chuanIdexName == 2){
					this.typeMethodNum = this.x2;
					this.typeMethodShow = true;
				}
				if(this.chuanIdexName == 3){
					this.typeMethodNum = this.x3;
					this.typeMethodShow = true;
				}
				if(this.chuanIdexName == 4){
					this.typeMethodNum = this.x4;
					this.typeMethodShow = true;
				}
				if(this.chuanIdexName == 5){
					this.typeMethodNum = this.x5;
					this.typeMethodShow = true;
				}
				if(this.chuanIdexName == 6){
					this.typeMethodNum = this.x6;
					this.typeMethodShow = true;
				}
				if(this.chuanIdexName == 7){
					this.typeMethodNum = this.x7;
					this.typeMethodShow = true;
				}
				if(this.chuanIdexName == 8){
					this.typeMethodNum = this.x8;
					this.typeMethodShow = true;
				}
			}
		}
		if(this.times>99){
			this.times = 99;
		}
		if(this.times == ''){
			this.times = 1;
		}
		if(this.bettingNum>0){
			this.isSub_btn = false;
			this.isSub_btn_red = true;
		}else{
			this.isSub_btn = true;
			this.isSub_btn_red = false;
		}
		
	}
}
</script>

<style scoped>
.redBg{
	background: red;
	color: white;
}
.home{
	position: relative;
	width: 100%;
	height: 100vh;
}
header{
	font-size: 0;
	height: 60px;
	line-height: 60px;
	width: 100%;
	padding: 0 40px;
	/*border-bottom: 1px solid #e4e4e4;*/
	background: #fff;
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
    background: white;
    border-bottom: 1px solid red;
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
.classname{
	background: red;
	color: white;
}

/*左边赛事选择*/
section{
	padding: 0 40px;
}
.match{
	display: inline-block;
	width: 50%;
	height: 85vh;
	overflow: auto;
	/*border: 1px solid red;*/
	text-align: center;
}
.match_li{
	margin-bottom: 20px;
}
.match_titel{
	padding: 5px 0;
}
.match_number{
	text-align: left;
	padding: 20px 0;

}
.match_detail{
	display: flex;
}
.match_select{
	position: relative;
	flex: 1;
	height: 90px;
}
.match_block{
	border: 1px solid #c4c4c4;
	line-height: 90px;
	background: #fff;
}

/*右侧赛事明细*/
.betting_detail{
	display: inline-block;
	width: 49%;
	height: 70vh;
	overflow: auto;
	/*border: 1px solid red;*/
	padding: 0 3%;
	float: right;
}
.betting_title{
	display: block;
	text-align: center;
	padding: 20px 0;
}
.betting_index{
	display: inline-block;
	width: 18%;
}
.betting_info{
	display: inline-block;
	width: 81%;
	text-align: center;
	padding-bottom: 20px;
}
/*已经选择赛事*/
.index,.have_chosen{
	display: inline-block;
	margin-bottom: 20px;
}
.index{
	width: 19%;
	height: 90px;
	line-height: 90px;
	vertical-align: top;
}
.have_chosen{
	width: 79%;
	height: 94px;
	border: 1px solid #c4c4c4;
	background: #fff;
}
.betting_block{
	border: 1px solid #c4c4c4;
	background: #fff;
	font-size: 0;
}
.betting_block>ul{
	position: relative;
}
.block_title{
	text-align: center;
	height: 40px;
	line-height: 40px;
	font-size: 20px;
	border-bottom: 1px solid #e4e4e4;
}
.detail_home{
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 33.333%;
	height: 50px;
	line-height: 50px;
	background: red;
	text-align: center;
	font-size: 20px;
	color: white;
}
.detail_level{
	position: absolute;
	top: 0;
	left: 33.333%;
	bottom: 0;
	width: 33.333%;
	height: 50px;
	line-height: 50px;
	background: blue;
	text-align: center;
	font-size: 20px;
	color: white;
}
.detail_away{
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	width: 33.333%;
	height: 50px;
	line-height: 50px;
	background: green;
	text-align: center;
	font-size: 20px;
	color: white;
}
/*右下投注操作区*/
.bottom_detail{
	position: absolute;
	top: 83vh;
	left: 50.9%;
	right: 40px;
	bottom: 0;
}
.bottom_detail{
	text-align: right;
}
.bottom_text{
	margin: 10px 0;
	font-size: 20px;
}
.reduce,.add,.max_add{
	display: inline-block;
	width: 50px;
	height: 50px;
	line-height: 50px;
	text-align: center;
	border: 1px solid #e4e4e4;
	background: #fff;
}
.times{
	display: inline-block;
	width: 80px;
	height: 50px;
	line-height: 50px;
	outline: none;
	border: 1px solid #e4e4e4;
	vertical-align: top;
	font-size: 20px;
	text-align: center;
}
.classname2{
	background: #fff;
	color: #000;
}
.type_method_ul{
	height: 40px;
}
.type_method{
	display: inline-block;
	width: 100px;
	height: 40px;
	line-height: 40px;
	margin: 0 0 0 15px;
	text-align: center;
	border-radius: 5px;
}
.select_result{
	margin: 10px 0;
}
.delete_order,.submit_order{
	display: inline-block;
	width: 100px;
	height: 50px;
	line-height: 50px;
	border: 1px solid #e4e4e4;
	background: #fff;
	text-align: center;
}
.submit_order{
	margin-left: 10px;
}
.submit_order2{
	display: inline-block;
	width: 100px;
	height: 50px;
	line-height: 50px;
	margin-left: 10px;
	/*border: 1px solid #e4e4e4;*/
	background: #e4e4e4;
	text-align: center;
	/*background: blue;*/
	color: white;
}
.isSub_btn{
	background: #c4c4c4;
	color: white;
}
.isSub_btn_red{
	background: red;
	color: white;
}

.reduce:active{
	background: #c4c4c4;
}
.add:active{
	background: #c4c4c4;
}
.max_add:active{
	background: #c4c4c4;
}
.delete_order:active{
	background: #c4c4c4;
}
.submit_order:active{
	background: #c4c4c4;
}
.actives{
	background: #f00;
	color: #000;
}
.oneLogo{
	width: 30px;
    height: 30px;
    background: red;
    position: absolute;
    top: 0;
    left: 0;
    color: white;
 }
</style>




