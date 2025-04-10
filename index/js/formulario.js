import {Store,Cart} from "../js/store.js"; // Importar la clase

// Obtener los elementos del carrito
let basket = Store.getItems();

class UI {
    static generateProducto () {
        UI.generateNumbers();
        Cart.calculation();
        UI.elegirTarjeta();
        const desglose__titulo = document.getElementById('desglose__titulo');
        basket.map((item_storage) => {
            infoItem.map((item) => {
                if(item_storage.id == item.id){
                    let producto = document.createElement('section');
                    producto.classList.add('producto');
                    producto.innerHTML = `
                        <div class="producto__imagen">
                            <img  src="./imagenes/${item.imagen}" class="producto_imagen">
                        </div>
                        <div class="producto__detalle">
                            <h3 class="producto__nombre">${item.name}</h3>
                            <p class="producto__precio">$${item.price}</p>
                            <div class="producto__cantidad">Cantidad:<p id="cantidad">${item_storage.cantidad}</p> </div>
                        </div>
                    `;
                    desglose__titulo.insertAdjacentElement("afterend", producto);
                }
            })
        })
    }

    static generateNumbers(){
        UI.generateSubtotal();
        UI.generateIVA();
        UI.generateTotal();
        UI.generateTotalPrice();
        Shop.verificarDescuento();
    }

    static generateSubtotal () {
        let subtotal_numero = document.getElementById('subtotal_numero');
        let subtotal = Shop.calculateSubtotal();
        subtotal_numero.textContent = `$ ${UI.formatCurrency(subtotal)}`;
    }

    static generateIVA () {
        let iva_numero = document.getElementById('iva_numero');
        let iva = Shop.calculateIVA();
        iva_numero.textContent = `$ ${UI.formatCurrency(iva)}`;
    }

    static generateTotal () {
        let total_numero = document.getElementById('total_numero');
        let total = Shop.calculateTotal();
        total_numero.textContent = `$ ${UI.formatCurrency(total)}`;
    }

    static regenerateTotal (descuento) {
        let total_numero = document.getElementById('total_numero');
        let total = Shop.calculateTotal();
        let total_total = parseFloat(total - descuento);
        total_numero.textContent = `$ ${UI.formatCurrency(total_total)}`;
        UI.generateTotalPrice();
    }

    static generateDescuento (descuento) {
        let descuento_numero = document.getElementById('descuento_numero');
        descuento_numero.classList.add('active');
        descuento_numero.textContent = `$ ${UI.formatCurrency(descuento)}`;
    }

