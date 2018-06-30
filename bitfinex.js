const bfx = require('./bfx.js')

const ws = bfx.ws(2, {
	apiKey: 'xyRdYPsJwUCTIszDLBz0P0lDjZfJNENzL024zLZu8NZ', apiSecret: process.env.bkey,
  manageCandles: true, // enable candle dataset persistence/management
  transform: true // 
  })
const { Order } = require('./node_modules/bitfinex-api-node/lib/models')

const { MarginInfo } = require('./node_modules/bitfinex-api-node/lib/models')

var startDate = new Date();
const CANDLE_KEY = 'trade:1m:tBTCUSD'
const rest = bfx.rest(2, {
apiKey: 'xyRdYPsJwUCTIszDLBz0P0lDjZfJNENzL024zLZu8NZ', apiSecret: process.env.bkey});
var keys = []
var keys2 = []
ws.on('open', () => {
  ws.auth()
    console.log('open')
	rest.calcAvailableBalance('tBFTUSD', 1, 0.090072, 'MARGIN').then(balances => {
	console.log(balances[0]);
	})
    rest.symbols().then(symbols => {
        for (var s in symbols) {
            // console.log('t' + symbols[s].toUpperCase());
			if ( symbols[s].toUpperCase().slice(-3) == "ETH" ||  symbols[s].toUpperCase().slice(-3) == "BTC" ||  symbols[s].toUpperCase().slice(-3) == "USD"){
            keys.push('trade:1m:t' + symbols[s].toUpperCase());
			keys2.push('t' + symbols[s].toUpperCase());
            ws.subscribeCandles('trade:1m:t' + symbols[s].toUpperCase()) //'trade:1m:' + 
            ws.subscribeTicker('t' + symbols[s].toUpperCase()) //'trade:1m:' + 
			}
        }
        for (var k in keys) {
			
            //console.log(keys[k]);
			lpa[keys[k]] = null 
			lpb[keys[k]] = null 
			prevTS[keys[k]] = null
        }
		for (var k in keys) {
			candlecandle(keys[k]);
			tickerticker(keys2[k]);
			
		}
	
    }).catch(err => {
        console.log(err);
    })
})
var tickers = []
function tickerticker(k){
	
ws.onTicker({ symbol: k }, (ticker) => {
	if (btcusd != 0&& ethusd != 0){
	if (k.slice(-3)== "USD"){
						var amt = btcusd;
					if (!volKs.includes(k) && ((ticker.volume * ticker.ask) / amt)){						
					volKs.push(k);
						volTot += (ticker.volume * ticker.ask) / amt;
					}
					}
					else if (k.slice(-3)== "ETH"){
						var amt = ethusd;
					if (!volKs.includes(k) && ((ticker.volume * ticker.ask) / amt)){						
	
					volKs.push(k);
						volTot += (ticker.volume * ticker.ask) / amt;
					}
					}
					else if (k.slice(-3)== "BTC"){
						var amt = 1;
					if (!volKs.includes(k) && ((ticker.volume * ticker.ask) / amt)){						

					volKs.push(k);
						volTot += (ticker.volume * ticker.ask) / amt;
					}
					}
					var avg = volTot / volKs.length;
					if ((ticker.volume * ticker.ask) / amt > (avg / 20)){
						if (!tickers.includes('trade:1m:' + k)){
						tickers.push('trade:1m:' + k)
						
						}
					}
	}
});
}
function candlecandle(k){
	
ws.onCandle({ key: k }, (candles) => {
	//console.log(k);
	if (prevTS[k] === null || candles[1].mts > prevTS[k] || true) {
    const c = candles[1] // report previous candle
	if (c){
	/*
	if (k == 'trade:1m:tEOSUSD'){
		var diffs = []
		var diffa = 0
		for (var candle in candles){
		  if (candles[candle].close / candles[candle].open > 1.004){
			diffs.push(candles[candle].close / candles[candle].open);
			diffa+=(candles[candle].close / candles[candle].open)
		  }
		}
		console.log(candles.length);
		console.log(diffa / diffs.length);
		diffs = []
		diffa = 0
		for (var candle in candles){
		  if (candles[candle].close / candles[candle].open < .996){
			diffs.push(candles[candle].close / candles[candle].open);
			diffa+=(candles[candle].close / candles[candle].open)
		  }
		}
		console.log(diffa / diffs.length); 
    console.log(`%s %s open: %f, high: %f, low: %f, close: %f, volume: %f`,
      k, new Date(c.mts).toLocaleTimeString(),
      c.open, c.high, c.low, c.close, c.volume
    )
	}*/
	  //console.log(ticker);
	  if (k == 'trade:1m:tBTCUSD'){
		  btcusd = c.open;
	  }
	  if (k == 'trade:1m:tETHUSD'){
		  ethusd = c.open;
	  }
	  //	console.log(k.split(':')[2]);
					var diff2 = Math.abs(new Date() - startDate);
                    var minutes = Math.floor((diff2 / 1000) / 60);
                    var hours = ((diff2 / 1000) / 60 / 60).toFixed(18);
					//console.log(tickers);
					//console.log(tickers);
					if (tickers.includes(k)){
						//console.log(tickers);
		  
		//   console.log(c.close / c.open);
		if (!activeOrders.includes(k.split(':')[2])){
		  if (c.close / c.open > 1.004 || c.close / c.open < .996){
			  console.log(k);
		   console.log(c.close / c.open);
		   console.log(minutes);
		  }
  if ((c.close / c.open) > 1.0061){ //1.051
	 buy(k.split(':')[2], c.close);
  }else if ((c.close / c.open) < 0.9949){ //0.949
	 sell(k.split(':')[2], c.close)
  }
  lpa[k] = c.lastPrice
  lpb[k] = c.lastPrice
    prevTS[k] = candles[1].mts
		
		}		}
	}}
					});
	}

