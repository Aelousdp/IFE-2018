import {Staff} from "./restaurant";
import {Waiter} from "./waiter";

class Cook extends Staff {
    constructor(name, salary) {
        super(name, salary);
        this.preList = [];
    }

    startWork() {
        console.log(this.name + '烹饪菜品')
    }

    finishWork() {
        console.log(this.name + '烹饪完')
    }

    changeStatus(str) {
        var status = document.querySelector("#cook-status");
        switch (str) {
            case '开始':
                let i = 0;
                while (this.preList.length > 0) {
                    var dash = this.preList[0];
                    //console.log(dash);
                    //this.preList.shift();
                    let arr = [];
                    for (let k = 1; k < this.preList.length; k++) {
                        arr.push(this.preList[k]);
                    }
                    this.preList = arr;
                    for (let j = 0; j < dash.time; j++) {
                        setTimeout(function (dash) {
                            status.innerText = '烹饪' + dash.name + '还需' + (dash.time - j) + '秒'
                        }, (i * 1000 + j * 1000), dash);
                    }
                    i += dash.time;
                    var temp = this.preList;
                    var it = this;
                    setTimeout(function (temp, it, dash) {
                        Waiter.getInstance().changeStatus('上菜', dash);
                        it.updateCookList(temp)
                    }, i * 1000, temp, it, dash);
                }
                setTimeout(function () {
                    status.innerText = '空闲'
                }, i * 1000);
                break;
            case '下单':
                status.innerText = '下单'
                break;
        }
    }

    updateCookList(order) {
        var order = order || this.preList;
        var list = document.querySelector("#app #cook-list");
        var result = '';
        for (let i = 0; i < order.length; i++) {
            result += '<li>' + order[i].name + '</li>';
        }
        list.innerHTML = result;
    }
}

export {Cook};