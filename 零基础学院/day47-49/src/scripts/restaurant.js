/*
 * @author 许东坡
 * @date 2018/7/6
 * @desc 餐厅类
 */
class Restaurant {
    constructor(arr) {
        this.cash = arr['cash'] || 0;
        this.seats = arr['seats'] || 0;
        this.staffList = arr['staffList'] || [];
        this.worldTime = 1000;      //基准时间
    }

    //招聘职员
    hire(staff) {
        if (this.staffList.indexOf(staff) === -1) {     //通过indexOf判断加入staff是否再staffList中
            this.staffList.push(staff);   //推入staffList中。
            console.log("招聘了" + staff.name);
        } else {
            console.log("招聘失败" + staff.name + "已经是你家员工了");
        }
    }

    //解雇职员
    fire(staff) {
        if (this.staffList.indexOf(staff) !== -1) {     //同上
            this.staffList.map((item, index) => {
                if (item.id === staff.id) {
                    this.staffList.splice(index, 1);
                    console.log("解雇了" + staff.name);
                }
            })
        } else {
            console.log("解雇失败" + staff.name + "不是你家员工");
        }
    }

    //获取基准时间
    getTime() {
        console.log("获取基准时间" + this.worldTime);
        return this.worldTime;
    }

    //设定基准时间
    setTime(num) {
        if (Number(num)) {
            console.log("设定基准时间为" + Number(num));
            this.worldTime = Number(num);
        }
        return this.worldTime;
    }

    //单例接口
    static getInstance(arr) {
        if (!this.instance) {
            this.instance = new this(arr);
        }
        return this.instance;
    }
}


/*
 * @author 许东坡
 * @date 2018/7/6
 * @desc 职员类，用于被继承
 */
let id = 0;

class Staff {
    constructor(name, salary) {
        this.id = ++id;
        this.name = name || '';
        this.salary = salary || 0;
    }

    startWork() {
        console.log(this.name + "开始工作");
    }

    finishWork() {
        console.log(this.name + "工作完毕");
    }

    //单例接口
    static getInstance(arr) {
        if (!this.instance) {
            this.instance = new this(arr);
        }
        return this.instance;
    }
}

/*
 * @author 许东坡
 * @date 2018/7/6
 * @desc 服务员类，继承自职员
 */
class Waiter extends Staff {
    constructor(name, salary) {
        super(name, salary);
        this.customer = {};
    }

    //改变状态
    changeStatus(str, dash) {
        let pos = document.querySelector("#waiter-wrapper");
        let waiterStatus = pos.querySelector("#waiter-status");       //获取状态值
        switch (str) {
            case '点单':
                waiterStatus.innerText = '点单';
                this.moveToWhere("Customer", pos);
                break;
            case '下单':
                waiterStatus.innerText = '下单';
                this.moveToWhere("Cook", pos);
                setTimeout(function (status) {
                    status.innerText = '空闲';
                }, 500, waiterStatus);        //status作为实参被传入function，上面俩status为形参
                break;
            case '上菜':
                waiterStatus.innerText = '上菜';
                this.moveToWhere("Customer", pos);
                //如果传入this.goToCook()必须为字符串格式
                setTimeout(this.moveToWhere, 500, "Cook", pos);
                setTimeout(function (status) {
                    status.innerText = '空闲';
                }, 1000, waiterStatus);
                this.customer.eat(dash);        //调用顾客吃的方法
                break;
        }
    }

    //定义移动函数
    moveToWhere(where, obj) {
        switch (where) {
            case "Customer":
                obj.style.top = '225px';
                obj.style.left = '550px';
                break;
            case "Cook":
                obj.style.top = '10px';
                obj.style.left = '320px';
                break;
        }
    }
}

/*
 * @author 许东坡
 * @date 2018/7/6
 * @desc 厨师类，继承自职员
 */
class Cook extends Staff {
    constructor(name, salary) {
        super(name, salary);
        this.preList = [];
    }

    startWork() {
        console.log(this.name + '烹饪菜品');
    }

    finishWork() {
        console.log(this.name + '烹饪完');
    }

