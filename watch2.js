class Watch{
    constructor(data,expr,cb){
        this.data = data;
        this.expr = expr;
        this.value = this.get(this.data,this.expr);
        this.cb = cb;
    }
    getVal(data,expr){
        expr = expr.split('.');
        expr.reduce((prev,next)=>{
            return prev[next];
        },data);
        return expr;
    }
    get(data,expr){
        Dep.target = this;
        let value = this.getVal(data,expr);
        Dep.target = null;// 保证每一个要编译的元素都有一个各自的watch
        return value;

    }
    update(newValue){
        if(this.value === newValue) return
        this.cb(newValue);
    }
    
}

class Dep{
    constructor(){
        this.subs=[];
    }
    addSub(watch){
        this.subs.push(watch);
    }
    notify(newValue){
        this.subs.forEach((watch)=>{
            watch.update(newValue);
        });
    }
}