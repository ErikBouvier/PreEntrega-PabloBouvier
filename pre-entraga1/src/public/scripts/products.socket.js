const socket = io();

const productsList = document.getElementById('products-list');    
const productsForm = document.getElementById('product-form');
const errorMessage = document.getElementById('error-message');
const productId = document.getElementById('product-id');
const btnDelete = document.getElementById('btn-delete-product');

socket.on('products-list', (data) => {
    const products = data.products || [];

    productsList.innerText = '';

    products.forEach(product => {
        productsList.innerHTML += `<li>Id: ${product.id} - Nombre: ${product.title} - Categoria: ${product.category} - Price: ${product.price} </li>`;
    });
})

productsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;
    const formdata = new FormData(form);
    console.log('formData',);
    

    errorMessage.innerText = '';

    form.reset();

    socket.emit('new-product', {
        title: formdata.get('title'),
        description: formdata.get('description'),
        code: formdata.get('code'),
        price: formdata.get('price'),
        status: formdata.get('status') || 'off',
        stock: formdata.get('stock'),
        category: formdata.get('category'),
    });
});

btnDelete.addEventListener('click', () => {
    const id = productId.value;
    productId.innerText = '';
    errorMessage.innerText = '';

    if (id > 0){
        socket.emit('delete-product', { id });
    }
})

socket.on('error-message', (data) => {
    errorMessage.innerText = data.message;
});





