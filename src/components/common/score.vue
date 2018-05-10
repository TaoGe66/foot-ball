<template>
	<div class="score">

		<!-- 比分 -->
		<section v-if="methodTab">
			<!-- left赛事选择区 -->
			<div class="match">
				<p class="match_number">共 {{leftBlock.length}} 场比赛可选择</p>
				<ul class="match_ul">
					<li v-for="(items,index) in leftBlock" class="match_li">
						<p class="oneLogo" v-if="items.gameType=='dg'">单</p>
						<div class="match_detail">
							<div class="one_info match_select">
								<p class="match_date">{{items.date}}</p>
								<p class="country">{{items.country}}</p>
								<p class="match_time">{{items.time}}</p>
							</div>
							<p class="match_titel">
								<span>{{items.title}}</span>
								<span class="match_detail_btn" :class="modeTab=='TD'?'lottery_type_btn':'game_type_btn'" @click="selectDetail(index)">点击选择</span>
							</p>
						</div>
						<!-- 投注选项区域 -->
						<div class="match_detail_block" :class="{match_detail_block1:matchDetailBlock.indexOf(index)==-1}">
							<div class="spf_title">
								<p class="match_select_p">胜</p>
								<p class="match_select_p">平</p>
								<p class="match_select_p">负</p>
							</div>
							<div style="margin-left:40px;">
								<!-- 第一、二、三排 胜平负 -->
								<ul style="font-size:0;">
									<li v-for="(innerItem,innerIndex) in items.liveSp" class="match_block_spf" :class="{'actives': curIndexs.indexOf(index + '' + innerIndex) >= 0,'duandian':innerIndex==17,'lottery_type_btn':modeTab=='TD','game_type_btn':modeTab=='GAME'}" @touchstart="ChooseRed(index,items,innerItem,innerIndex)">
										<div style="margin-bottom:5px;">{{innerItem.BF}}</div>
										<div style="font-weight:600;">{{innerItem.PL}}</div>
									</li>
								</ul>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<!-- right赛事选择区 -->
			<div class="betting_detail">
				<div v-if="detailShow">
					<div v-show="bettingTitle">
						<p class="betting_title">选择明细</p>
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
									<ul style="text-align:center;">
										<li class="detail_home" v-for="innerTemp in temp.liveSp">{{innerTemp.BF}}</li>
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
					<li class="type_method" v-if="index<=rightArr.length-2" v-for="(typeMethodBlock,index) in typeMethodSelect" @click="chuanSelect(typeMethodBlock,index)" :class="{'lottery_type_btn':modeTab=='TD','game_type_btn':modeTab=='GAME'}" :style="{background:index==chuanIdexAAA?'#ff51aa':'transparent'}">{{typeMethodBlock}}</li>
				</ul>
				<div class="select_result">
					<p class="bottom_text" style="display:inline-block;"><span v-if="gameNumShow">共选择{{gameNum}}场比赛</span> <span v-show="typeMethodShow">{{typeMethodNum}}串1</span><span v-show="typeMethodShowFont">单关</span> 共{{bettingNum}}注 {{bettingNum*2*100*times}}<span v-if="modeTab=='TD'">积分</span><span v-if="modeTab=='GAME'">金豆</span></p>
					<div style="display:inline-block;">
				        <span class="reduce" :class="modeTab=='TD'?'lottery_type_btn':'game_type_btn'" @click="reduce()">－</span>
				        <input type="number" class="times" :class="modeTab=='TD'?'lottery_type':'game_type'" v-model="times">
				        <span class="add" :class="modeTab=='TD'?'lottery_type_btn':'game_type_btn'" @click="add()">＋</span>
				        <span class="max_add" :class="modeTab=='TD'?'lottery_type_btn':'game_type_btn'" @click="maxAdd()">99倍</span>
				    </div>
				</div>
			    <div>
			    	<span class="delete_order" :class="modeTab=='TD'?'lottery_type_btn':'game_type_btn'" @click="deleteAll()">清空订单</span>
			    	<span class="submit_order" :class="{isSub_btn,isSub_btn_red}" v-show="submitBtn1" @click="submit()">提交订单</span>
			    	<span class="submit_order2" v-show="submitBtn2">提交订单</span>
			    </div>
			</div>
		</section>

		<!-- tips -->
		<tips v-if="tipsShow" title="请至少选择两场比赛"></tips>
		<tipsPrice v-if="tipsShowPrice" title="单注最大积分不能超过200万"></tipsPrice>
		<tipsPrice v-if="tipsShowPriceJd" title="单注最大金豆不能超过200万"></tipsPrice>
		<tipsExceed v-if="tipsShowExceed" title="最大比赛场次不能超过4场"></tipsExceed>
		<!--<tipsMultiple v-if="tipsShowMultiple" title="倍数不能为空"></tipsMultiple>-->
		<model v-if="model" title="正在加载中..."></model>
	</div>
