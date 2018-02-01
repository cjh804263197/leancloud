<template>
  <div id="app">
    <input type="button" value="添加一条数据" @click="insertData">
    <input type="button" value="获取一条数据1" @click="getData1">
    <input type="button" value="获取一条数据2" @click="getData2">
    <input type="button" value="获取一条数据3" @click="getData3">
    <input type="button" value="修改一条数据" @click="updateData1">
    <input type="button" value="修改一条数据通过条件" @click="updateData2">
    <input type="button" value="删除一条数据" @click="deleteData">
    <input type="button" value="批量删除数据" @click="batchDeleteData">
    <input type="button" value="关联数据Pointer" @click="savePointer">
    <input type="button" value="获取关联数据" @click="getPointerData">
    <br>
    <input type="button" value="多条件查询" @click="conditionsQuery">
    <br>
    <input type="button" value="Pointer查询" @click="pointerQuery">
    <br>
    <div>
      <input type="file" name="上传文件" id="uploadFile" @change="getFile" >
      <input type="button" value="上传" @click="upload">
    </div>
    <div v-show="progressCurrent!=0">
      <progress :value="progressCurrent" :max="progressMax" ></progress>
      <span>{{progressCurrent}}%</span>
    </div>
    
    <br>
    <h4 v-text="people"></h4>
    <h4 v-text="people.objectId"></h4>
    <h4 v-text="people.name"></h4>
    <h4 v-text="people.age"></h4>
    <h4 v-text="people.addr"></h4>
    <h4 v-text="people.createdAt"></h4>
    <ul>
      <li v-for="(p,index) in peoples" :key="index" v-text="p"></li>
    </ul>
    <ul>
      <li v-for="(c,index) in comments" :key="index" v-text="c"></li>
    </ul>
  </div>
</template>

<script>
import AV from 'leancloud-storage'
import People from './models/People'
import Comment from './models/Comment'
export default {
  name: 'app',
  data () {
    return {
      people: '',
      peoples:[],
      comments:[],
      file:'',
      progressCurrent:0,
      progressMax:100
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
    },
    batchDeleteData(){//批量删除数据
      var ids = ['5a716dd49f545416300b7e27','5a716619ac502e005ce334bd','5a713cebd50eee00397f274f'];
      var objects = [];
      ids.forEach(
        function(id){
          console.log(id);
          var p1 = new People();
          p1.id=id;
          objects.push(p1);
        }
      );
      console.log('objects='+objects);
      People.destroyAll(objects).then(
        function(){
          console.log('删除成功');
        },
        function(error){
          console.error('删除失败'+error);
        }
      );
    },
    savePointer(){//保存关联数据（适用于一对多）
      var comment = new Comment();
      comment.setLikes(1);
      comment.setContent('这个太赞了！楼主，我也要这些游戏，咱们团购么？');
      var people = new People();
      people.id='5a716de31b69e6003c5a0dfc';
      comment.setPeople(people);
      comment.save().then(
        function(comment){
          console.log('comment='+comment.getPeople().id);
        },
        function(error){
          console.log('error='+error);
        }
      );
    },
    getPointerData(){//获取
      var comment = new Comment();
      comment.id='5a72aa0bee920a0045389402';
      comment.fetch({
        include:['people']
      }).then(
        function(commentObj){
          let people = commentObj.getPeople();
          console.log(people.toJSON());
          console.log(commentObj.toJSON());
        }
      );
    },
    getFile($event){
      this.file = $event.target.files[0];
      console.log('filename='+this.file.name);
    },
    upload(){
      if(this.file!=''){
        var file = new AV.File(this.file.name, this.file);
        var _this = this;
        file.save({
          onprogress:function(e){
            console.log('progress='+e.loaded+' '+e.total);
            _this.progressCurrent = e.percent;
          }
        }).then(function(file) {
            // 文件保存成功
            console.log(file.url());
        }, function(error) {
            // 异常处理
            console.error(error);
        });
      }else{
        alert('请选择文件后才能点击上传！');
      }
    },
    conditionsQuery(){//多条件查询
      var query = People.getQuery();
      query.equalTo('age',12);//人员年龄等于12
      query.startsWith('name','张');//姓张的人员
      var _this = this;
      this.peoples=[];
      query.find().then(
        function(res){
          res.forEach(
            function(people){
              _this.peoples.push(people);
            }
          );
        }
      );
    },
    pointerQuery(){//pointer查询
      var people = new People();
      people.id='5a716de31b69e6003c5a0dfc';
      var query = Comment.getQuery();
      query.equalTo('people',people);
      // 想在查询的同时获取关联对象的属性则一定要使用 `include` 接口用来指定返回的 `key`
      query.include('people');
      query.find().then(
        function(results){
          console.log('length='+results.length);
          results.forEach(
            function(comment){
              this.comments.push(comment);
            }.bind(this)
          );
        }.bind(this)
      );
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