    changeStatus(str) {
        let cookStatus = document.querySelector("#cook-status");
        switch (str) {
            case '开始':
                let i = 0;
                while (this.preList.length > 0) {
                    let dash = this.preList[0];     //取出菜单中的第一个元素进行烹饪
                    let arr = [];
                    for (let k = 1; k < this.preList.length; k++) {     //将其余元素放入arr[];
                        arr.push(this.preList[k]);
                    }
                    this.preList = arr;     //循环写入
                    for (let j = 0; j < dash.time; j++) {       //通过定时显示时间
                        setTimeout(function (dash) {
                            cookStatus.innerText = '烹饪' + dash.name + '还需' + (dash.time - j) + '秒'
                        }, (i * 1000 + j * 1000), dash);
                    }
                    i += dash.time;     //应该是做时间补偿用
                    let temp = this.preList;
                    let that = this;      //在闭包内部调用updateCookList()，先存入that中
                    setTimeout(function (temp, that, dash) {
                        Waiter.getInstance().changeStatus('上菜', dash);      //新建服务员单例进行上菜,dash服务于customer.eat()
                        that.updateCookList(temp);
                    }, i * 1000, temp, that, dash);
                }
                setTimeout(function () {
                    cookStatus.innerText = '空闲'
                }, i * 1000);
                break;
        }
    }

    //更新烹饪表
    updateCookList(order) {
        order = order || this.preList;
        let list = document.querySelector("#app #cook-list");
        let result = '';
        for (let i = 0; i < order.length; i++) {
            result += '<li>' + order[i].name + '</li>';
        }
        list.innerHTML = result;
    }
}

/*
 * @author 许东坡
 * @date 2018/7/6
 * @desc 顾客类
 */
class Customer {
    constructor() {
        //this.seatNumber = 0;
        this.eatList = [];      //存放点的菜，以及这些菜的状态（未上，已上，吃完）
    }

    order() {       //点单，并获取随机出的一个菜品列
        let list = Menu.getInstance().getRandom();
        return list;
    }

    changeStatus(str, time) {       //顾客状态改变
        let customerStatus = document.querySelector('#customer-status');
        switch (str) {
            case '入座':
                customerStatus.innerText = '入座';
                break;
            case '点单':
                for (let i = 0; i < time; i += 1000) {
                    setTimeout(function () {
                        customerStatus.innerText = '点单还需' + (time - i) / 1000 + '秒'
                    }, i);
                }
                break;
            case '点单完毕':
                customerStatus.innerText = '点单完毕';
                break;
        }
    }

    eat(dash) {     //吃每道菜需要3个时间单位      注：此处为3秒，不是单位时间
        let customerStatus = document.querySelector('#customer-status');
        let dashList = document.querySelectorAll('#customer-dash-list li');
        let d = {};
        for (let i = 0; i < dashList.length; i++) {
            if (dashList[i].innerText === dash.name) {
                d = dashList[i];
                break;
            }
        }
        d.innerText = dash.name + '已上';
        customerStatus.innerText = '开始用餐';
        setTimeout(function () {
            d.innerText = dash.name + '已吃完';
        }, 3000)
    }
}

/*
 * @author 许东坡
 * @date 2018/7/7
 * @desc 菜单类
 */
class Menu {
    constructor(list) {
        this.list = [];
        if (list != null) {
            for (let i in list) {
                this.add(list[i].name, list[i].cost, list[i].price, list[i].time);
            }
        }
    }

    add(name, cost, price, time) {          //添加菜品
        this.list.push(new Dash(name, cost, price, time));
    }

    getRandom() {       //随机获取菜品
        let times = Math.ceil(Math.random() * this.list.length);//获取次数
        let order = [];     //存放点单
        for (let i = 0; i < times; i++) {
            let index = Math.floor(Math.random() * this.list.length);
            if (order.indexOf(this.list[index]) === -1) {
                order.push(this.list[index]);
            }
        }
        return order;
    }

    //单例接口
    static getInstance(arr) {
        if (!this.instance) {
            this.instance = new this(arr);
        }
        return this.instance;
    }
}

/*
 * @author 许东坡
 * @date 2018/7/7
 * @desc 菜品类
 */
class Dash {
    constructor(name, cost, price, time) {         //time时间单位（1-10）
        this.name = name;
        this.cost = cost;
        this.price = price;
        this.time = time;
    }
}

export {Restaurant, Staff, Waiter, Cook, Customer, Dash, Menu};
