class UI {
    static generateItemCart () {
        const cart = document.querySelector('.cart');
        const cart__informacion = document.querySelector('.cart__informacion');
        const informacion__cantidad = document.querySelector('.informacion__cantidad');
        const informacion__total = document.getElementById('informacion__total')
        if(basket.length == 0) {
        cart__informacion.classList.add('empty')
        cart__informacion.innerHTML = `
        <div class="informacion__titulo empty">
            <h1 class="titulo__page">SHOPCART</h1>
            <i class="bi bi-cart2"></i>
        </div>
        <p>Tu carrito esta vacío! </p>
        <p class="informacion__total"><b>Sigue comprando!</b></p>
        <div class="informacion__botones">
            <a href="./index.html">
            <div class="boton__home">Regresar</div>
            </a>
        </div>
        `,
        cart.innerHTML = ` `
        }
        else {
        return cart.innerHTML = infoItem.map((item)=>{
            let search = basket.find((item_storage)=>item_storage.id == item.id);
            if(search !== undefined){
                
                return `
                    <div class="cart__producto" data-cart="${item.id}">
                        <div class="producto__imagen">
                            <img width="200px" class="imagen__producto" src="../imagenes/${item.imagen}">
                        </div>
                        <div class="producto__detalle">
                            <h2 class="producto__name">${item.name}</h2>
                            <p>${item.detail}</p>
                            <h2 class="producto__name__talla">Talla: (Elegir talla)</h2>
                            <div class="producto__talla" data-id="${item.id}">
                                <div class="talla" id="${item.id+"S"}">S</div>
                                <div class="talla" id="${item.id+"M"}">M</div>
                                <div class="talla" id="${item.id+"L"}">L</div>
                                <div class="talla" id="${item.id+"XL"}">XL</div>
                            </div>
                            <div class="producto__precio_cantidad">
                                <h2 class="producto__precio precios">Total: $${item.price * search.cantidad}</h2>
                                <div class="producto__cantidad">
                                    <i class="bi bi-dash-lg" onclick="Cart.decrementar(${item.id})"></i>
                                    <div id="${item.id}" class="cantidad__articulo">${search.cantidad}</div>
                                    <i class="bi bi-plus-lg" onclick="Cart.incrementar(${item.id})"></i>
                                </div>
                            </div>
                        </div>
                    </div>
            `
        }}).join(""),
        informacion__cantidad.innerHTML = `${Cart.calculation__cantidad()}`,
        informacion__total.innerHTML = `Total a pagar: $${Cart.calculation__total_price()}`;
    }
    }

    static calculation () {
        const cart__number = document.querySelector('.cart__number');
        let final__number = 0;
        basket.map((item_storage)=>{
            final__number += item_storage.cantidad
        })
        cart__number.textContent = final__number;
        UI.generateItemCart();
        Cart.agregar__talla();
    }

    static update (divItem) {
        let idItem = divItem.id;
        let search = basket.find((item_storage)=>item_storage.id == idItem);
        divItem.textContent = search.cantidad;
        Store.setItems();
        UI.calculation();
    }

    static generateTalla () {
        let arreglo_tallas = document.querySelectorAll('.talla');

        arreglo_tallas.forEach((talla)=>talla.classList.remove('active'));

        basket.forEach((item_storage)=>{
            let idItem = String(item_storage.id);
            let tallaItem = String(item_storage.talla);
            let idTallaActive = idItem + tallaItem;

            arreglo_tallas.forEach((talla) => {
                if(talla.id == idTallaActive){
                    talla.classList.add('active');
                }
            })
        })
    }

    static block__pagar() {
        const boton__home_enlace = document.querySelector('.boton__home_enlace');
        boton__home_enlace.addEventListener('click',(e)=>{
            let falta_talla = basket.some((item_storage) => item_storage.talla == 0);
            if(falta_talla){
                console.log("HAY UN CERO")
                e.preventDefault();
            } else {
                console.log("TODO BIEN");
            }
            UI.block__item();
        })
    }

    static block__item(){
        basket.forEach((item_storage)=>{
            if(item_storage.talla == 0){
                let idItem = item_storage.id;
                let arreglo__carts = document.querySelectorAll('.cart__producto');
                arreglo__carts.forEach((cart)=>{
                    let idCart = cart.getAttribute("data-cart");
                    if(idItem == idCart){
                        cart.classList.add('active');
                        setTimeout(()=>{
                            cart.classList.remove('active')
                        },300)
                    }
                })
            }
        })
    }

}

class Cart {
    static incrementar(id){
        let divItem = id;
        let idItem = divItem.id;
        let search = basket.find((item_storage)=>item_storage.id == idItem);
        search.cantidad += 1;
        UI.update(id)
    }

    static decrementar(id){
        let divItem = id;
        let idItem = divItem.id;
        let search = basket.find((item_storage)=>item_storage.id == idItem);
        if(search.cantidad > 0){
            search.cantidad -= 1;
        }
        UI.update(divItem)
    }

    static calculation__cantidad () {
        let final__number = 0;
        basket.map((item_storage)=>{
            final__number += item_storage.cantidad;
        })
        return final__number;
    }

    static calculation__total_price(){
        let arreglo_precios = document.querySelectorAll('.precios')
        let final__number = 0;
        arreglo_precios.forEach((precio)=>{
            let cantidad = parseFloat(precio.textContent.replace('Total: $','').trim());
            final__number += cantidad;
        })
        return final__number;
    }

    static vaciar__cart(){
        basket = [];
        Store.setItems();
        UI.calculation();
    }

    static agregar__talla () {
        const arreglo_tallas = document.querySelectorAll('.talla');
        arreglo_tallas.forEach((talla)=>{
            talla.addEventListener('click',()=>{
                let idItem = talla.parentElement.getAttribute("data-id");
                let final_talla = talla.textContent;
                let search = basket.find((item_storage)=>item_storage.id == idItem);
                search.talla = final_talla;
                Store.setItems();
                UI.generateTalla();
            })
        })
        UI.generateTalla();
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

let basket = Store.getItems();

UI.calculation();
Cart.agregar__talla();
UI.block__pagar();