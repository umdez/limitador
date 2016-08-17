'use strict';

/*******************************************************************
 * Limitador é de (C) propriedade da Devowly Sistemas 2015-2016    *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id armazem.js, criado em 16/08/2016 às 17:02 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

function Armazem(windowMs) {
  var visitas = {};

  this.incr = function(chave, cd) {
    if (visitas[chave]) {
      visitas[chave]++;
    } else {
      visitas[chave] = 1;
    }

    cd(null, visitas[chave]);
  };

  this.resetAll = function() {
    visitas = {};
  };

  // Utilizamos isso para permitir que seja resetado todos os IPs de um ou de todos
  this.resetKey = function(chave) {
    delete visitas[chave];
  };

  // Simplesmente resetar todas as visitas a cada windowMs
  setInterval(this.resetAll, windowMs);
}

module.exports = Armazem;
