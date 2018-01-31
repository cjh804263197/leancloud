import Vue from 'vue'
import App from './App.vue'
import AV from 'leancloud-storage'

const APP_ID = '3KrsVtLdC61rvm4sYMpj6S4y-gzGzoHsz';
const APP_KEY = 'UEeEDxs7uKQgKko5CAybmBH3';

//初始化leancloud存储SDK
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

new Vue({
  el: '#app',
  render: h => h(App)
})
