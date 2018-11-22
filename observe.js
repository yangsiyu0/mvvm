class Observer{
    constructor(data){
        this.data = data;
        this.observer(this.data);
    }
    observer(data){
       if(typeof data !== 'object') return
       Object.keys(data).forEach(key=>{
           let value = data[key];
           this.defineReactive(data,key,value);
           if(typeof value === 'object'){
                this.observer(value);
           }
       });
    }
    defineReactive(data,key,value){
        let dep = new Dep(); // 给每个数据加个发布事件
        Object.defineProperty(data,key,{
            enumerable:true,
            configurable:false,
            get(){
                Dep.target && dep.addSub(Dep.target); // 每个要编译的元素（每个需要编译的元素有个独自的watch）订阅这事件
                return value;
            },
            set(newValue){
                if(newValue === value) return
                alert(newValue);
                value = newValue;
                dep.notify(newValue);
            }
        });
    }
}