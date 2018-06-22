/**
 * @author Aelous
 * @Description: restaurant dom操作
 */
class restaurantDomOperate {
    constructor() {
    }

    //更新现金数量
    updateCash(cash) {
        document.getElementById("cash").innerHTML = `$${cash}`;
    }
}

/**
 * @author Aelous
 * @Description: cook dom操作
 */
class cookDomOperate {
    constructor() {
        this.position
        this.cookDom
        this.cookDomFather
        this.cookState
        this.timeLeft
    }

    //在container中创建厨师dom
    createCook(container) {
        //innerHTML添加元素的时候比较尴尬
        //创建厨师工位
        let cookStation = document.createElement('div');
        cookStation.setAttribute('class','cook-station');
        //创建工位内部信息：厨师图片 要做菜品列表 厨师当前状态
        let cookIcon = document.createElement('img');
        cookIcon.setAttribute('src','img/cook.png');
        // cookIcon.setAttribute('class','cook-icon');
        let cookingList = document.createElement('div');
        cookingList.setAttribute('class','cooking-list');
        let cookState = document.createElement('div');
        cookState.setAttribute('class','cook-state');
        cookStation.appendChild(cookIcon);
        cookStation.appendChild(cookingList);
        cookStation.appendChild(cookState);
        this.cookDom = cookIcon;
        this.cookDomFather = cookStation;
        container.appendChild(cookStation);
        // this.position = container.childElementCount * 80;
    }

    //添加待做食物列表
    addCookingList(order) {
        let listObj = this.cookDomFather.getElementsByClassName('cook-list')[0];
        order.forEach(item => {
            let itemObj = document.createElement('li');
            itemObj.innerText = item.name;
            itemObj.setAttribute('name', item.name);
            listObj.appendChild(itemObj);
        })
    }

    //移除正在做的菜
    removeItem(meal) {
        let target = this.cookDomFather.querySelector(`li[name=${meal.name}]`);
        this.cookDomFather.getElementsByClassName('cook-list')[0].removeChild(target);
        return meal
    }

    //添加动态
    addState(meal) {
        let stateObj = document.createElement('li');
        stateObj.innerHTML = `正在做${meal.name}`;
        let time = document.createElement('li');
        this.timeLeft = meal.takeTime;
        time.innerHTML = `还剩${this.timeLeft}s`;
        this.cookState = this.cookDomFather.getElementsByClassName('cook-state')[0];
        this.cookState.appendChild(stateObj);
        this.cookState.appendChild(time);
    }

    //更新时间
    updateTime() {
        this.timeLeft -= 1;
        this.cookState.lastElementChild.innerHTML = `还剩${this.timeLeft}s`;
    }

    //移除动态
    removeState() {
        let target = this.cookState.lastElementChild;
        if (target.innerHTML === '还剩0s') {
            this.cookState.innerHTML = '';
        }
    }
}

/**
 * @author Aelous
 * @Description:  waiter dom操作
 */
class waiterDomOperate {
    constructor() {
        this.defaultPosition = 'left:185px;top:226px;';
        this.waiterDom;
    }

    //创建侍者
    createWaiter() {
        let mainContentObj = document.getElementsByClassName('main-content')[0];
        let svgObj = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgObj.setAttribute('class', 'icon waiter');
        svgObj.innerHTML = '<use xlink:href="#icon-kongcheng"></use>';
        this.waiterDom = svgObj;
        mainContentObj.appendChild(svgObj);
        this.undo();
    }

    //回到默认位置
    goToDefault() {
        this.waiterDom.setAttribute('style', this.defaultPosition);
    }

    //到顾客身边
    goToTheCustomer(customerSeat) {
        switch (customerSeat) {
            case '1':
                this.waiterDom.setAttribute('style', 'left: 275px;top: 196px;');
                break;
            case '2':
                this.waiterDom.setAttribute('style', 'left: 446px;top: 196px;');
                break;
            case '3':
                this.waiterDom.setAttribute('style', 'left: 618px;top: 196px;');
                break;
            case '4':
                this.waiterDom.setAttribute('style', 'left: 275px;top: 258px;');
                break;
        }
    }

    //到厨师身边
    goToTheCook(mode, cook) {
        // 传递菜单 找free属性的cook
        // 传菜，找complete属性
        // mode === 'order'-> removeAttribute('free')
        // mode === 'pass' -> removeAttribute('complete')
        let kitchenObj = document.getElementsByClassName('kitchen')[0];
        if (mode === 'order') {
            let cookObj = kitchenObj.querySelector('svg[free=""]');
            if (cookObj) {
                return {left: 187, top: Number(cook.dom.position)}
            }
        }
        else if (mode === 'pass') {
            let cookObj = kitchenObj.querySelector('svg[complete=""]');
            if (cookObj) {
                return {left: 187, top: Number(cook.dom.position)}
            }
        }
        else {
            alert('参数有错');
        }
    }
}

/**
 * @author Aelous
 * @Description: customer dom操作
 */
class customerDomOperate {
    constructor() {
        this.emptySeat;
        this.seatIndex;
        this.state;
    }

    //创建客人等待队列
    createCustomerList(container) {
        let svgObj = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgObj.setAttribute('class', 'icon customer');
        svgObj.innerHTML = '<use xlink:href="#icon-liyi"></use>';
        container.appendChild(svgObj);
    }

    // 获取空座位
    getEmptySeat() {
        let diningArea = document.getElementsByClassName('dining-area')[0];
        let children = [...diningArea.children];
        for (x of children) {
            if (x.hasAttribute('empty')) return x
        }
    }

    // 安排坐下
    sitDown() {
        this.emptySeat = this.getEmptySeat();
        this.emptySeat.innerHTML = `<svg class="icon customer-eat" aria-hidden="true"><use xlink:href="#icon-zixi"></use></svg>`;
        this.emptySeat.removeAttribute('empty');
        this.seatIndex = this.emptySeat.getAttribute('index');
        // 创建空状态列表
        this.state = document.createElement('div');
        this.state.setAttribute('class', 'customer-state');
        this.emptySeat.appendChild(this.state);
    }

    // 腾出空位
    seatEmpty() {
        this.emptySeat.innerHTML = '';
        this.emptySeat.setAttribute('empty', '');
    }

    // 更新点餐状态
    updateOrderState(time) {
        this.state.innerHTML = `点餐${time}s`;
    }

    // 去除点餐状态，加上上菜列表
    addOrderList(order) {
        this.state.innerHTML = '';
        order.forEach(item => {
            let li = document.createElement('li');
            li.setAttribute('name', item.name);
            li.innerHTML = item.name;
            this.state.appendChild(li);
        })
    }

    // 更新上菜状态
    updateOrderList(meal, mode, time) {
        if (mode === 'eat') {
            let li = this.state.querySelector(`li[name=${meal.name}]`);
            li.setAttribute('style', 'color:red');
            let child = li.firstElementChild;
            if (child) li.removeChild(li.firstElementChild);
            let timeObj = document.createElement('i');
            timeObj.innerHTML = `${time}s`;
            li.appendChild(timeObj);
        }
        else if (mode === 'over') {
            this.state.removeChild(this.state.querySelector(`li[name=${meal.name}]`));
        }
    }
}