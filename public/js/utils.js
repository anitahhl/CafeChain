const ccoBuy = document.getElementById('ccoBuy');
const etherBuy = document.getElementById('etherBuy');
const ccoSell = document.getElementById('ccoSell');
const etherSell = document.getElementById('etherSell');

ccoBuy.addEventListener('input', (res) => {
    etherBuy.innerHTML = (res.target.value) * 0.01;
});

ccoSell.addEventListener('input', (res) => {
    etherSell.innerHTML = (res.target.value) * 0.01;
});

