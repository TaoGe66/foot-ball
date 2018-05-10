// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false

// axios.defaults.baseURL = 'http://lotteryapi.bjztdl.com'
axios.defaults.baseURL = 'http://lotterytest.bjztdl.com'
Vue.prototype.$http = axios

/*
*  全局方法
*/
// 发送订单号
window.toastMessage = Vue.prototype.toastMessage = function(message){
	window.hcbWeb.openPayPage(message);
};
// 安卓端回调支付结果
window.callBackPay = Vue.prototype.callBackPay = function(){};

//设置每个页面title
Vue.directive('title',{
	inserted: function(el,binding){
		document.title = el.innerText;
		el.remove()
	}
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
