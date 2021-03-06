import AV from 'leancloud-storage'

class People extends AV.Object {
    
    constructor(name,age,addr){
        //首先需要调用父级的构造函数
        super();
        // 需要向 SDK 注册这个 Class
        AV.Object.register(People);
        this.set('name',name);
        this.set('age',age);
        this.set('addr',addr);
    }

    //属性的get set方法
    getName(){
        return this.get('name');
    }

    setName(name){
        this.set('name',name);
    }

    getAge(){
        return this.get('age');
    }

    setAge(age){
        this.set('age',age);
    }

    getAddr(){
        return this.get('addr');
    }

    setAddr(addr){
        this.set('addr',addr);
    }

    getImg(){
        this.get('img');
    }

    setImg(img){
        this.set('img',img);
    }

    getHeadImg(){
        this.get('head_img');
    }

    setHeadImg(head_img){
        this.set('head_img',head_img);
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

export default People 