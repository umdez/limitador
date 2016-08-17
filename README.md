# limitador
Ao trabalharmos com rotas REST nós precisamos sempre nos precaver do uso abusivo dos nossos serviços. Além disso, combateremos alguns ataques como, por exemplo, a negação de serviços. Além dos ataques nós precisamos nos precaver de tecnicas como o web scraping. Então temos aqui o proposito de oferecer características para limite de taxa de uso das rotas.

## Configurando
Na configuração é necessário informar o intervalo e o limite de requisições. Abaixo um exemplo:
```javascript
var limitadorDeUso = require('limitador');

var umLimiteQualquer = new limitadorDeUso({
  interlavo: 15*60*1000  // 15 minutos de intervalo.
, max: 2  // Apenas 2 requisições aceitas a cada intervalo.
});
```

## Como usar
O limitador depende completamento da biblioteca [Restificando](https://github.com/umdez/restificando). Eles podem trabalhar em conjunto, provendo assim uma ferramenta poderosa para controlar o acesso às rotas REST. Abaixo nós mostramos como eles trabalham:

```javascript

var limiteDeLeituras = new limitadorDeUso({
  intervalo: 15*60*1000, // 15 minutos.
  max: 2 // Apenas 2 requisições a cada intervalo.
});

fonte.ler.iniciar.antesQue(function(requisicao, resposta, contexto) {
  // Protege nossa rota de leitura.
  return limiteDeLeituras.Restificando(requisicao, resposta, contexto);
});

fonte.ler.iniciar(function(requisicao, resposta, contexto) {
  return contexto.continuar;
});

``` 
A partir da segunda versão, é possível também limitar o acesso às rotas do Express. Um exemplo abaixo:

```javascript
var aplic = require('express');
var limitadorDeUso = require('limitador');

var limiteDeAcessos = new limitadorDeUso({
  intervalo: 15*60*1000, // 15 minutos.
  max: 2 // Apenas 2 requisições a cada intervalo.
});

// Apenas aplica limite naquelas rotas que iniciam em '/umaRotaQualquer/'
aplic.use('/umaRotaQualquer/', limiteDeAcessos.Express);
```

## Créditos
- Todos os contribuidores do projeto [express-rate-limit](https://github.com/nfriedly/express-rate-limit), pois ele foi uma fonte de inspiração.
- Todos os contribuidores da [Devowly](https://github.com/devowly).
