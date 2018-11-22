class Compile{
    constructor(el,data){
        this.el = this.isElement(el) ? el : document.querySelector(el);
        this.data = data;
        if(this.el){
            // 如果这个元素能获取到，我们才开始编译

            // 1.先把这些真实的DOM移入到内存中 fragment 
           let fragment = this.node2fragment(this.el);
           

            // 2,编译 => 提取想要的元素节点 v-model 和文本节点{{}}
            this.compile(fragment);

            // 3,把编译好的fragment在塞回页面里去
            this.el.appendChild(fragment);
        }
    }

    /* 专门写一些辅助方法*/
    isElement(node){
        return node.nodeType === 1;
    }
    isDirective(str){
        return str.includes('z-');
    }

    /* 核心方法*/
    node2fragment(el){
        let fragment = document.createDocumentFragment();
        let firstChild = el.firstChild;
        while(firstChild){
            fragment.appendChild(firstChild);
            firstChild = el.firstChild;
        }
        return fragment
    }

    setVal(val,expr,data){
        expr = expr.split('.');
        expr.reduce((prev,next,index)=>{
            if(index === expr.length-1){
                prev[next] = val;
            }
            return prev[next];
        },data);
    }
    
    compileElement(node){
        Array.from(node.attributes).forEach(attr=>{
            let {name,value} = attr;
            if(this.isDirective(name)){
                let val = utils.getVal(value,this.data);
                utils.updateElement(node,val);
                new Watch(this.data,value,(newValue)=>{
                    utils.updateElement(node,newValue);
                });
                node.addEventListener('input',(e)=>{
                    let val = e.target.value;
                    this.setVal(val,value,this.data);
                });
            }
        });
    }

    compileText(node){
        let reg = /\{\{([^}]+)\}\}/g; //{{a}} {{b}}
                node.text = node.textContent;
                node.textContent.replace(reg,(...args)=>{
                    let val = utils.getVal(args[1],this.data);
                    utils.updateText(node,val);
                    new Watch(this.data,args[1],(newValue)=>{
                     node.textContent = node.text.replace(reg,(...args)=>{
                            return utils.getVal(args[1],this.data);
                        });
                        
                    });
                })
    }
    compile(frg){
        Array.from(frg.childNodes).forEach(node=>{
            if(node.childNodes.length){
                // 一级级深入遍历
                this.compile(node);
            }
            if(this.isElement(node)){
                 // 这里需要编译元素
                this.compileElement(node);
            }else{
                //文本节点
                this.compileText(node);
            }
        });
    }
}
utils = {
    getVal(expr,data){
        expr = expr.split('.');
        expr = expr.reduce((prev,next)=>{
            return prev[next];
        },data);
        return expr;
    },
    updateElement(node,value){
        node.value = value;
    },
    updateText(node,value){
        node.textContent = value;
    }
};