'use strict';

/*******************************************************************
 * Limitador é de (C) propriedade da Devowly Sistemas 2015-2016    *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id limitador.js, criado em 17/08/2016 às 12:20 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

var defaults = require('defaults');
var Promessa = require('bluebird');
var Armazenagem = require('./armazenagem');

/* Iniciamos aqui o serviço de funilamento. Assim iremos proteger nossos
 * estágios finais contra o uso abusivo.
 *
 *  - opcoes.intervalo (Opcional) Tempo em milisegundos que informa quanto tempo
 *  manteremos o registro de requisições na memoria.
 * 
 *  - opcoes.max (Opcional) Máximo número de requisições aceitas em um intervalo
 *  definido até enviarmos a resposta 429.
 * 
 *  - opcoes.mensagem (Opcional) A mensagem de resposta.
 * 
 *  - opcoes.cabecalhos (Opcional) Cabeçalhos customizados a serem enviados
 *  sempre que o limite for extrapolado.
 * 
 *  - opcoes.codigoDeEstatos (Opcional) Código de estatos (429) para muitas
 *  requisicoes.
 */
function Limitador(opcoes) {

  opcoes = defaults(opcoes, {
    intervalo: 60 * 1000, 
    max: 5, 
    mensagem : 'Muitas requisições. Tente novamente mais tarde.',
    codigoDeEstatos: 429, 
    cabecalhos: true, 
    geradorDeChave: function (requisicao) {
      return requisicao.ip;
    }
  });

  // Armazem a ser utilizado para manter a taxa limite de dados.
  opcoes.armazem = opcoes.armazem || new Armazenagem(opcoes.intervalo);

  // Assegura que a armazenagem escolhida possui o método incrementar.
  if (typeof opcoes.armazem.incrementar !== 'function' || typeof opcoes.armazem.reiniciarChave !== 'function') {
    throw new Error('A armazenagem provida é inválida.');
  }

  function limitarTaxa(requisicao, resposta, contexto) {
    var chave = opcoes.geradorDeChave(requisicao);

    return new Promessa(function(deliberar, recusar) {
      opcoes.armazem.incrementar(chave, function(erro, atual) {
       
        //if (erro) {
        //  recusar(erro);
        //}

        requisicao.limitarTaxa = {
          limite: opcoes.max,
          restante: Math.max(opcoes.max - atual, 0)
        };

        if (opcoes.cabecalhos) {
          resposta.setHeader('X-Limitador-Limite', opcoes.max);
          resposta.setHeader('X-Limitador-Restante', requisicao.limitarTaxa.restante);
        }

        // Nosso mediador retornou um erro. Isso significa que a operações não
        // deve ser autorizada.
        if (opcoes.max && atual > opcoes.max) {
          deliberar(contexto.erro(opcoes.codigoDeEstatos, opcoes.mensagem));
        }

        deliberar(contexto.continuar);
      });
    });
  };

  limitarTaxa.reiniciarChave = opcoes.armazem.reiniciarChave.bind(opcoes.armazem);

  return limitarTaxa;
}

module.exports = Limitador;