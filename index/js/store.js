class Store {
    static getItems(){
        let basket;
        if(localStorage.getItem('item') == undefined){
            basket = []
        } else {
            basket = JSON.parse(localStorage.getItem('item'));
        }
        return basket;
    }

    static setItems(){
        let basket = Store.getItems();
        basket = basket.filter((item)=>item.cantidad !== 0)
        localStorage.setItem('item',JSON.stringify(basket))
    }

}

class Cart {
    static calculation () {
        let basket = Store.getItems();
        const cart__number = document.querySelector('.cart__number');
        let final__number = 0;
        basket.map((item_storage)=>{
            final__number += item_storage.cantidad
        })
        cart__number.textContent = final__number;
    }
}

export {Store,Cart};