    // Método para formatear el número con dos decimales y comas
    static formatCurrency(value) {
        return parseFloat(value).toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    static generateTotalPrice () {
        const total_numero = document.getElementById('total_numero');
        const total__price = document.querySelector('.total__price');
        let price = (total_numero.textContent).replace('$',"").trim();
        total__price.textContent = `$${price}`;
    }

    static elegirTarjeta () {
        const tarjetas = document.querySelectorAll('.tarjeta');
        tarjetas.forEach((tarjeta)=>{
            tarjeta.addEventListener('click',()=>{
                validaciones.tarjeta = true;
                tarjetas.forEach(tar => {
                    tar.classList.remove('active');
                    let circle = tar.querySelector('.bi-check-circle');
                    circle.classList.remove('active')
                })
                let circle = tarjeta.querySelector('.bi-check-circle');
                tarjeta.classList.add('active');
                circle.classList.add('active')
            })
        })
    }

    static generateMensajeError () {
        const mensaje__error = document.querySelector('.mensaje__error');
        mensaje__error.classList.add('active');
        mensaje__error.textContent = `ERROR. No se pudo realizar tu compra!`;
        setTimeout(()=>{
            mensaje__error.classList.remove('active')
        },1000)
    }

    static generateMensajeVacio () {
        const mensaje__error = document.querySelector('.mensaje__error');
        mensaje__error.classList.add('vacio');
        mensaje__error.textContent = `Completa todos los campos!`
        setTimeout(()=>{
            mensaje__error.classList.remove('vacio');
        },1500)
    }

    static generateMensajeExito () {
        const mensaje__exito = document.querySelector('.mensaje__exito');
        mensaje__exito.classList.add('active');
        setTimeout(()=>{
            mensaje__exito.classList.remove('active');
        },2500)
    }

    static generateFacturaFinal () {
        Cart.calculation();
        const payment__compra = document.querySelector('.payment__compra');
        const input_nombre = document.querySelector('#input__nombre');
        const input_cedula = document.querySelector('#input__cedula');
        const subtotal = document.querySelector('#subtotal_numero');
        const iva = document.querySelector('#iva_numero');
        const descuento = document.querySelector('#descuento_numero');
        const total = document.querySelector('#total_numero')

        payment__compra.innerHTML = `
                <div class="factura_final">
                    <div class="compra__desglose active">
                        <h2 class="desglose__titulo" id="desglose__titulo">FACTURA FINAL</h2>
                    </div>
                    <div class="compra__informacion_final active">
                                
                                <section class="info__grupo active">
                                    <h3 class="titulo" id="subtotal">Nombre</h3>
                                    <h3 class="titulo" id="subtotal">Cedula</h3>
                                    <h3 class="titulo" id="subtotal">Subtotal</h3>
                                    <h3 class="titulo" id="iva">IVA 12%</h3>
                                    <h3 class="titulo" id="descuento">Descuento</h3>
                                    <h3 class="titulo active" id="total">Total</h3>
                                </section>
                
                                <section class="info__grupo active end">
                                    <h3 class="titulo" id="subtotal_numero">${input_nombre.value}</h3>
                                    <h3 class="titulo" id="iva_numero">${input_cedula.value}</h3>
                                    <h3 class="titulo" id="subtotal_numero">${subtotal.textContent}</h3>
                                    <h3 class="titulo" id="iva_numero">${iva.textContent}</h3>
                                    <h3 class="titulo" id="descuento_numero">${descuento.textContent}</h3>
                                    <h3 class="titulo active" id="total_numero">${total.textContent}</h3>
                                    <i class="bi bi-check-circle factura"></i>
                                </section>
                
                    </div>
                </div>
        `;

        const boton__pagar = document.querySelector('.boton__pagar');
        boton__pagar.classList = ``;
        boton__pagar.innerHTML = ``;

        basket = [];
        localStorage.setItem('item',JSON.stringify(basket));
        Store.setItems();

        
    }

}

class Shop {
    static calculateSubtotal () {
        let subtotal = 0;
        basket.forEach(item_storage => {
            let search = infoItem.find((item) => item.id == item_storage.id);
            if(search){
                let number = item_storage.cantidad * search.price;
                subtotal += number;
            }
        });
        return subtotal;
    }

    static calculateIVA () {
        let subtotal = Shop.calculateSubtotal();
        let IVA = parseFloat((subtotal * 0.12).toFixed(2));
        return IVA;
    }

    static calculateTotal () {
        let subtotal = Shop.calculateSubtotal();
        let IVA = Shop.calculateIVA();
        let total = parseFloat((subtotal + IVA).toFixed(2));
        return total;
    }

    static verificarDescuento () {
        let cuponVerdadero = 303;
        const descuento__boton = document.getElementById('descuento__boton');
        const input__descuento = document.getElementById('input__descuento');
        descuento__boton.addEventListener('click', () => {
            let cupon = parseFloat(input__descuento.value);
            if(isNaN(cupon)) {
                input__descuento.classList.add('incorrecto');
                setTimeout(() => {
                    input__descuento.classList.remove('incorrecto');
                }, 1000);
            } else if (cupon !== cuponVerdadero) {
                input__descuento.classList.remove('correcto');
                input__descuento.classList.add('incorrecto');

                setTimeout(() => {
                    input__descuento.classList.remove('incorrecto');
                }, 1000);

                setTimeout(()=>{
                    input__descuento.value = "";
                },300)
            } else {
                input__descuento.classList.remove('incorrecto');
                input__descuento.classList.add('correcto');
                setTimeout(() => {
                    input__descuento.readOnly = true;
                }, 800);
                Shop.calculateDescuento();
            }
        });
    }

    static calculateDescuento () {
        let total = Shop.calculateTotal();
        let descuento = parseFloat((total * 0.12).toFixed(2));
        UI.generateDescuento(descuento);
        UI.regenerateTotal(descuento);
    }

