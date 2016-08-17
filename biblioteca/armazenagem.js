'use strict';

/*******************************************************************
 * Limitador é de (C) propriedade da Devowly Sistemas 2015-2016    *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id armazenagem.js, criado em 16/08/2016 às 17:02 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

function Armazenagem(intervalo) {
  var visitas = {};

  this.incrementar = function(chave, cd) {
    if (visitas[chave]) {
      visitas[chave]++;
    } else {
      visitas[chave] = 1;
    }

    cd(null, visitas[chave]);
  };

  this.reiniciarTodos = function() {
    visitas = {};
  };

  // Utilizamos isso para permitir que seja resetado todos os IPs de um ou de todos
  this.reiniciarChave = function(chave) {
    delete visitas[chave];
  };

  // Simplesmente resetar todas as visitas a cada intervalo
  setInterval(this.reiniciarTodos, intervalo);
}

module.exports = Armazenagem;