ws.once('auth', () => {
console.log('auth');
});
function buy(k, rate){
	setTimeout(function(){
		try {
	if (!activeOrders.includes(k)){
		  console.log('sell sell !! ' + k + ' ' + (rate));
	activeOrders.push(k);
	console.log(activeOrders);
	
rest.calcAvailableBalance(k, 1, rate, 'MARGIN').then(balances => {
	console.log(balances[0]);
		var amt = balances[0] / 7;
		console.log(amt);
		for (var v in activeOrders){
			amt = amt * 1.1;
		}
	
  console.log('sell price: ' + (rate) + ' amount ' + (-1 * amt * (1 / rate)));
  const o = new Order({
    cid: Date.now(),
    symbol: k,
    price: rate,
    amount: -1 * amt *.9995,
    type: Order.type.LIMIT
  }, ws)

  let closed = false

  // Enable automatic updates
  o.registerListeners()
o.on('error', () => {
	console.log('error');
});
  o.on('update', () => {
    console.log('order updated: %j', o.serialize())
	var os = 0;
	if (o.serialize().toString().indexOf('EXECUTED') != -1){
	if (parseFloat(o.serialize()[6]) == 0){
		os = (parseFloat(o.serialize()[7]));
	}else {
		os = parseFloat(o.serialize()[6]);
	}
  console.log('buy price: ' + (rate * 0.993) + ' amount ' + (-1 * os));
   const o2 = new Order({
    cid: Date.now(),
    symbol: k,
    price: (rate * 0.993),
    amount: -1 * os,
    type: Order.type.LIMIT
  }, ws)

  let closed2 = false

  // Enable automatic updates
  o2.registerListeners()

o2.on('error', () => {
	console.log('error');
});
  o2.on('update', () => {
    console.log('order updated: %j', o2.serialize())
  })

  o2.on('close', () => {
    console.log('order closed: %s', o2.status)
	activeOrders.splice( k, 1 );
	console.log(activeOrders);
    closed2 = true
  })

  console.log('submitting order %d', o2.cid)

  o2.submit().then(() => {
    console.log('got submit confirmation for order %d [%d]', o2.cid, o2.id)
  });
	}
  })

  o.on('close', () => {
    console.log('order closed: %s', o.status)
    closed = true
  })

  console.log('submitting order %d', o.cid)

  o.submit().then(() => {
    console.log('got submit confirmation for order %d [%d]', o.cid, o.id)
  });
});
	}
		}catch(err){console.log(err);}
	}, Math.random() * 5000);
}
function sell(k, rate){

	setTimeout(function(){
		try{
	if (!activeOrders.includes(k)){
		  console.log('buy buy !! ' + k + ' ' + (rate));
	activeOrders.push(k);
	console.log(activeOrders);
	
	rest.calcAvailableBalance(k, 1, rate, 'MARGIN').then(balances => {
	console.log(balances[0]);
		var amt = balances[0] / 7;
		console.log(amt);
		for (var v in activeOrders){
			amt = amt * 1.1;
		}
	
		console.log(amt);
		    console.log('buy price: ' + ((rate)) + ' amount ' + amt);

  const o = new Order({
    cid: Date.now(),
    symbol: k,
    price: rate *1.0005,
    amount: amt ,
    type: Order.type.LIMIT
  }, ws)

  let closed = false

  // Enable automatic updates
  o.registerListeners()

o.on('error', () => {
	console.log('error');
});
  o.on('update', () => {
    console.log('order updated: %j', o.serialize())
	var os = 0;
	if (parseFloat(o.serialize()[6]) == 0){
		os = (parseFloat(o.serialize()[7]));
	}else {
		os = parseFloat(o.serialize()[6]);
	}
	if (o.serialize().toString().indexOf('EXECUTED') != -1){
    console.log('sell price: ' + ((rate * 1.007)) + ' amount ' + (-1 * os));

   const o2 = new Order({
    cid: Date.now(),
    symbol: k,
    price: (rate * 1.007),
    amount: (-1 * os),
    type: Order.type.LIMIT
  }, ws)

  let closed2 = false

  // Enable automatic updates
  o2.registerListeners()

o2.on('error', () => {
	console.log('error');
});
  o2.on('update', () => {
    console.log('order updated: %j', o2.serialize())
  })

  o2.on('close', () => {
    console.log('order closed: %s', o2.status)
	activeOrders.splice( k, 1 );
	console.log(activeOrders);

    closed2 = true
  })

  console.log('submitting order %d', o2.cid)

  o2.submit().then(() => {
    console.log('got submit confirmation for order %d [%d]', o2.cid, o2.id)
  });
	}
  })

  o.on('close', () => {
    console.log('order closed: %s', o.status)
    closed = true
  })

  console.log('submitting order %d', o.cid)

  o.submit().then(() => {
    console.log('got submit confirmation for order %d [%d]', o.cid, o.id)
  });
    });
	}
	}catch(err){console.log(err);}
	}, Math.random() * 5000);3
}
var usds = []
var ethusd = 0;
var btcusd = 0;
var btcs = []
var prevTS = []
var eths = []

        
					var volTot = 0;
					var volKs= [];
var activeOrders = [ 'tBFTUSD', 'tBFTBTC', 'tELFUSD', 'tZRXUSD', 'tTRXUSD', 'tDADBTC' ]
var lpa = []
var lpb = []
// 'candles' here is an array

ws.on('error', (err) => {
	if (err.toString().indexOf('recv update') == -1){
  console.log(err)
	}
  if (err.toString().indexOf('EAI_AGAIN') != -1){
  setTimeout(function(){
	  ws.open()
  }, 60000);
  }
})
ws.open()