    static validarShop () {
        let talla = basket.some(item_storage => item_storage.talla == 0);
        if(basket.length == 0){
            window.location.href = '../index.html';
        } else if (talla) {
                window.location.href = '../cart.html';
        } else return;
    }
}

const expresionesTeclas = {
    nombre: /^[a-zA-ZÁ-ÿ\s]{1,40}$/, 
    // Letras (mayús/minús), espacios y acentos, hasta 40 caracteres.

    cedula: /^\d{0,10}$/,

    numero: /^\d{0,12}$/, 
    // Número de tarjeta de crédito: entre 13 y 19 dígitos.

    fecha : /^(0?[1-9]|[12][0-9]|3[01])$/,

    codigo: /^\d{0,3}$/ 
    // CVV: normalmente 3 dígitos (Visa, MasterCard) o 4 (American Express).
};

const expresionesInputs = {
    nombre: /^[a-zA-ZÁ-ÿ\s]{1,40}$/, 
    // Letras (mayús/minús), espacios y acentos, hasta 40 caracteres.

    cedula: /^\d{10}$/,

    numero: /^\d{12}$/, 
    // Número de tarjeta de crédito: entre 13 y 19 dígitos.

    fecha : /^(0?[1-9]|[12][0-9]|3[01])$/,

    codigo: /^333$/ 
    // CVV: normalmente 3 dígitos (Visa, MasterCard) o 4 (American Express).
};

let validaciones = {
        cedula : false,
        nombre : false,
        numero : false,
        dia : false,
        mes : false,
        codigo : false,
        tarjeta : false
}

class Formulario {
    static escucharInput () {
        const inputs = document.querySelectorAll('.input');
        inputs.forEach((input)=>{
            input.addEventListener('keydown', (e)=>{
                let tecla = e.key;
                let value = input.value + tecla;
                // Permitir teclas de control como Backspace, Tab, flechas
                if (
                        tecla === "Backspace" || 
                        tecla === "Tab" ||
                        tecla === "ArrowLeft" ||
                        tecla === "ArrowRight"
                ) return;

                this.validarInput(input,e,value);
            })
        })

    }

    static validarInput (input,tecla,value) {
        switch (input.name) {
            case 'cedula' :
                this.validarTecla(expresionesTeclas.cedula,tecla,value)
                break;

            case 'nombre' :
                this.validarTecla(expresionesTeclas.nombre,tecla,value)
                break;

            case 'numero' :
                this.validarTecla(expresionesTeclas.numero,tecla,value)
                break;

            case 'mes' :
                this.validarTecla(expresionesTeclas.fecha,tecla,value)
                break;

            case 'dia' :
                this.validarTecla(expresionesTeclas.fecha,tecla,value)
                break;

            case 'codigo' :
                this.validarTecla(expresionesTeclas.codigo,tecla,value)
                break;
        }
    }

    static validarTecla (expresion,tecla,value) {
        if(expresion.test(value)){
        } else {
            tecla.preventDefault();
        }
    }

    static validarEnvio (inputs) {
        const boton__pagar = document.querySelector('.boton__pagar');
        boton__pagar.addEventListener('click',()=>{
            let array_inputs = Array.from(inputs);
            let esta_vacio = array_inputs.some(input => input.value == "")
            if (esta_vacio) {
                UI.generateMensajeVacio();
            } else {
                if(validaciones.cedula && validaciones.codigo && validaciones.dia && validaciones.mes 
                   && validaciones.nombre && validaciones.numero && validaciones.tarjeta){
                    UI.generateMensajeExito();
                    setTimeout(()=>{
                        UI.generateFacturaFinal();
                    },1800);
                    
                } else {
                    UI.generateMensajeError();
                }
            }
        })
    }

    static validarFormulario(expresion,input){
        if(expresion.test(input.value)){
            validaciones[input.name] = true;

        } else {
            validaciones[input.name] = false;
        }
    }

    static dirigirInput () {
        const inputs = document.querySelectorAll('.input');
        inputs.forEach((input)=>{
            input.addEventListener('keyup', () =>{
                switch (input.name) {
                    case 'cedula' :
                        this.validarFormulario(expresionesInputs.cedula,input)
                        break;
        
                    case 'nombre' :
                        this.validarFormulario(expresionesInputs.nombre,input)
                        break;
        
                    case 'numero' :
                        this.validarFormulario(expresionesInputs.numero,input)
                        break;
        
                    case 'mes' :
                        this.validarFormulario(expresionesInputs.fecha,input)
                        break;
        
                    case 'dia' :
                        this.validarFormulario(expresionesInputs.fecha,input)
                        break;
        
                    case 'codigo' :
                        this.validarFormulario(expresionesInputs.codigo,input)
                        break;
                }
            })
        })
    }

}

const inputs = document.querySelectorAll('.input');

window.addEventListener('load',()=>{
    Shop.validarShop();
});

UI.generateProducto();
Formulario.escucharInput();
Formulario.dirigirInput();
Formulario.validarEnvio(inputs);
