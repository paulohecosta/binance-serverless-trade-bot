# Binance AWS Serverless Bot

> Automated serverless SWING DCA trading bot

I made a long search about cryptocurrency trade bots, I have tried to create machine learn estimators, read about market bots, fibonacchi coeficients and so on...

An important thing that I've noted so far is that, most of trade strategies are not good as buy a new and promissor crytocurrency and `HOLD` for long time and sell after. But still the problem is: When to sell? And: If I forget to sell in the right time...

### Example

ETH has growth 470% in 2020. And let say that a DayTrader can make 200% in a year.

So `effectiveness` is the difference of 200 to 470, that means that `effectiveness` is -270%.

But the point is, when ETH was falling in the period of 80 days after 2020-08-14 it losts 7% of value, some traders strategy that I've tested made 4% of growth that means `effectiveness` of `11%`.

So I realized that swing risk-reduced combined wth DCA strategies fits very well.

Some examples:

<details><summary>SOL</summary>
<p>
<img src="images/output_sol.png?raw=true"/>
SOLANA made 23% of `effectiveness` while falling -0.18% from 2021-09-11 to 2021-10-11.`
</p>
</details>

<details><summary>ALGO</summary>
<p>
<img src="images/output_algo.png?raw=true"/>
ALGO made 25% of `effectiveness` while falling -0.12% from 2021-09-11 to 2021-10-11.
</p>
</details>

<details><summary>An entire set of coins from 2021-09-11 to 2021-10-11</summary>
<div>
[ETH]   TOTAL=  104.53  BOT_GROWTH=0.05        MARKET_GROWTH=0.06     EFFECTIVENESS=-0.02<br/>
[DOGE]  TOTAL=  104.65  BOT_GROWTH=0.05        MARKET_GROWTH=-0.05    EFFECTIVENESS=0.09<br/>
[ADA]   TOTAL=  87.20   BOT_GROWTH=-0.13       MARKET_GROWTH=-0.08    EFFECTIVENESS=-0.05<br/>
[SOL]   TOTAL=  104.92  BOT_GROWTH=0.05        MARKET_GROWTH=-0.18    EFFECTIVENESS=0.23<br/>
[XRP]   TOTAL=  105.97  BOT_GROWTH=0.06        MARKET_GROWTH=0.08     EFFECTIVENESS=-0.02<br/>
[DOT]   TOTAL=  135.33  BOT_GROWTH=0.35        MARKET_GROWTH=0.18     EFFECTIVENESS=0.17<br/>
[LUNA]  TOTAL=  102.91  BOT_GROWTH=0.03        MARKET_GROWTH=-0.10    EFFECTIVENESS=0.12<br/>
[AVAX]  TOTAL=  90.97   BOT_GROWTH=-0.09       MARKET_GROWTH=0.15     EFFECTIVENESS=-0.24<br/>
[LTC]   TOTAL=  91.58   BOT_GROWTH=-0.08       MARKET_GROWTH=0.00     EFFECTIVENESS=-0.09<br/>
[ALGO]  TOTAL=  112.78  BOT_GROWTH=0.13        MARKET_GROWTH=-0.12    EFFECTIVENESS=0.25<br/>
[ICP]   TOTAL=  84.83   BOT_GROWTH=-0.15       MARKET_GROWTH=-0.21    EFFECTIVENESS=0.06<br/>
[MATIC] TOTAL=  104.11  BOT_GROWTH=0.04        MARKET_GROWTH=-0.05    EFFECTIVENESS=0.09<br/>
[FIL]   TOTAL=  82.61   BOT_GROWTH=-0.17       MARKET_GROWTH=-0.15    EFFECTIVENESS=-0.02<br/>
[XLM]   TOTAL=  107.47  BOT_GROWTH=0.07        MARKET_GROWTH=0.05     EFFECTIVENESS=0.03<br/>
[VET]   TOTAL=  122.66  BOT_GROWTH=0.23        MARKET_GROWTH=-0.02    EFFECTIVENESS=0.25<br/>
[ETC]   TOTAL=  104.68  BOT_GROWTH=0.05        MARKET_GROWTH=-0.06    EFFECTIVENESS=0.11<br/>
[TRX]   TOTAL=  108.06  BOT_GROWTH=0.08        MARKET_GROWTH=0.07     EFFECTIVENESS=0.01<br/>
[THETA] TOTAL=  113.80  BOT_GROWTH=0.14        MARKET_GROWTH=-0.02    EFFECTIVENESS=0.16<br/>
[ATOM]  TOTAL=  141.32  BOT_GROWTH=0.41        MARKET_GROWTH=0.10     EFFECTIVENESS=0.31<br/>
[XTZ]   TOTAL=  115.31  BOT_GROWTH=0.15        MARKET_GROWTH=0.13     EFFECTIVENESS=0.03<br/>
[XMR]   TOTAL=  107.64  BOT_GROWTH=0.08        MARKET_GROWTH=0.08     EFFECTIVENESS=-0.01<br/>
[EOS]   TOTAL=  114.19  BOT_GROWTH=0.14        MARKET_GROWTH=0.00     EFFECTIVENESS=0.14<br/>
[EGLD]  TOTAL=  98.51   BOT_GROWTH=-0.01       MARKET_GROWTH=0.02     EFFECTIVENESS=-0.03<br/>
[XEC]   TOTAL=  131.99  BOT_GROWTH=0.32        MARKET_GROWTH=-0.09    EFFECTIVENESS=0.41<br/>
[NEAR]  TOTAL=  136.98  BOT_GROWTH=0.37        MARKET_GROWTH=-0.26    EFFECTIVENESS=0.63<br/>
[FTM]   TOTAL=  96.75   BOT_GROWTH=-0.03       MARKET_GROWTH=0.36     EFFECTIVENESS=-0.39<br/>
[HBAR]  TOTAL=  88.90   BOT_GROWTH=-0.11       MARKET_GROWTH=0.07     EFFECTIVENESS=-0.18<br/>
[KSM]   TOTAL=  84.85   BOT_GROWTH=-0.15       MARKET_GROWTH=-0.13    EFFECTIVENESS=-0.02<br/>
[KLAY]  TOTAL=  86.13   BOT_GROWTH=-0.14       MARKET_GROWTH=0.25     EFFECTIVENESS=-0.39<br/>
[WAVES] TOTAL=  87.41   BOT_GROWTH=-0.13       MARKET_GROWTH=-0.10    EFFECTIVENESS=-0.03<br/>
[AXS]   TOTAL=  169.31  BOT_GROWTH=0.69        MARKET_GROWTH=0.78     EFFECTIVENESS=-0.08<br/>
[DASH]  TOTAL=  111.73  BOT_GROWTH=0.12        MARKET_GROWTH=-0.06    EFFECTIVENESS=0.17<br/>
[HNT]   TOTAL=  110.07  BOT_GROWTH=0.10        MARKET_GROWTH=-0.04    EFFECTIVENESS=0.14<br/>
[DCR]   TOTAL=  103.28  BOT_GROWTH=0.03        MARKET_GROWTH=-0.03    EFFECTIVENESS=0.07<br/>
[XEM]   TOTAL=  106.14  BOT_GROWTH=0.06        MARKET_GROWTH=-0.03    EFFECTIVENESS=0.09<br/>
[TFUEL] TOTAL=  117.87  BOT_GROWTH=0.18        MARKET_GROWTH=-0.03    EFFECTIVENESS=0.21<br/>
[ZEC]   TOTAL=  108.46  BOT_GROWTH=0.08        MARKET_GROWTH=-0.07    EFFECTIVENESS=0.15<br/>
[CELO]  TOTAL=  165.77  BOT_GROWTH=0.66        MARKET_GROWTH=0.12     EFFECTIVENESS=0.54<br/>
[SHIB]  TOTAL=  114.58  BOT_GROWTH=0.15        MARKET_GROWTH=2.73     EFFECTIVENESS=-2.59<br/>
[QTUM]  TOTAL=  108.55  BOT_GROWTH=0.09        MARKET_GROWTH=0.02     EFFECTIVENESS=0.06<br/>
[ZIL]   TOTAL=  93.08   BOT_GROWTH=-0.07       MARKET_GROWTH=-0.10    EFFECTIVENESS=0.03<br/>
[CAKE]  TOTAL=  97.60   BOT_GROWTH=-0.02       MARKET_GROWTH=-0.02    EFFECTIVENESS=0.00<br/>
[AAVE]  TOTAL=  77.31   BOT_GROWTH=-0.23       MARKET_GROWTH=-0.08    EFFECTIVENESS=-0.15<br/>
[FTT]   TOTAL=  87.10   BOT_GROWTH=-0.13       MARKET_GROWTH=-0.27    EFFECTIVENESS=0.14<br/>
[LINK]  TOTAL=  123.52  BOT_GROWTH=0.24        MARKET_GROWTH=-0.03    EFFECTIVENESS=0.27<br/>
[UNI]   TOTAL=  113.82  BOT_GROWTH=0.14        MARKET_GROWTH=0.08     EFFECTIVENESS=0.05<br/>
<br/>
ALL_EFFECTIVENESS=70%<br/>
ALL_GROWTH=8%<br/>

This means that this set of coins have grown 70% more than expected by the market in this period.
</div>
</details>

After some observations, or depending of the period, there are some cryptos better than other to keep in this trade dump algorithm.

`!!!BUT ATTENTION!!!`
It will depends of the coins you choose and the hyperparameters you set.
And the hyperparameters do not fit automatically the market since crypto market are imprevisible... So this is your very own risk... 

### Hyperparameters

Since the market changes the flow, another important note is to attach your startegies to hyperparamters, so we can be flexible to change them on th flight.
Restrictive params will avoid lose money but may not be effective, in other hand, less restrictive params will make more money but with higher risk.

### Risk Distributed

Other goal is distribute the capital among a list of cryptos combining the BOT with Dollar-cost averaging (DCA) strategy.
Your money will be distributed by the bot among many coins you believe, and so on, everything will be based on two params:

* buy_declive_coef: The size of the dip you want to wait;
* sell_coef: How much you want to wait to win, assuming the risk the crypt may fall before hit this %.

### Why AWS and Serveless?

I don't wanna have my computer turned on 24/7 and this bot was designed to be costless with AWS Free `forever` tier, because the use of Lambda and Dynamo do not reach the paying level under the current settings. 
I also don't want to do this in my computer because I have no patience, so I do not want to keep looking and let the bot work.

### AWS Architecture

The buyer bot will try to buy coins with some logic.

![Alt text](images/001.png?raw=true "Buyer Bot")

The seller bot will try to sell coins that have been bought by buyer bot after we made some profit.

![Alt text](images/002.png?raw=true "Seller Bot")

`!!!ALERT!!!`

This projet is informational only.

You should not construe any such information or other material as legal, tax, investment, financial, or other advice. Nothing contained here constitutes a solicitation, recommendation, endorsement, or offer by me or any third party service provider to buy or sell any securities or other financial instruments in this or in any other jurisdiction in which such solicitation or offer would be unlawful under the securities laws of such jurisdiction.

`USE AT YOUR OWN RISK`.

# THE PROJECT

## PRE REQS

* An AWS Account;
* A Binance Account - Use my link to create an account in order to support me XD https://accounts.binance.com/en/register?ref=228316343;

It is recommended a basic knowledge about how Lambda and AWS Infraestrucure works, and knowledge about `sam cli` and `aws cli` and `Docker`.

By now we need to use `dynamoConfig.json` and upload hyperparameters in the AWS DynamoDB Console interface.

`CAUTION` We need to use `config.json` to hold API keys to Access Binance for Production Instance. Use `config.sample.json` as example.

`CAUTION` We need to use `env.json` to hold API keys to Access Binance for local development. Use `env.sample.json` as example.

## Parameters

    "swap_value": 20,
    "trade_coins": "ETH,DOGE,ADA,SOL,XRP,DOT,LUNA,AVAX,LTC,ALGO,ICP,MATIC,FIL,XLM,VET,ETC,TRX,THETA,ATOM,XTZ,XMR,EOS,EGLD,XEC,NEAR,FTM,HBAR,KSM,KLAY,WAVES,AXS,DASH,HNT,DCR,XEM,TFUEL,ZEC,CELO,SHIB,QTUM,ZIL,CAKE,AAVE,FTT,LINK,UNI",
    "swap_coin": "USDT",
    "buy_toogle": "ON",
    "sell_toogle": "ON"

* swap_value: is the safety value for distributing along the cryptos, since swing trade is medium-term profit, you get better chances of make some money distributing along various coins;
* trade_coins: is the list of crypto the bot will observe for swing trade;
* swap_coin: is the stable coin used in the trade to maintain security of the profits.
* buy_toogle and sell_toogle: are the turn-off buttons to stop/start bot without deleting the stack in the AWS.
* other values are hyperparameters used to calibrate the bot startegies and are stored in dynamo to make easier to change them without deploy.

## The Logic Strategy

The current logic is on the file `math-helper.js` basically.
The current version it is still a little poor and need various improvements, and I am open to contributions.
## Support the project

* Discord Group: https://discord.gg/jZpCNNX5

### Donate
I am also open to credit that I can spend in production test :')
* BNB: 0xdFa49F4305CB4C3f6fcDb74814250c23587639a7
* SOL: Es6oAvGezMKC8aC6Xf4r25xvH743z9BGYKPX2EnwFwDz
* ETH: 0xFc2627cd3feCbD6A47e90de5000Ee9eCDF3E0d88
* ADA: addr1q82kfh3swrt2twkfld0f74fvaew7kk0qs9xrjg6uez5sv740rx0z75rxtaczvlswnm962tct44q3cyhk68gemjxkgpvsqva9sh

## Node Version
`nvm use --delete-prefix v14.16.1`

## Compile
`npm i` inside layer and lambda functions folder.

## Local Test
`sam local invoke "CoinSeller" --env-vars env.json`

`sam local invoke "CoinBuyer" --env-vars env.json`

`sam local invoke "ClearDynamoTable" --env-vars env.json`

## Run Simulation
`node app/_layer/simulation.js`

Please note that the simulator uses the remote hyperparameter table in AWS.
The simulator saves the results in JSON files for further analysis with `playground.ipynb`.

## Build on AWS
`npm i` inside layer and lambda functions folder.

`aws cloudformation package --template-file template.yaml --s3-bucket coins-artifacts --s3-prefix builds --output-template-file template-output.yaml --profile personal`
## Deploy on AWS

`aws cloudformation deploy --template-file template-output.yaml --s3-bucket coins-artifacts --s3-prefix builds --stack-name coin-analysis --capabilities CAPABILITY_NAMED_IAM --profile personal --parameter-overrides $(jq -r '.Parameters | to_entries | map("\(.key)=\(.value|tostring)") | .[]' config.json)`