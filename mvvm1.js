class MVVM{
    constructor(option){
        this.el = option.el;
        this.data = option.data;
        // 定义响应式
        new Observer(this,this.data);
        // 编译
        new Compile(this.el,this.data);
    }
   
}
