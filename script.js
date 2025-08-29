// Finnhub API for US stocks
const finnhubKey = 'd2ok131r01qga5g9l0rgd2ok131r01qga5g9l0s0';
const finnhubSymbols = ['AAPL', 'MSFT'];

async function fetchFinnhubStock(symbol) {
  try {
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`);
    const data = await response.json();

    const price = data.c;
    const change = data.d;
    const percent = data.dp;

    const element = document.getElementById(symbol);
    if (element) {
      element.innerHTML = `₹${price} ${change >= 0 ? '▲' : '▼'} ${percent}%`;
      element.className = change >= 0 ? 'up' : 'down';
    }
  } catch (error) {
    console.error(`Error fetching ${symbol} from Finnhub:`, error);
    const element = document.getElementById(symbol);
    if (element) {
      element.innerHTML = 'Data unavailable';
    }
  }
}

// Alpha Vantage API for Indian stocks
const alphaKey = '8BOU6EJ4S3S2NXRU';
const alphaSymbols = ['RELIANCE.BSE', 'TCS.BSE'];

async function fetchAlphaStock(symbol) {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${alphaKey}`;
    const response = await fetch(url);
    const data = await response.json();

    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) {
      throw new Error('No data returned');
    }

    const price = quote['05. price'];
    const change = quote['09. change'];
    const percent = quote['10. change percent'];

    const element = document.getElementById(symbol);
    if (element) {
      element.innerHTML = `₹${parseFloat(price).toFixed(2)} ${change >= 0 ? '▲' : '▼'} ${percent}`;
      element.className = change >= 0 ? 'up' : 'down';
    }
  } catch (error) {
    console.error(`Error fetching ${symbol} from Alpha Vantage:`, error);
    const element = document.getElementById(symbol);
    if (element) {
      element.innerHTML = 'Data unavailable';
    }
  }
}

// Run both fetchers
function refreshData() {
  finnhubSymbols.forEach(symbol => fetchFinnhubStock(symbol));
  alphaSymbols.forEach(symbol => fetchAlphaStock(symbol));
}

refreshData(); // Initial fetch
setInterval(refreshData, 60000); // Auto-refresh every 60 seconds