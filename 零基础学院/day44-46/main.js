/**
 * @author Aelous
 * @Description: 主程序
 */
//创建餐厅单例
const restaurant = Restaurant.getInstance({cash: 100, seats: 1, staffList: []});

//制作菜单  菜单结构：index:{name,cost,price}
const menu = Menu.getInstance([
    {name: '酱牛肉', cost: 35, price: 46,},
    {name: '青椒炒肉丝', cost: 10, price: 20,},
    {name: '老厨白菜', cost: 16, price: 8,},
    {name: '红烧鱼块', cost: 40, price: 40,},
    {name: '炸藕丸子', cost: 35, price: 30,},
    {name: '肉末豇豆粒', cost: 25, price: 15,},
    {name: '当归鸡翅', cost: 70, price: 33,},
    {name: '小鱼干煎饼饭', cost: 28, price: 42,},
    {name: '蛋炒饭', cost: 18, price: 10,}
]);

//创建厨师一号
const cook_1 = Cook.getInstance({name: '王厨师', salary: 4000});

//创建侍者一号
const waiter_1 = Waiter.getInstance({name: '许服务', salary: 3000});

//招聘
restaurant.hire(cook_1);
restaurant.hire(waiter_1);

//顾客队列
let customerQueue = [];

//创建顾客一二三四五
const customer_1 = new Customer({name: '赵', gender: '先生'});
const customer_2 = new Customer({name: '钱', gender: '女士'});
const customer_3 = new Customer({name: '孙', gender: '先生'});
const customer_4 = new Customer({name: '李', gender: '女士'});
const customer_5 = new Customer({name: '周', gender: '先生'});

customerQueue.push(customer_1, customer_2, customer_3, customer_4, customer_5);

//运转餐厅
document.getElementById("open").addEventListener('click', () => opening(customerQueue));

/**
 * @author Aelous
 * @Description: 餐厅运转
 * @param {array} queue
 */
async function opening(queue) {
    //保存队列
    let customerList = [...queue];
    while (restaurant.seats > 0
    && restaurant.cash > 0
    && restaurant.staffList.length > 0
    && customerList.length > 0) {
        // console.log(customerList[0]);
        //入座
        restaurant.seats -= 1;
        let currentCustomer = customerList.shift();      //删除第一个元素并返回
        console.log(">>>>>>来人");
        console.log("\"" + currentCustomer.name + currentCustomer.gender + "\"" + "落座");
        //点菜
        let order = [];
        await delay(1000);          //等待顾客落座
        order.push(currentCustomer.order(menu));
        let waiterFlag = waiter_1.doJob(order);
        await delay(1000);          //等待点菜
        console.log("\"" + currentCustomer.name + currentCustomer.gender + "\""
            + "点了一个\"" + `${order[0].name}` + "\"");
        //点菜完成，通知做菜
        let cookFlag = false;
        if (waiterFlag) {
            console.log(cook_1.name + "烹饪中...");
            await delay(4000);      //等待烹饪
            restaurant.cash = restaurant.cash - order[0].cost;
            cookFlag = cook_1.doJob(order);
        }
        //做菜完成，通知上菜
        if (cookFlag) {
            await delay(1000);      //上菜过程
            waiterFlag = waiter_1.doJob('');
            console.log("\"" + waiter_1.name + "\"说：" + "\""
                + currentCustomer.name + currentCustomer.gender + "\""
                + "这是您点的\"" + `${order[0].name}` + "\"");
            console.log(waiter_1.name + "上菜完成");
        }
        //顾客吃菜
        let customerFlag = false;
        if (waiterFlag) {
            await delay(1000);      //顾客吃菜
            console.log("这个" + `${order[0].name}` + "真香");
            customerFlag = currentCustomer.eat();
        }
        //顾客吃完离开
        if (customerFlag) {
            restaurant.seats += 1;
            restaurant.cash = restaurant.cash + order[0].price;
        }
    }
    await delay(1000);
    if (restaurant.cash <= 0) {
        console.log("破产啦~");
    }
    if (customerList.length <= 0) {
        console.log("没客人了");
    }
    if (restaurant.seats <= 0) {
        console.log("满客了");
    }
    if (restaurant.staffList.length <= 0) {
        console.log("员工跑了");
    }
}

/**
 * @author Aelous
 * @Description: 延时函数
 * @param {number} time
 */
function delay(time) {
    // return new Promise((resolve) => {
    //     setTimeout(function () {
    //         resolve();
    //     }, time);
    // })
}