</template>

<script>
import Tips from './tips'
import TipsPrice from './tips'
import TipsExceed from './tips'
import TipsMultiple from './tips'
import Model from './model'
import bus from '../../assets/bus'
export default {
	components:{Tips,TipsPrice,TipsExceed,TipsMultiple,Model},
	data () {
		return{
			uid:'',
			deviceNo:'',
			modeTab:'GAME',
	        methodTab:true,
	        typeMethodSelect:['2串1','3串1','4串1','5串1','6串1','7串1','8串1',],
        	typeIdex: "0",
        	chuanIdexAAA: "9898",
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
          	tipsShowPriceJd:false,
			tipsShowExceed:false,
			tipsShowMultiple:false,
			model:false,
			matchDetailBlock:[],
		}
	},
	created(){
		let _this = this;
		this.model = true;
		this.getRequest();
      	this.firstGetType();
		this.query();
		bus.$on('getModeType',function(item){
            _this.modeTab = item;
            // console.log(item);
        });
	},
	methods:{
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
          }
        },function(err){
          console.log(err);
        })
      },
		// 获取路由参数
		getRequest(){
			this.uid = this.$route.query.uid;
			this.deviceNo = this.$route.query.deviceNo;
		},
		// 查询开盘赛事信息
		query(){
			let _this = this;
			let params = {
				lotteryId: 'bf'
			};
			_this.$http.post('/jz/queryAgainstList',params).then((res)=>{
				// console.log(res.data.leftBlock);
				if(res.data.code == 10000){
					setTimeout(function(){
						_this.model = false;
					},200);
					this.leftBlock = res.data.leftBlock;
				}
			})
		},
		// 投注选项详情展开
		selectDetail(index){
			if(this.matchDetailBlock.indexOf(index)>=0){
				for(var i=0;i<this.matchDetailBlock.length;i++){
					if(this.matchDetailBlock[i] == index){
						this.matchDetailBlock.splice(i,1);
					}
				}
			}else{
				this.matchDetailBlock.push(index);
			}
		},
		// 点击选择比赛结果
		ChooseRed(index,items,innerItem,innerIndex){
			let _this = this;
			let temIndex = index + '' + innerIndex
			let temInd = this.curIndexs.indexOf(temIndex);
			// 重新赋值定义innerItem值
			let innerIt = {
				PL:innerItem.PL,
				BF:innerItem.BF,
				innerInd:index + '' + innerIndex,
			};
			let params = {
				title:'',
				liveSp:[],
				date:'',
				idex:index,
				matchId:'',
				gameType:'',
				saleCloseTime:'',
			};
			if(temInd >= 0){
				this.curIndexs.splice(temInd, 1);
				for(var i=0;i<this.rightArr.length;i++){
					let oparams = this.rightArr[i];
					if(oparams.idex == params.idex){
						for(var j=0;j<oparams.liveSp.length;j++){
							if(oparams.liveSp[j].innerInd == temIndex){
								// console.log('-------终于找到一样的了--------')
								oparams.liveSp.splice(j,1);
							}
						}
						if(oparams.liveSp == ''){
							this.rightArr.splice(i,1);
						};
					}
				};
			}else{
				if(this.rightArr.length > 3){
					// 选择场次大于四场纵向禁止再选
					for(var i=0;i<this.rightArr.length;i++){
						let cparams = null;
						if(this.rightArr[i].idex == params.idex){
							cparams = this.rightArr[i];
							cparams.liveSp.push(innerIt);
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
					params.saleCloseTime = items.time;
					this.curIndexs.push(temIndex);

					if(this.rightArr.length > 0){
						for(var i=0;i<this.rightArr.length;i++){
							let cparams = null;
							if(this.rightArr[i].idex == params.idex){
								cparams = this.rightArr[i];
								cparams.liveSp.push(innerIt);
								// console.log('___________这是return的___________')
								return;
							}
						};
					};
					params.liveSp.push(innerIt);
					this.rightArr.push(params);
				}
			};
			// console.log(this.curIndexs);
			// console.log(this.rightArr);
		},
		// 循环获取每场比赛选项的长度
		test(){
			this.testData = [];
			this.testData = JSON.parse(JSON.stringify(this.rightArr));
			let testData = this.testData;
			let jcArr = [];
			for(var i=0;i<testData.length;i++){
				jcArr.push(testData[i].liveSp.length);
			}
			this.bettingNum = Math.round(this.jC(jcArr));
		},
		// 串关循环
		chuanGuan(){
			// this.bettingNum = 0;
			this.complexArr = [];
			this.complexArr = JSON.parse(JSON.stringify(this.rightArr));
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
					jcArrLen.push(partArr2[j].liveSp.length);
				}
				chuanGuanNum.push(Math.round(this.jC(jcArrLen)));
			}
			this.bettingNum = Math.round(this.jJia(chuanGuanNum));
		},
		// 串数玩法选择
		chuanSelect(typeMethodBlock,index){
			this.chuanIdexAAA = index;
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
			// if(typeMethodBlock == '5串1'){
			// 	this.chuanIdexName = 5;
			// }
			// if(typeMethodBlock == '6串1'){
			// 	this.chuanIdexName = 6;
			// }
			// if(typeMethodBlock == '7串1'){
			// 	this.chuanIdexName = 7;
			// }
			// if(typeMethodBlock == '8串1'){
			// 	this.chuanIdexName = 8;
			// }
			this.chuanGuan();
		},
		// 减倍数
        reduce(){
        	this.times--;
        	if(this.times<1){
          	this.times=1;
        	}
      	},
      	// 增加倍数
      	add(){
	        this.times++;
	        if(this.times>99){
	          this.times=99;
	        }
      	},
      	// 最大倍数
      	maxAdd(){
        	this.times = 99;
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
        // submit(){
        // 	let _this = this;
        // 	let params = {
        // 		userId:'5a72e459f57b05216546d540',
        // 		deviceNo:'0123456789ABCDE2',
        // 		lotteryName:'jz',
        // 		moneySum:this.bettingNum*2,
        // 		type:this.modeTab,
        // 		tableData:{
        // 			playName:'bf',
        // 			playType:this.typeMethodNum+'*1',
        // 			dzList:this.rightArr,
        // 			multiple:this.times,
        // 			investCount:this.bettingNum,
        // 		},
        // 	};
        // 	this.submitBtn1 = false;
        // 	this.submitBtn2 = true;
        // 	console.log(params);
        	
        // 	// 判断最终投注金额或倍数是否满足规则
        // 	if(this.times == ''||this.times == 0){
        // 		// console.log('fdfdfdfdfdf');
	       //  	this.tipsShowMultiple = true;
        // 		this.submitBtn1 = true;
	       //  	this.submitBtn2 = false;
	       //  	setTimeout(function(){
		      //   	_this.tipsShowMultiple = false;
	       //  	},2000);
        // 	}else{
        // 		let totalPrice = this.bettingNum*this.times*2*100;
        // 		// console.log(34567);
        // 		// 判断投注金额是否超过2万
        // 		if(totalPrice > 2000000){
        // 			// console.log('金额太大');
		      //   	this.tipsShowPrice = true;
	       //  		this.submitBtn1 = true;
		      //   	this.submitBtn2 = false;
		      //   	setTimeout(function(){
			     //    	_this.tipsShowPrice = false;
		      //   	},2000);
        // 		}else{
			    	// _this.$http.post('/jz/betting',params).then((res)=>{
			    	// 	console.log(res.data);
			    	// 	if(res.data.code == 10000){
				    //     	this.submitBtn1 = true;
				    //     	this.submitBtn2 = false;
				    //     	// 相关数据清空
				    //     	this.rightArr = [];
				    //     	this.curIndexs = [];
				    //     	this.bettingNum = 0;
				    //     	this.typeMethodShow = false;
			    	// 	}
			    	// },(err)=>{
			    	// 	console.log(err);
			    	// })
        // 		}
        // 	}
        // },
        submit(){
        	let _this = this;
        	if(this.bettingNum<1){
	        	this.submitBtn1 = true;
	        	this.submitBtn2 = false;
	        	this.tipsShow = true;
	        	setTimeout(function(){
		        	_this.tipsShow = false;
	        	},2000);
	        }else{	
	        	this.submitBtn1 = false;
	        	this.submitBtn2 = true;
	        	// 判断最终投注金额或倍数是否满足规则
	        	if(this.times == ''||this.times == 0){
		        	this.times = 1;
	        	}
        		let totalPrice = this.bettingNum*this.times*2*100;
	        	let params = {
	        		// userId:'5aa10087adfa2f0171c338bf',
	        		// deviceNo:'8BE30ACC19DF22D',
	        		userId:this.uid,
	        		deviceNo:this.deviceNo,
	        		lotteryName:'jz',
	        		moneySum:this.bettingNum*2*this.times,
	        		type:this.modeTab,
	        		tableData:{
	        			playName:'bf',
	        			playType:this.typeMethodNum,
	        			dzList:this.rightArr,
	        			multiple:this.times,
	        			investCount:this.bettingNum,
	        		},
	        	};
	        	// console.log(params);
        		// 判断投注金额是否超过2万
        		if(totalPrice > 2000000){
        			// console.log('金额太大');
                  	if(this.modeTab == 'TD'){
						this.tipsShowPrice = true;
						setTimeout(function(){
						  _this.tipsShowPrice = false;
						},2000);
                  	}else {
						this.tipsShowPriceJd = true;
						setTimeout(function(){
						  _this.tipsShowPriceJd = false;
						},2000);
                  	}
                  	this.submitBtn1 = true;
                  	this.submitBtn2 = false;
        		}else{
		        	this.model = true;
			    	_this.$http.post('/jz/betting',params).then((res)=>{
			    		console.log(res.data);
						let msg = res.data.data;
			    		if(res.data.code == 10000){
			    			_this.model = false;
							_this.toastMessage(msg);
							_this.callBackPay();
				        	_this.submitBtn1 = true;
				        	_this.submitBtn2 = false;
			    		}
			    	},(err)=>{
			    		console.log(err);
			    	})
        		}
        	}
        },
		callBackPay(){
			// 相关数据清空
			this.rightArr = [];
			this.curIndexs = [];
			this.bettingNum = 0;
			this.times = 1;
			this.typeMethodShow = false;
          	this.chuanIdexAAA = '98898';
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
				this.chuanIdex = "0";
				this.chuanIdexArr = [];
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
					// if(this.rightArr.length == 5){
					// 	this.typeMethodNum = this.x5;
					// 	this.typeMethodShow = true;
					// 	this.typeMethodShowFont = false;
					// 	this.gameNum = 5;
					// 	this.test();
					// }
					// if(this.rightArr.length == 6){
					// 	this.typeMethodNum = this.x6;
					// 	this.typeMethodShow = true;
					// 	this.typeMethodShowFont = false;
					// 	this.gameNum = 6;
					// 	this.test();
					// }
					// if(this.rightArr.length == 7){
					// 	this.typeMethodNum = this.x7;
					// 	this.typeMethodShow = true;
					// 	this.typeMethodShowFont = false;
					// 	this.gameNum = 7;
					// 	this.test();
					// }
					// if(this.rightArr.length == 8){
					// 	this.typeMethodNum = this.x8;
					// 	this.typeMethodShow = true;
					// 	this.typeMethodShowFont = false;
					// 	this.gameNum = 8;
					// 	this.test();
					// }
				}
			}
		}else{
			if(this.rightArr.length == 0){
				this.gameNumShow = false;
				this.detailShow = false;
				this.typeMethodShow = false;
				this.typeMethodShowFont = false;
				this.bettingNum = 0;
				this.chuanIdex = "0";
				this.chuanIdexArr = [];
			}else{
				this.gameNumShow = true;
				this.detailShow = true;
			}
			if(this.rightArr.length !== 0){
				this.chuanGuan();
				this.gameNum = this.rightArr.length;
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
				// if(this.chuanIdexName == 5){
				// 	this.typeMethodNum = this.x5;
				// 	this.typeMethodShow = true;
				// }
				// if(this.chuanIdexName == 6){
				// 	this.typeMethodNum = this.x6;
				// 	this.typeMethodShow = true;
				// }
				// if(this.chuanIdexName == 7){
				// 	this.typeMethodNum = this.x7;
				// 	this.typeMethodShow = true;
				// }
				// if(this.chuanIdexName == 8){
				// 	this.typeMethodNum = this.x8;
				// 	this.typeMethodShow = true;
				// }
			}
		}
		if(this.times>99){
			this.times = 99;
		}
		// if(this.times == ''){
		// 	this.times = 1;
		// }
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
.score{
	position: relative;
	width: 100%;
}

