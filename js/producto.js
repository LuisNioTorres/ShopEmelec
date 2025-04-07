class UI {
    static generateProducto () {
        this.generateRecomendaciones();
        this.showInformacion();
        this.showDetalle();
        let wls = window.location.search;
        let productoId = new URLSearchParams(wls)

        //Conseguir ID
        let id = productoId.get('productoId');
        
        //Conseguir Info del ID
        let search = infoItem.find((item)=> item.id == id)

        const producto = document.querySelector('.producto');

        return producto.innerHTML = `
                        <div class="producto__imagenes" >
                    <div class="imagenes__imagenPrincipal">
                        <img class="imagenPrincipal" src="../imagenes/${search.imagen}">
                    </div>
                    <div class="imagenes__imagenSecundaria">
                        <img class="imagenSecundaria" id="imagenSecundaria1" src="../imagenes/secundaria1.jpg">
                        <img class="imagenSecundaria" id="imagenSecundaria2" src="../imagenes/secundaria2.jpg">
                    </div>
                </div>
                <div class="producto__detalle">
                    <h2 class="producto__nombre">${search.name}</h2>
                    <h2 class="producto__precio">$${search.price}</h2>
                    <p class="producto__detalle">${search.detail}</p>
                    <p class="producto__color">${search.color}</p>
                    <div class="producto__talla">
                        <h2 class="titulo__talla">Tallas:</h2>
                        <div class="tallas">
                            <div class="talla">S</div>
                            <div class="talla">M</div>
                            <div class="talla">L</div>
                            <div class="talla">XL</div>
                        </div>
                    </div>
                    <div class="boton__añadirProducto" onclick="UI.addToCart('${search.id}');">Añadir al Carrito <i class="detalle__carrito bi bi-cart2"></i></div>
                </div>
        `
    }

    static generateRecomendaciones () {
        const recomendaciones__productos = document.querySelector('.recomendaciones__productos');
        let nuevoArreglo = infoItem.sort(() => Math.random() - 0.5).slice(0, 3);
        recomendaciones__productos.innerHTML = nuevoArreglo.map((item)=>{
            return `
                        <div class="recomendacion" onclick="UI.verProducto('${item.id}')">
                        <img width="100px" class="recomendacion__imagen" src="../imagenes/${item.imagen}">
                        <h2 class="recomendacion__nombre">${item.name}</h2>
                        <h2 class="producto__precio">$${item.price}</h2>
                        </div>
            `
        }).join("")

    }

    static showInformacion () {
        const especificaciones__titulo = document.querySelector('.especificaciones__titulo');
        const especificaciones__texto = document.querySelector('.especificaciones__texto');
        especificaciones__titulo.addEventListener('click', () => {
            especificaciones__texto.classList.toggle('active');
        })
    }

    static showDetalle () {
        const detalles__titulo = document.querySelector('#detalles__titulo');
        const detalles__texto = document.querySelector('#detalles__texto');
        detalles__titulo.addEventListener('click',()=>{
            detalles__texto.classList.toggle('active');
        })
    }

    static calculation(){
        const cart__number = document.getElementById('cart__number');
        let final__number = 0;
        basket.map((item)=>{
            final__number += item.cantidad;
        })
        cart__number.textContent = final__number;
    }

    static addToCart(id) {
        let idItem = String(id);
        const cart__navegation = document.querySelector('.cart__navegation');
        let search = basket.find((x)=>x.id == idItem);
        if(search == undefined){
            basket.push({
                id : idItem,
                cantidad : 1,
                talla : 0
            });
            cart__navegation.classList.add('active');
            setTimeout(()=>{
                cart__navegation.classList.remove('active')
            },1000)
        } else {
            cart__navegation.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
            cart__navegation.classList.add('active');
            setTimeout(()=>{
                cart__navegation.classList.remove('active')
            },1000)
        }
        UI.calculation();
        Store.setItems();
    }

    static verProducto (id) {
        window.location.href = `producto.html?productoId=${id}`;
    }

    static verImagen () {
        const imagenPrincipal = document.querySelector('.imagenPrincipal');
        const imagenSecundaria1 = document.querySelector('#imagenSecundaria1');
        const imagenSecundaria2 = document.querySelector('#imagenSecundaria2');
        let imagenes = [
            imagenPrincipal,
            imagenSecundaria1,
            imagenSecundaria2
        ]

        imagenes.forEach((imagen) => {
            imagen.addEventListener('click', () => {
                if (imagen.classList.contains('active')) {
                    imagen.classList.remove('active');
                } else {
                    imagenes.forEach((i) => i.classList.remove('active')); 
                    imagen.classList.add('active'); 
                }
            });
        });
        
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
UI.generateProducto();
UI.verImagen();
