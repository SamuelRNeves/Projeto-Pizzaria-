let cart = []; // Array que armazena os itens no carrinho
let modalQt = 1; // Quantidade de itens no modal
let modalkey = 0; // Chave do item selecionado no modal

const c = (el) => document.querySelector(el); // eFunção para selecionar um único elmento
const cs = (el) => document.querySelectorAll(el); // Função para selecionar múltiplos elementos

// Mapeia o array pizzaJson para criar os itens da pizza na página
pizzaJson.map((item, index) => {
    // Clona o template do item da pizza
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    // Preenche as informações do item da pizza
    pizzaItem.setAttribute('data-key', index); // Define um atributo data-key com o índice da pizza
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; // Define a imagem da pizza
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; // Define o nome da pizza
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description; // Define a descrição da pizza
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; // Define o preço da pizza

    // Adiciona evento de clique ao link do item da pizza
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link
        let key = e.target.closest('.pizza-item').getAttribute('data-key'); // Pega a chave da pizza clicada
        modalQt = 1; // Reseta a quantidade do modal para 1
        modalkey = key; // Define a chave do modal para a pizza clicada

        // Preenche o modal com as informações da pizza
        c('.pizzaBig img').src = pizzaJson[key].img; // Imagem grande da pizza
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name; // Nome da pizza
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description; // Descrição da pizza
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`; // Preço atual da pizza

        // Remove a seleção anterior de tamanho
        c('.pizzaInfo--size.selected').classList.remove('selected');
        // Seleciona o tamanho padrão (médio)
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]; // Preenche os tamanhos
        });

        c(".pizzaInfo--qt").innerHTML = modalQt; // Define a quantidade inicial no modal

        // Exibe o modal com transição de opacidade
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    // Adiciona o item da pizza na área de pizzas
    c('.pizza-area').append(pizzaItem);
});


// Função para fechar o modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

// Adiciona eventos de clique para fechar o modal
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

// Diminui a quantidade no modal
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

// Aumenta a quantidade no modal
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

// Seleciona o tamanho da pizza no modal
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

// Adiciona a pizza ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = c('.pizzaInfo--size.selected').getAttribute("data-key");
    let identifier = pizzaJson[modalkey].id + "@" + size; // Identificador único da pizza

    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt; // Atualiza a quantidade se a pizza já estiver no carrinho
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalkey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});


c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
        
    }
    
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
})

// Atualiza a interface do carrinho
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;
    if (cart.length > 0) {
        c('aside').classList.add("show");
        c('.cart').innerHTML = '';
        //for para retornar os item do carinho 
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){

            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);
            let pizzaSizeName;
            switch(cart[i].size){
                case '0':
                    pizzaSizeName = '(Pequena)';
                    break;
                case '1':
                    pizzaSizeName = '(Média)';
                    break;
                case '2':
                    pizzaSizeName = "(Grande)";
            }
            let pizzaName = `${pizzaItem.name} ${pizzaSizeName}`;
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            })


            c('.cart').append(cartItem);

            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
      
        }
    } else {
        c('aside').classList.remove("show");
        c('aside').style.left = '100vw';
    }
}
