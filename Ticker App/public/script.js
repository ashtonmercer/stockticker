const tickersBySector = {
    'Technology': ['AAPL', 'MSFT', 'IBM', 'ORCL', 'PYPL', 'NVDA', 'QCOM', 'RBLX', 'EA', 'META', 'NOK'],
    'Healthcare': ['ABBV', 'BAX', 'BDX', 'BIIB', 'BMY', 'JNJ', 'PFE'],
    'Consumer Goods': ['KO', 'PG', 'WMT', 'NKE'],
    'Financial Services': ['BAC', 'GS', 'V'],
    'Industrial Goods': ['BA', 'LMT'],
    'Services': ['DIS', 'HD', 'LOW', 'SBUX', 'SHOP'],
    'Automotive': ['F', 'GM', 'TSLA'],
    'Energy': ['BP', 'XOM', 'OXY'],
    'Communication': ['T', 'VZ'],
    'Miscellaneous': ['BRK.A', 'BRK.B', 'U', 'UNH', 'ZM', 'BBY', 'C', 'CL', 'SQ']
};

const tickerList = document.getElementById('ticker-list');
const previousPrices = {};

for (const [sector, tickers] of Object.entries(tickersBySector)) {
    const sectorGroup = document.createElement('div');
    sectorGroup.className = 'sector-group';

    const sectorHeading = document.createElement('h2');
    sectorHeading.className = 'sector-heading';
    sectorHeading.textContent = sector;
    sectorGroup.appendChild(sectorHeading);

    tickers.forEach(ticker => {
        const tickerItem = document.createElement('div');
        tickerItem.className = 'ticker-item';
        tickerItem.id = `${ticker}-item`;
        tickerItem.innerHTML = `
            <strong class="symbol">${ticker}</strong>
            <span id="${ticker}-price">Fetching...</span>
            <span id="${ticker}-change" class="percentage"></span>
            <span id="${ticker}-number-change" class="number-change"></span>
        `;
        sectorGroup.appendChild(tickerItem);
    });

    tickerList.appendChild(sectorGroup);
}

setInterval(fetchPrices, 250);

async function fetchPrices() {
    for (const [, tickers] of Object.entries(tickersBySector)) {
        for (const ticker of tickers) {
            try {
                const response = await fetch(`https://generic709.herokuapp.com/stockc/${ticker}`);
                const quote = await response.json();
                const priceElement = document.getElementById(`${ticker}-price`);
                const changeElement = document.getElementById(`${ticker}-change`);
                const numberChangeElement = document.getElementById(`${ticker}-number-change`);
                const itemElement = document.getElementById(`${ticker}-item`);

                const newPrice = quote.price.toFixed(2);
                const oldPrice = previousPrices[ticker] || newPrice;
                const change = ((newPrice - oldPrice) / oldPrice) * 100;
                const numberChange = (newPrice - oldPrice).toFixed(2);

                priceElement.textContent = `$${newPrice} `;
                changeElement.textContent = `(${change.toFixed(2)}%)`;
                numberChangeElement.textContent = `${numberChange} USD`;

                if (change > 0) {
                    changeElement.classList.add('increase');
                    changeElement.classList.remove('decrease');
                } else if (change < 0) {
                    changeElement.classList.add('decrease');
                    changeElement.classList.remove('increase');
                }

                previousPrices[ticker] = newPrice;
            } catch (e) {
                console.error(e);
            }
        }
    }
}
