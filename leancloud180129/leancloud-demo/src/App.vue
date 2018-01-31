<template>
  <div id="app">
    <input type="button" value="添加一条数据" @click="insertData">
    <input type="button" value="获取一条数据1" @click="getData1">
    <input type="button" value="获取一条数据2" @click="getData2">
    <input type="button" value="获取一条数据3" @click="getData3">
    <input type="button" value="修改一条数据" @click="updateData1">
    <input type="button" value="修改一条数据通过条件" @click="updateData2">
    <input type="button" value="删除一条数据" @click="deleteData">
    <h4 v-text="people"></h4>
    <h4 v-text="people.objectId"></h4>
    <h4 v-text="people.name"></h4>
    <h4 v-text="people.age"></h4>
    <h4 v-text="people.addr"></h4>
    <h4 v-text="people.createdAt"></h4>
  </div>
</template>

<script>
import AV from 'leancloud-storage'
import People from './models/People'
export default {
  name: 'app',
  data () {
    return {
      people: ''
    }
  },
  methods:{
    insertData(){
      var people = new People();
      people.setName('张三');
      people.setAge(12);
      people.setAddr('北京市东城区');
      people.save().then(function (people) {
        // 成功保存之后，执行其他逻辑
        this.people=people;
      }.bind(this), function (error) {
        // 异常处理
        console.log('error='+error);
      });
    },
    getData1(){
      var people = People.createWithoutData('5a6ef1fcd50eee00397355d4');
      people.fetch().then(
        function(){
          console.log(people);
          console.log('name='+people.get('name'));
          this.people = people.toJSON();
        }.bind(this),function(error){
          //异常处理
          console.log('error='+error);
        }
      );
    },
    getData2(){
      var people = new People();
      people.id = '5a6eef350b6160004441ccff';
      var _this = this;
      people.fetch().then(
        (success)=>{
          console.log(success);
          console.log('name='+success.getName());
          _this.people = success.toJSON();
        },
        (error)=>{
          console.error('error='+error);
        }
      );
    },
    getData3(){
      var people = new People();
      var query = new AV.Query(People.name);
       var _this = this;
      query.get('5a6eef350b6160004441ccff').then(
        (people)=>{
          console.log(people);
          console.log('name='+people.getName());
           _this.people = people.toJSON();
        },
        (error)=>{
          console.error('error='+error);
        }
      );
    },
    updateData1(){//简单更新对象
      var people = new People();
      people.id='5a6ef1fcd50eee00397355d4';
      people.setName('王五');
      people.save();
    },
    updateData2(){//按条件更新对象
      var people = new People();
      var query = new AV.Query(People.name);
      var _this = this;
      query.get('5a716619ac502e005ce334bd').then(
        function(people){
          var changeAge = 2;
          var flageAge = 12;
          people.increment('age',changeAge);
          return people.save(null,{
            query:query.greaterThanOrEqualTo('age', flageAge),
            fetchWhenSave: true
          });
        }
      ).then(
        function(people){
          this.people = people.toJSON();
        }.bind(this)
      ).catch(
        function(error){
          if (error.code === 305) {
            alert('年龄不满足，操作失败！');
          }
        }
      );
    },
    deleteData(){//删除对象
      var people = new People();
      people.id='5a716dfdd50eee0039807aeb';
      people.destroy().then(function (success) {
        // 删除成功
        console.log(success);
      }, function (error) {
        // 删除失败
      });
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
