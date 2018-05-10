<template>
	<div class="mixing">
		<!-- 敬请期待 -->
		 <p style="text-align:center;margin-top:200px">敬请期待</p>

		<!-- 胜平负 -->
		<!--<section v-if="methodTab">-->
		 <section v-if="methodTab" style="display:none;">
			<!-- left赛事选择区 -->
			<div class="match">
				<p class="match_number">共 {{leftBlock.length}} 场比赛可选择</p>
				<ul class="match_ul">
					<li v-for="(items,index) in leftBlock" class="match_li">
						<p class="match_titel">{{items.title}}</p>
						<div class="match_detail">
							<div class="one_info match_select">
								<p class="oneLogo" v-if="items.jzspfGameType=='dg'">单</p>
								<p class="match_date">{{items.date}}</p>
								<p class="country">{{items.country}}</p>
								<p class="match_time">{{items.time}}</p>
							</div>
							<div v-for="(innerItem,innerIndex) in items.jzspf" class="match_select match_block" :class="{'actives': curIndexsSpf.indexOf(index + 'spf' + innerIndex) >= 0,'lottery_type':modeTab=='TD','game_type':modeTab=='GAME'}" @click="ChooseRedSpf(index,items,innerItem,innerIndex)">{{innerItem}}</div>
							<div class="not_spf_select" v-if="items.jzspf==''">胜平负未开售</div>
							<p class="match_detail_btn" :class="modeTab=='TD'?'lottery_type_btn':'game_type_btn'" @click="selectDetail(index)">点击详情</p>
						</div>
						<!-- 投注选项区域 -->
						<div class="match_detail_block" :class="{match_detail_block1:matchDetailBlock.indexOf(index)==-1}">
							<!-- 让球胜平负 -->
							<div class="spf_title1">
								<p class="match_select_p_xspf">让球</p>
							</div>
							<div class="leftStyle">
								<div class="dgStyle" v-if="items.jzxspfGameType=='dg'">单</div>
								<div style="font-size:0;">
									<div v-for="(innerItem,innerIndex) in items.jzxspf" class="match_block_xspf" :class="{'actives': curIndexsXspf.indexOf(index + 'xspf' + innerIndex) >= 0,'lottery_type_btn':modeTab=='TD','game_type_btn':modeTab=='GAME'}" @click="ChooseRedXspf(index,items,innerItem,innerIndex)">{{innerItem}}</div>
									<div class="not_xspf_select" v-if="items.jzxspf==''">让球胜平负未开售</div>
								</div>
							</div>
							<!-- 比分 -->
							<div class="spf_title2">
								<p class="match_select_p_bf">比分</p>
							</div>
							<div class="leftStyle">
								<div class="dgStyle" v-if="items.jzbfGameType=='dg'">单</div>
								<ul style="font-size:0;">
									<li v-for="(innerItem,innerIndex) in items.jzbf" class="match_block_bf" :class="{'actives': curIndexsBf.indexOf(index + 'bf' + innerIndex) >= 0,'duandian':innerIndex==17,'lottery_type_btn':modeTab=='TD','game_type_btn':modeTab=='GAME'}" @click="ChooseRedBf(index,items,innerItem,innerIndex)">
										<div style="margin-bottom:5px;">{{innerItem.BF}}</div>
										<div style="font-weight:600;">{{innerItem.PL}}</div>
									</li>
								</ul>
								<div class="not_bf_select" v-if="items.jzbf==''">比分未开售</div>
							</div>
							<!-- 总进球 -->
							<div class="spf_title3">
								<p class="match_select_p_jqs">总进球</p>
							</div>
							<div class="leftStyle">
								<div class="dgStyle" v-if="items.jzjqsGameType=='dg'">单</div>
								<ul style="font-size:0;">
									<li v-for="(innerItem,innerIndex) in items.jzjqs" class="match_block_bf" :class="{'actives': curIndexsJqs.indexOf(index + 'jqs' + innerIndex) >= 0,'lottery_type_btn':modeTab=='TD','game_type_btn':modeTab=='GAME'}" @click="ChooseRedJqs(index,items,innerItem,innerIndex)">
										<div style="margin-bottom:5px;">{{innerItem.QS}}</div>
										<div style="font-weight:600;">{{innerItem.PL}}</div>
									</li>
								</ul>
								<div class="not_jqs_select" v-if="items.jzjqs==''">总进球数未开售</div>
							</div>
							<!-- 半全场 -->
							<div class="spf_title4">
								<p class="match_select_p_bqc">半全场</p>
							</div>
							<div class="leftStyle">
								<div class="dgStyle" v-if="items.jzbqcGameType=='dg'">单</div>
								<ul style="font-size:0;">
									<li v-for="(innerItem,innerIndex) in items.jzbqc" class="match_block_bf" :class="{'actives': curIndexsBqc.indexOf(index + 'bqc' + innerIndex) >= 0,'lottery_type_btn':modeTab=='TD','game_type_btn':modeTab=='GAME'}" @click="ChooseRedBqc(index,items,innerItem,innerIndex)">
										<div style="margin-bottom:5px;">{{innerItem.BQC}}</div>
										<div style="font-weight:600;">{{innerItem.PL}}</div>
									</li>
								</ul>
								<div class="not_bqc_select" v-if="items.jzbqc==''">半全场未开售</div>
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
							<ul class="have_chosen" :class="modeTab=='TD'?'lottery_type':'game_type'">
								<li class="betting_block">
									<p class="block_title">{{temp.title}}</p>
									<ul style="text-align:center;font-size:0">
										<li class="detail_home" v-if="temp.spf" v-for="(innerTemp,innerTempIndex) in temp.spf">{{innerTemp.PL}}</li>
										<li class="detail_home" v-if="temp.xspf" v-for="(innerTemp,innerTempIndex) in temp.xspf">{{innerTemp.PL}}</li>
										<li class="detail_home" v-if="temp.bf" v-for="innerTemp in temp.bf">{{innerTemp.BF}}</li>
										<li class="detail_home" v-if="temp.jqs" v-for="innerTemp in temp.jqs">{{innerTemp.QS}}</li>
										<li class="detail_home" v-if="temp.bqc" v-for="innerTemp in temp.bqc">{{innerTemp.BQC}}</li>
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
					<li class="type_method" v-show="baChang" v-if="index<=rightArr.length-2" v-for="(typeMethodBlock,index) in typeMethodSelect" @click="chuanSelect(typeMethodBlock,index)" :class="{'lottery_type_btn':modeTab=='TD','game_type_btn':modeTab=='GAME'}" :style="{background:index==chuanIdexAAA?'#ff51aa':'transparent'}">{{typeMethodBlock}}</li>
					<li class="type_method" v-show="liuChang" v-if="index<=rightArr.length-2" v-for="(typeMethodBlock,index) in typeMethodSelect2" @click="chuanSelect(typeMethodBlock,index)" :class="{'lottery_type_btn':modeTab=='TD','game_type_btn':modeTab=='GAME'}" :style="{background:index==chuanIdexAAA?'#ff51aa':'transparent'}">{{typeMethodBlock}}</li>
					<li class="type_method" v-show="siChang" v-if="index<=rightArr.length-2" v-for="(typeMethodBlock,index) in typeMethodSelect3" @click="chuanSelect(typeMethodBlock,index)" :class="{'lottery_type_btn':modeTab=='TD','game_type_btn':modeTab=='GAME'}" :style="{background:index==chuanIdexAAA?'#ff51aa':'transparent'}">{{typeMethodBlock}}</li>
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

		<!-- 敬请期待 -->
		<!-- <p style="text-align:center;margin-top:200px" v-else>敬请期待</p> -->
		<tips v-if="tipsShow" title="请至少选择两场比赛"></tips>
		<tipsPrice v-if="tipsShowPrice" title="单注最大积分不能超过200万"></tipsPrice>
		<tipsExceed v-if="tipsShowExceed" title="最大比赛场次不能超过8场"></tipsExceed>
		<model v-if="model" title="正在加载中..."></model>
	</div>
