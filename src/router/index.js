import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/pages/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'home',
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children:[
        {
          path: '/winning',
          component: resolve => require(['../components/common/winning.vue'], resolve)
        },
        {
          path: '/concede',
          component: resolve => require(['../components/common/concede.vue'], resolve)
        },
        {
          path: '/score',
          component: resolve => require(['../components/common/score.vue'], resolve)
        },
        {
          path: '/totalGoals',
          component: resolve => require(['../components/common/totalGoals.vue'], resolve)
        },
        {
          path: '/halfAll',
          component: resolve => require(['../components/common/halfAll.vue'], resolve)
        },
        {
          path: '/mixing',
          component: resolve => require(['../components/common/mixing.vue'], resolve)
        },

      ]
    },
  ]
})
