import AV from 'leancloud-storage'
import People from './People';

class Comment extends AV.Object {
    
    constructor(likes,content,people){
        //首先需要调用父级的构造函数
        super();
        // 需要向 SDK 注册这个 Class
        AV.Object.register(Comment);
        this.set('likes',likes);
        this.set('content',content);
        this.set('people',people)
    }

    //属性的get set方法
    getLikes(){
        return this.get('likes');
    }

    setLikes(likes){
        this.set('likes',likes);
    }

    getContent(){
        return this.get('content');
    }

    setContent(content){
        this.set('content',content);
    }

    getPeople(){
        return this.get('people');
    }

    setPeople(people){
        this.set('people',people);
    }

    /**
     * 通过id获取对象
     * @param {*} id 查询参数
     */
    static createWithoutData(id){
        return super.createWithoutData(this.name,id);
    }

    /**
     * 调用父类的toJSON
     */
    toJSON(){
        return super.toJSON();
    }

    /**
     * 获取当前类的查询对象
     */
    static getQuery(){
        return new AV.Query(this.name);
    }
}

export default Comment 