/*模式主题切换*/
.game_type{
	background: #7034b0;
}
.lottery_type{
	background: #2a3040;
}
.game_type_btn{
	background: #7a41df;
}
.lottery_type_btn{
	background: #373c52;
}

/*左边赛事选择*/
section{
	padding: 0 40px;
}
.match{
	display: inline-block;
	width: 52%;
	height: 85vh;
	overflow: auto;
	/*border: 1px solid red;*/
	text-align: center;
	padding-right: 30px; 
}
.match_li{
	position: relative;
	margin-bottom: 20px;
	border:1px solid #e4e4e4;
	box-shadow: 2px 2px 20px #46277e;
	/*background: white;*/
}
.match_number{
	text-align: left;
	padding: 20px 0;

}
.match_detail{
	display: flex;
}
.one_info{
	margin: 0 10px;
}
.match_titel{
	flex:1;
	padding: 5px 20px;
}
.match_detail_btn{
	display: block;
	margin-top: 10px;
	border:1px solid #c4c4c4;
	width: 60%;
	height: 40px;
	line-height: 40px;
	margin: 10px auto;
	color: white;
	/*background: #ff51aa;*/
}
.match_detail_btn:active{
	background: #46277e;
}
.match_select{
	/*position: relative;*/
	/*flex: 1;*/
	height: 100px;
}
.match_detail_block{
	position: relative;
	text-align:left;
	padding:0 0 20px 20px;
}
.match_detail_block1{
	display: none;
}
.spf_title{
	position: absolute;
	top: 0;
	left: 20px;
}
.match_select_p{
	border: 1px solid #c4c4c4;
	width: 40px;
	height: 60px;
	line-height: 60px;
	background: #46277e;
	text-align: center;
	font-size: 20px;
}
.match_block_spf{
	display: inline-block;
	border: 1px solid #c4c4c4;
	width: 65px;
	height: 60px;
	text-align: center;
	padding-top: 11px;
	font-size: 14px;
}
.duandian{
	margin-right: 500px;
}

/*右侧赛事明细*/
.betting_detail{
	display: inline-block;
	width: 47%;
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
	border: 1px solid #c4c4c4;
}
.betting_block{
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
	display: inline-block;
	width: 60px;
	height: 40px;
	line-height: 40px;
	text-align: center;
	font-size: 18px;
	color: block;
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
	top: 72vh;
	left: 50.9%;
	right: 40px;
	bottom: 0;
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
	/*background: #fff;*/
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
	color: white;
}
.classname{
	background: #ff51aa;
	color: white;
}
.classname2{
	color: white;
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
	border:1px solid #c4c4c4;
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
	/*background: #fff;*/
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
	background: #c4c4c4;
	text-align: center;
	color: white;
}
.isSub_btn{
	background: #c4c4c4;
	color: white;
}
.isSub_btn_red{
	background: #ff51aa;
	color: white;
}

.reduce:active{
	background: #46277e;
}
.add:active{
	background: #46277e;
}
.max_add:active{
	background: #46277e;
}
.delete_order:active{
	background: #46277e;
}
.actives{
	background: #ff51aa;
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




