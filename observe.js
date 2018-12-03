class Observer{
    constructor(data){
        this.data = data;
        this.observer(this.data);
        this.proxy(_this,this.data);
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
    
     //数据代理（在一个对象中，可以动态的访问和设置另一个对象属性）
    proxy(_this,data){
        Object.keys(data).forEach(key=>{
            console.log(_this)
            Object.defineProperty(_this,key,{
                get(){
                    return data[key]
                },
                set(newValue){
                    if(newValue == data[key]) return
                    data[key] = newValue;
                }
            });
        });
    }
}
