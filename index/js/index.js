const shop = document.getElementById('shop')

class UI {

    //Generar cada item en indexShop, leyendo los datos del arreglo infoItem.js
    static generateShopItem () {
        UI.removeCart();
        return shop.innerHTML = infoItem.map((item)=>{
            let search = basket.find((i)=>i.id == item.id);
            return `
            <div class="shop__item" id="shop__item?=${item.id}" >
                <div class="item__imagen" onclick="UI.verProducto('${item.id}')">
                    <img class="imagen__item" src="./imagenes/${item.imagen}">
                </div>
                <div class="item__detalle">
                    <h2 class="detalle__name" onclick="UI.verProducto('${item.id}')"> ${item.name} </h2>
                    <p onclick="UI.verProducto('${item.id}')"> ${item.detail}</p>
                    <div class="detalle__precio_cantidad">
                        <h2 class="detalle__precio" onclick="UI.verProducto('${item.id}')">$${item.price}</h2>
                        <div class="detalle__cantidad">
                            <i class="bi bi-dash-lg" onclick="Shop.decrementar(${item.id})"></i>
                            <div id="${item.id}" class="cantidad">${search == undefined ? 0 : search.cantidad}</div>
                            <i class="bi bi-plus-lg" onclick="Shop.incrementar(${item.id})"></i>
                        </div>
                    </div>
                </div>
            </div>
        `
        }).join("")
    }

    static update(divItem){
        let idItem = divItem.id;
        let search = basket.find((item)=>item.id == idItem )
        divItem.textContent = search.cantidad;
        Store.setItems()
        UI.calculation()
    }

    static calculation(){
        const cart__number = document.getElementById('cart__number');
        let final__number = 0;
        basket.map((item)=>{
            final__number += item.cantidad;
        })
        cart__number.textContent = final__number;
        this.generateCartItem()
    }

    static showNavegation (){
        const bi_cart2 = document.querySelector('.bi-cart2');
        const cart__navegation = document.querySelector('.cart__navegation')
        bi_cart2.addEventListener('click', () => {
            cart__navegation.classList.toggle('active')
            this.generateCartItem()
        })
    }

    static calculation__total_price() {
        let articulo__precio = document.querySelectorAll('.articulo__precio');
        let final__number = 0;
        articulo__precio.forEach((x) => {
            let precio = parseFloat(x.textContent.replace("$",''));
            if (!isNaN(precio)) { // Verifica que sea un número válido
                final__number += precio; // Suma al acumulador
            }
        });
        return final__number;    
    }
    
    static generateCartItem () {
        const cart__number = document.getElementById('cart__number');
        let number = cart__number.textContent;
        const navegation = document.querySelector('.navegation');
        const titulo__cart = document.querySelector('.titulo__cart');
        const navegation__price = document.querySelector('.navegation__price')

        if(number == 0){
            return titulo__cart.innerHTML = ` El carrito esta vacío!
                <i class="bi bi-cart2 cart_vacio"> </i>
            `, 
            navegation.innerHTML = ` `,
            navegation__price.innerHTML = ` <h3 class="titulo__cart"> Sigue comprando! </h3>`
            
        } else {
            return titulo__cart.innerHTML = ` CART `,

            navegation.innerHTML = infoItem.map((item)=>{
                let search = basket.find((item_canasta)=> item_canasta.id == item.id)
                if(search !== undefined){
                return `
                    <div class="articulo">
                            <div class="articulo__imagen">
                                <img class="imagen__articulo" src="./imagenes/${item.imagen}">
                            </div>
                            <div class="articulo__detalle">
                                <div class="articulo__botonX" onclick="UI.removeCartItem(${item.id})"><i class="bi bi-x"></i></div>
                                <h3 class="titulo__articulo"> ${item.name} </h3>
                                <div class="articulo__precio_cantidad">
                                <h2 class="articulo__precio">$${item.price * search.cantidad}</h2>
                                    <div class="articulo__cantidad">
                                        <i class="bi bi-dash-lg" onclick="Shop.decrementar(${item.id})"></i>
                                        <div class="cantidad__articulo">${search.cantidad}</div>
                                        <i class="bi bi-plus-lg " onclick="Shop.incrementar(${item.id})"></i>
                                    </div>
                                    
                                </div>
                            </div>
                    </div>
                    `
            }}).join(""),
            navegation__price.innerHTML = `<h3 class="titulo__cart"> TOTAL: $${this.calculation__total_price()} </h3>
                                           <a class="boton__pagar" href="./cart.html">COMPRAR</a>`
        }
 
    }

    static removeCartItem (id) {
        let divItem = id;
        let idItem = divItem.id;
        let search = basket.find((item_canasta)=>item_canasta.id == idItem);
        search.cantidad = 0;
        this.update(divItem)
    }

    static verProducto (id) {
        window.location.href = `producto.html?productoId=${id}`;
    }

    static removeCart () {
        document.addEventListener('click', (event) => {
            const cart__navegation = document.querySelector('.cart__navegation');
            const shop = event.target.closest('.shop');
            if(shop){
                cart__navegation.classList.remove('active');
            }
        })
    }
}


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
        basket = basket.filter((item)=>item.cantidad !== 0)
        localStorage.setItem('item',JSON.stringify(basket))
    }

}


class Shop {
    static incrementar(id) {
        let divItem = id;
        let idItem = divItem.id;
        let search = basket.find((x)=>x.id == idItem)
        if(search == undefined){
            basket.push({
                id : idItem,
                cantidad : 1,
                talla : 0
            })
        } else {
            search.cantidad += 1
        }
        UI.update(divItem);
    }

    static decrementar(id) {
        let divItem = id;
        let idItem = divItem.id;
        let search = basket.find((x)=>x.id == idItem)
        if(search == undefined) return
        else {
            if(search.cantidad>0){
                search.cantidad -= 1
            }
        }
        UI.update(divItem);
    }
}

let basket = Store.getItems()



UI.generateShopItem()
UI.calculation()
UI.showNavegation()