</template>

<script>
import Tips from './tips'
import TipsPrice from './tips'
import TipsExceed from './tips'
import Model from './model'
import bus from '../../assets/bus'
export default {
	components:{Tips,TipsPrice,TipsExceed,Model},
	data () {
		return{
			uid:'',
			deviceNo:'',
			modeTab:'GAME',
	        methodTab:true,
	        typeMethodSelect:['2串1','3串1','4串1','5串1','6串1','7串1','8串1',],
	        typeMethodSelect2:['2串1','3串1','4串1','5串1','6串1',],
	        typeMethodSelect3:['2串1','3串1','4串1',],
	        baChang:true,
	        liuChang:false,
	        siChang:false,
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
			curIndexsSpf: [],//
			curIndexsXspf: [],//
			curIndexsBf: [],//
			curIndexsJqs: [],//
			curIndexsBqc: [],//
			rightArr: [],//
			sta4:'',
			sta6:'',
			testData: [],
			chuanIdexAAA:'98898',//
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
			model:false,
			matchDetailBlock:[],
			clickOpenMsg:'展开',
		}
	},
	created(){
		let _this = this;
//		this.model = true;
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
				lotteryId: 'hhtt',
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
		// 点击胜平负选择比赛结果
		ChooseRedSpf(index,items,innerItem,innerIndex){
			let _this = this;
			let temIndex = index + 'spf' + innerIndex;
			// console.log(temIndex);
			// console.log(items);
			// 重新赋值定义innerItem值
			let innerIt = {
				PL:innerItem,
				innerInd:index + 'spf' + innerIndex,
			};
			let temInd = this.curIndexsSpf.indexOf(temIndex);
			let params = {
				title:'',
				spf:[],
				xspf:[],
				bf:[],
				jqs:[],
				bqc:[],
				date:'',
				jzbfGameType:'',
				jzbqcGameType:'',
				jzjqsGameType:'',
				jzspfGameType:'',
				jzxspfGameType:'',
				idex:index,
				matchId:[],
				// gameType:'',
				saleCloseTime:'',
			};
			let matchInd = params.matchId.indexOf('spf_'+items.jzspfMatchId);
			if(temInd >= 0){
				this.curIndexsSpf.splice(temInd, 1);
				params.matchId.splice(matchInd, 1);
				for(var i=0;i<this.rightArr.length;i++){
					let oparams = this.rightArr[i];
					if(oparams.idex == params.idex){
						// oparams.spf[innerIndex]='';
						for(var j=0;j<oparams.spf.length;j++){
							if(oparams.spf[j].innerInd == temIndex){
								// console.log('-------终于找到一样的了--------')
								oparams.spf.splice(j,1);
							}
						}
						if(oparams.spf == ''){
							if(oparams.xspf.length == 0&&oparams.bf.length == 0&&oparams.jqs.length == 0&&oparams.bqc.length == 0){
								this.rightArr.splice(i,1);
							}
						};
					}
				};
			}else{
				if(this.rightArr.length > 7){
					// 选择场次大于八场纵向禁止再选
					for(var i=0;i<this.rightArr.length;i++){
						let cparams = null;
						if(this.rightArr[i].idex == params.idex){
							cparams = this.rightArr[i];
							// cparams.spf[innerIndex] = innerItem;
							cparams.spf.push(innerIt);
							this.curIndexsSpf.push(temIndex);
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
					params.matchId.push('spf_'+items.jzspfMatchId);
					params.jzspfGameType = items.jzspfGameType;
					params.saleCloseTime = items.time;
					this.curIndexsSpf.push(temIndex);

					if(this.rightArr.length > 0){
						for(var i=0;i<this.rightArr.length;i++){
							let cparams = null;
							if(this.rightArr[i].idex == params.idex){
								cparams = this.rightArr[i];
								// cparams.spf[innerIndex] = innerItem;
								cparams.spf.push(innerIt);
								return;
							}
						};
					};
					// params.spf[innerIndex] = innerItem;
					params.spf.push(innerIt);
					this.rightArr.push(params);
				}
			};
			// console.log(this.rightArr);
			// console.log(this.curIndexs);
		},
		// 点击让球胜平负选择比赛结果
		ChooseRedXspf(index,items,innerItem,innerIndex){
			let _this = this;
			let temIndex = index + 'xspf' + innerIndex;
			// console.log(temIndex);
			// console.log(items);
			// console.log(innerItem);
			// 重新赋值定义innerItem值
			let innerIt = {
				PL:innerItem,
				innerInd:index + 'xspf' + innerIndex,
			};
			let temInd = this.curIndexsXspf.indexOf(temIndex);
			let params = {
				title:'',
				spf:[],
				xspf:[],
				bf:[],
				jqs:[],
				bqc:[],
				date:'',
				jzbfGameType:'',
				jzbqcGameType:'',
				jzjqsGameType:'',
				jzspfGameType:'',
				jzxspfGameType:'',
				idex:index,
				matchId:[],
				// gameType:'',
				saleCloseTime:'',
			};
			let matchInd = params.matchId.indexOf('xspf_'+items.jzxspfMatchId);
			if(temInd >= 0){
				this.curIndexsXspf.splice(temInd, 1);
				params.matchId.splice(matchInd, 1);
				for(var i=0;i<this.rightArr.length;i++){
					let oparams = this.rightArr[i];
					if(oparams.idex == params.idex){
						// oparams.spf[innerIndex]='';
						for(var j=0;j<oparams.xspf.length;j++){
							if(oparams.xspf[j].innerInd == temIndex){
								// console.log('-------终于找到一样的了--------')
								oparams.xspf.splice(j,1);
							}
						}
						if(oparams.xspf == ''){
							if(oparams.spf.length == 0&&oparams.bf.length == 0&&oparams.jqs.length == 0&&oparams.bqc.length == 0){
								this.rightArr.splice(i,1);
							}
						};
					}
				};
			}else{
				if(this.rightArr.length > 7){
					// 选择场次大于八场纵向禁止再选
					for(var i=0;i<this.rightArr.length;i++){
						let cparams = null;
						if(this.rightArr[i].idex == params.idex){
							cparams = this.rightArr[i];
							// cparams.spf[innerIndex] = innerItem;
							cparams.xspf.push(innerIt);
							this.curIndexsXspf.push(temIndex);
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
					params.matchId.push('xspf_'+items.jzxspfMatchId);
					params.jzxspfGameType = items.jzxspfGameType;
					params.saleCloseTime = items.time;
					this.curIndexsXspf.push(temIndex);

					if(this.rightArr.length > 0){
						for(var i=0;i<this.rightArr.length;i++){
							let cparams = null;
							if(this.rightArr[i].idex == params.idex){
								cparams = this.rightArr[i];
								// cparams.spf[innerIndex] = innerItem;
								cparams.xspf.push(innerIt);
								return;
							}
						};
					};
					// params.spf[innerIndex] = innerItem;
					params.xspf.push(innerIt);
					this.rightArr.push(params);
				}
			};
			// console.log(this.rightArr);
			// console.log(this.curIndexs);
		},
		// 点击比分选择比赛结果
		ChooseRedBf(index,items,innerItem,innerIndex){
			let _this = this;
			let temIndex = index + 'bf' + innerIndex
			// console.log(index,innerIndex);
			let temInd = this.curIndexsBf.indexOf(temIndex);
			// 重新赋值定义innerItem值
			let innerIt = {
				PL:innerItem.PL,
				BF:innerItem.BF,
				innerInd:index + 'bf' + innerIndex,
			};
			let params = {
				title:'',
				spf:[],
				xspf:[],
				bf:[],
				jqs:[],
				bqc:[],
				date:'',
				jzbfGameType:'',
				jzbqcGameType:'',
				jzjqsGameType:'',
				jzspfGameType:'',
				jzxspfGameType:'',
				idex:index,
				matchId:[],
				// gameType:'',
				saleCloseTime:'',
			};
			let matchInd = params.matchId.indexOf('bf_'+items.jzbfMatchId);
			if(temInd >= 0){
				this.curIndexsBf.splice(temInd, 1);
				params.matchId.splice(matchInd, 1);
				for(var i=0;i<this.rightArr.length;i++){
					let oparams = this.rightArr[i];
					if(oparams.idex == params.idex){
						for(var j=0;j<oparams.bf.length;j++){
							if(oparams.bf[j].innerInd == temIndex){
								// console.log('-------终于找到一样的了--------')
								oparams.bf.splice(j,1);
							}
						}
						if(oparams.bf == ''){
							if(oparams.spf.length == 0&&oparams.xspf.length == 0&&oparams.bqc.length == 0&&oparams.jqs.length == 0){
								this.rightArr.splice(i,1);
							}
						};
					}
				};
			}else{
				if(this.rightArr.length > 7){
					// 选择场次大于四场纵向禁止再选
					for(var i=0;i<this.rightArr.length;i++){
						let cparams = null;
						if(this.rightArr[i].idex == params.idex){
							cparams = this.rightArr[i];
							cparams.bf.push(innerIt);
							this.curIndexsBf.push(temIndex);
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
					params.matchId.push('bf_'+items.jzbfMatchId);
					params.jzbfGameType = items.jzbfGameType;
					params.saleCloseTime = items.time;
					this.curIndexsBf.push(temIndex);

					if(this.rightArr.length > 0){
						for(var i=0;i<this.rightArr.length;i++){
							let cparams = null;
							if(this.rightArr[i].idex == params.idex){
								cparams = this.rightArr[i];
								cparams.bf.push(innerIt);
								// console.log('___________这是return的___________')
								return;
							}
						};
					};
					params.bf.push(innerIt);
					this.rightArr.push(params);
				}
			};
			// console.log(this.curIndexsBf);
		},
		// 点击进球数选择比赛结果
		ChooseRedJqs(index,items,innerItem,innerIndex){
			let _this = this;
			let temIndex = index + 'jqs' + innerIndex
			let temInd = this.curIndexsJqs.indexOf(temIndex);
			// 重新赋值定义innerItem值
			let innerIt = {
				PL:innerItem.PL,
				QS:innerItem.QS,
				innerInd:index + 'jqs' + innerIndex,
			};
			let params = {
				title:'',
				spf:[],
				xspf:[],
				bf:[],
				jqs:[],
				bqc:[],
				date:'',
				jzbfGameType:'',
				jzbqcGameType:'',
				jzjqsGameType:'',
				jzspfGameType:'',
				jzxspfGameType:'',
				idex:index,
				matchId:[],
				// gameType:'',
				saleCloseTime:'',
			};
			let matchInd = params.matchId.indexOf('jqs_'+items.jzjqsMatchId);
			if(temInd >= 0){
				this.curIndexsJqs.splice(temInd, 1);
				params.matchId.splice(matchInd, 1);
				for(var i=0;i<this.rightArr.length;i++){
					let oparams = this.rightArr[i];
					if(oparams.idex == params.idex){
						for(var j=0;j<oparams.jqs.length;j++){
							if(oparams.jqs[j].innerInd == temIndex){
								// console.log('-------终于找到一样的了--------')
								oparams.jqs.splice(j,1);
							}
						}
						if(oparams.jqs == ''){
							if(oparams.spf.length == 0&&oparams.xspf.length == 0&&oparams.bqc.length == 0&&oparams.bf.length == 0){
								this.rightArr.splice(i,1);
							}
						};
					}
				};
			}else{
				if(this.rightArr.length > 7){
					// 选择场次大于六场纵向禁止再选
					for(var i=0;i<this.rightArr.length;i++){
						let cparams = null;
						if(this.rightArr[i].idex == params.idex){
							cparams = this.rightArr[i];
							cparams.jqs.push(innerIt);
							this.curIndexsJqs.push(temIndex);
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
					params.matchId.push('jqs_'+items.jzjqsMatchId);
					params.jzjqsGameType = items.jzjqsGameType;
					params.saleCloseTime = items.time;
					this.curIndexsJqs.push(temIndex);

					if(this.rightArr.length > 0){
						for(var i=0;i<this.rightArr.length;i++){
							let cparams = null;
							if(this.rightArr[i].idex == params.idex){
								cparams = this.rightArr[i];
								cparams.jqs.push(innerIt);
								// console.log(cparams)
								return;
							}
						};
					};
					params.jqs.push(innerIt);
					this.rightArr.push(params);
				}
			};
			// console.log(this.rightArr);
			// console.log(this.curIndexs);
		},
		// 点击半全场选择比赛结果
		ChooseRedBqc(index,items,innerItem,innerIndex){
			let _this = this;
			let temIndex = index + 'bqc' + innerIndex
			let temInd = this.curIndexsBqc.indexOf(temIndex);
			// 重新赋值定义innerItem值
			let innerIt = {
				PL:innerItem.PL,
				BQC:innerItem.BQC,
				innerInd:index + 'bqc' + innerIndex,
			};
			let params = {
				title:'',
				spf:[],
				xspf:[],
				bf:[],
				jqs:[],
				bqc:[],
				date:'',
				jzbfGameType:'',
				jzbqcGameType:'',
				jzjqsGameType:'',
				jzspfGameType:'',
				jzxspfGameType:'',
				idex:index,
				matchId:[],
				// gameType:'',
				saleCloseTime:'',
			};
			let matchInd = params.matchId.indexOf('bqc_'+items.jzbqcMatchId);
			if(temInd >= 0){
				this.curIndexsBqc.splice(temInd, 1);
				params.matchId.splice(matchInd, 1);
				for(var i=0;i<this.rightArr.length;i++){
					let oparams = this.rightArr[i];
					if(oparams.idex == params.idex){
						for(var j=0;j<oparams.bqc.length;j++){
							if(oparams.bqc[j].innerInd == temIndex){
								// console.log('-------终于找到一样的了--------')
								oparams.bqc.splice(j,1);
							}
						}
						if(oparams.bqc == ''){
							if(oparams.spf.length == 0&&oparams.xspf.length == 0&&oparams.jqs.length == 0&&oparams.bf.length == 0){
								this.rightArr.splice(i,1);
							}
						};
					}
				};
			}else{
				if(this.rightArr.length > 7){
					// 选择场次大于四场纵向禁止再选
					for(var i=0;i<this.rightArr.length;i++){
						let cparams = null;
						if(this.rightArr[i].idex == params.idex){
							cparams = this.rightArr[i];
							cparams.bqc.push(innerIt);
							this.curIndexsBqc.push(temIndex);
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
					params.matchId.push('bqc_'+items.jzbqcMatchId);
					params.jzbqcGameType = items.jzbqcGameType;
					params.saleCloseTime = items.time;
					this.curIndexsBqc.push(temIndex);

					if(this.rightArr.length > 0){
						for(var i=0;i<this.rightArr.length;i++){
							let cparams = null;
							if(this.rightArr[i].idex == params.idex){
								cparams = this.rightArr[i];
								cparams.bqc.push(innerIt);
								// console.log('___________这是return的___________')
								return;
							}
						};
					};
					params.bqc.push(innerIt);
					this.rightArr.push(params);
				}
			};
			// console.log(this.curIndexs);
		},
		//去掉type为空的选项
		test(){
			this.testData = [];
			this.testData = this.rightArr;
			let testData = this.testData;
			// 循环去掉type为空的选项
			for(var i=0;i<testData.length;i++){
				let aparams = testData[i];
				for(var j=0,len=aparams.spf.length;j<len;j++){
					if(aparams.spf[j]==""){
						aparams.spf.splice(j,1);
						len--;
						if(aparams.spf[j]==""){
							aparams.spf.splice(j,1);
							len--;
							if(aparams.spf[j]==""){
								aparams.spf.splice(j,1);
								len--;
							}
						}
					}
				}

				for(var j=0,len=aparams.xspf.length;j<len;j++){
					if(aparams.xspf[j]==""){
						aparams.xspf.splice(j,1);
						len--;
						if(aparams.xspf[j]==""){
							aparams.xspf.splice(j,1);
							len--;
							if(aparams.xspf[j]==""){
								aparams.xspf.splice(j,1);
								len--;
							}
						}
					}
				}
			}
			// 循环获取每场比赛选项的长度
			let jcArr = [];
			for(var i=0;i<testData.length;i++){
				jcArr.push(testData[i].spf.length+testData[i].xspf.length+testData[i].bf.length+testData[i].jqs.length+testData[i].bqc.length);
			}
			// console.log(jcArr);
			this.bettingNum = Math.round(this.jC(jcArr));
			// console.log(this.bettingNum);
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
					// jcArrLen.push(partArr2[j].liveSp.length);
					jcArrLen.push(partArr2[j].spf.length+partArr2[j].xspf.length+partArr2[j].bf.length+partArr2[j].jqs.length+partArr2[j].bqc.length);
				}
				// console.log(jcArrLen);
				chuanGuanNum.push(Math.round(this.jC(jcArrLen)));
			}
			this.bettingNum = this.jJia(chuanGuanNum);
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
      		this.curIndexsXspf = [];
      		this.curIndexsSpf = [];
      		this.curIndexsBf = [];
      		this.curIndexsJqs = [];
      		this.curIndexsBqc = [];
      		this.chuanIdexAAA = [];
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
	        		userId:'5aa10087adfa2f0171c338bf',
	        		deviceNo:'8BE30ACC19DF22D',
	        		// userId:this.uid,
	        		// deviceNo:this.deviceNo,
	        		lotteryName:'jz',
	        		moneySum:this.bettingNum*2*this.times,
	        		type:this.modeTab,
	        		tableData:{
	        			playName:'hhtt',
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
		        	this.tipsShowPrice = true;
	        		this.submitBtn1 = true;
		        	this.submitBtn2 = false;
		        	setTimeout(function(){
			        	_this.tipsShowPrice = false;
		        	},2000);
        		}else{
		        	this.model = true;
			    	_this.$http.post('/jz/betting',params).then((res)=>{
			    		console.log(res.data);
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
      		this.curIndexsXspf = [];
      		this.curIndexsSpf = [];
      		this.curIndexsBf = [];
      		this.curIndexsJqs = [];
      		this.curIndexsBqc = [];
      		this.sta4 = '';
      		this.sta6 = '';
        	this.bettingNum = 0;
        	this.times = 1;
        	this.typeMethodShow = false;
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
					if(this.rightArr[0].jzspfGameType == 'dg'){
						this.test();
						this.typeMethodShow = false;
						this.typeMethodShowFont = true;
						// this.typeMethodNum = 1;
					}else if(this.rightArr[0].jzxspfGameType == 'dg'){
						this.test();
						this.typeMethodShow = false;
						this.typeMethodShowFont = true;
						// this.typeMethodNum = 1;
					}else if(this.rightArr[0].jzbfGameType == 'dg'){
						this.test();
						this.typeMethodShow = false;
						this.typeMethodShowFont = true;
						// this.typeMethodNum = 1;
					}else if(this.rightArr[0].jzjqsGameType == 'dg'){
						this.test();
						this.typeMethodShow = false;
						this.typeMethodShowFont = true;
						// this.typeMethodNum = 1;
					}else if(this.rightArr[0].jzbqcGameType == 'dg'){
						this.test();
						this.typeMethodShow = false;
						this.typeMethodShowFont = true;
						// this.typeMethodNum = 1;
					}else{
						this.typeMethodShow = false;
						this.typeMethodShowFont = false;
						this.bettingNum = 0;
					}
				}else{
					if(this.rightArr.length == 2){
						// this.typeMethodNum = 2;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 2;
						this.test();
					}
					if(this.rightArr.length == 3){
						// this.typeMethodNum = 3;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 3;
						this.test();
					}
					if(this.rightArr.length == 4){
						// this.typeMethodNum = 4;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 4;
						this.test();
					}
					if(this.rightArr.length == 5){
						// this.typeMethodNum = 5;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 5;
						this.test();
					}
					if(this.rightArr.length == 6){
						// this.typeMethodNum = 6;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 6;
						this.test();
					}
					if(this.rightArr.length == 7){
						// this.typeMethodNum = 7;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 7;
						this.test();
					}
					if(this.rightArr.length == 8){
						// this.typeMethodNum = 8;
						this.typeMethodShow = true;
						this.typeMethodShowFont = false;
						this.gameNum = 8;
						this.test();
					}

					//设置串关playType
					if(this.rightArr.length > 4){
						if(this.curIndexsBf.length>0||this.curIndexsBqc.length>0){
							// console.log('这是4场了');
							this.sta4 = 'bfbqc';
							this.sta6 = '';
						}else if(this.curIndexsJqs.length>0){
							this.sta4 = '';
							this.sta6 = 'onlyJqs';
							// console.log('这是流畅的')
						}else{
							this.sta4 = '';
							this.sta6 = '';
							this.baChang = true;
							this.liuChang = false;
							this.siChang = false;
						}
					}else{
						if(this.rightArr.length == 2){
							this.typeMethodNum = 2;
						}
						if(this.rightArr.length == 3){
							this.typeMethodNum = 3;
						}
						if(this.rightArr.length == 4){
							this.typeMethodNum = 4;
						}
					}
					if(this.sta4 == 'bfbqc'){
						this.baChang = false;
						this.liuChang = false;
						this.siChang = true;
						this.typeMethodNum = 4;
					}else if(this.sta6 == 'onlyJqs'){
						this.baChang = false;
						this.liuChang = true;
						this.siChang = false;
						this.typeMethodNum = 6;
					}else{
						// console.log(666)
						if(this.rightArr.length == 5){
							this.typeMethodNum = 5;
						}
						if(this.rightArr.length == 6){
							this.typeMethodNum = 6;
						}
						if(this.rightArr.length == 7){
							this.typeMethodNum = 7;
						}
						if(this.rightArr.length == 8){
							this.typeMethodNum = 8;
						}
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
.mixing{
	position: relative;
	width: 100%;
	/*background: #2a3040;*/
	/*height: 100vh;*/
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
	padding: 0 20px 20px 0;
	border: 1px solid #c4c4c4;
	box-shadow: 2px 2px 20px #46277e;
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
	flex: 1;
	height: 90px;
}
.match_block{
	border: 1px solid #c4c4c4;
	line-height: 90px;
}
/*没有spf赛事*/
.not_spf_select{
	width: 579px;
	height: 90px;
	border: 1px solid #c4c4c4;
	line-height: 90px;
}
/*没有xspf,jqs,bqc赛事*/
.not_xspf_select,.not_jqs_select,.not_bqc_select{
	display: inline-block;
	border: 1px solid #c4c4c4;
	width: 540px;
	height: 60px;
	line-height: 60px;
	text-align: center;
	font-size: 14px;
	background: #7a41df;
}
/*没有bf赛事*/
.not_bf_select{
	display: inline-block;
	border: 1px solid #c4c4c4;
	width: 540px;
	height: 184px;
	line-height: 184px;
	text-align: center;
	font-size: 14px;
	background: #7a41df;
}

.one_info{
	padding: 0 10px;
	/*border: 1px solid #c4c4c4;
	background: #46277e;*/
}
.match_detail_btn{
	flex:0.6;
	border:1px solid #c4c4c4;
	height: 90px;
	line-height: 90px;
	color: white;
}
.match_detail_btn:active{
	background: #46277e;
}

/*隐藏的投注玩法区域*/
.match_detail_block{
	position: relative;
	text-align:left;
	padding:0 0 0 20px;
	margin-top: 20px;
}
.match_detail_block1{
	display: none;
}
.leftStyle{
	position: relative;
	margin-left: 80px;
}
/*让球胜平负*/
.spf_title1{
	position: absolute;
	top: 0;
	left: 10px;
}
.match_select_p_xspf{
	border: 1px solid #c4c4c4;
	width: 90px;
	height: 60px;
	line-height: 60px;
	background: #46277e;
	text-align: center;
	font-size: 20px;
}
.match_block_xspf{
	display: inline-block;
	border: 1px solid #c4c4c4;
	width: 180px;
	height: 60px;
	line-height: 60px;
	text-align: center;
	font-size: 14px;
}
/*比分*/
.spf_title2{
	position: absolute;
	top: 60px;
	left: 10px;
}
.match_select_p_bf{
	border: 1px solid #c4c4c4;
	width: 90px;
	height: 184px;
	line-height: 184px;
	background: #46277e;
	text-align: center;
	font-size: 20px;
}
.match_block_bf{
	display: inline-block;
	border: 1px solid #c4c4c4;
	width: 60px;
	height: 60px;
	text-align: center;
	padding-top: 11px;
	font-size: 14px;
}
.duandian{
	margin-right: 500px;
}
/*总进球数*/
.spf_title3{
	position: absolute;
	top: 244px;
	left: 10px;
}
.match_select_p_jqs,.match_select_p_bqc{
	border: 1px solid #c4c4c4;
	width: 90px;
	height: 60px;
	line-height: 60px;
	background: #46277e;
	text-align: center;
	font-size: 20px;
}
/*半全场*/
.spf_title4{
	position: absolute;
	top: 304px;
	left: 10px;
}
/*单关logo样式*/
.dgStyle{
	position: absolute;
	top: 1px;
	left: -89px;
	width: 20px;
	height: 20px;
	line-height: 20px;
	background: red;
	color: white;
	font-size: 16px;
	text-align: center;
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
	/*width: 60px;*/
	height: 40px;
	line-height: 40px;
	padding: 0 10px;
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
	background: #4178ab;
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
	background: #498f36;
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
	text-align: center;
}
.submit_order{
	margin-left: 10px;
	/*background: blue;*/
}
.submit_order2{
	display: inline-block;
	width: 100px;
	height: 50px;
	line-height: 50px;
	margin-left: 10px;
	/*border: 1px solid #e4e4e4;*/
	/*background: #e4e4e4;*/
	text-align: center;
	background: #c4c4c4;
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




