var texto_mensagem_erro = "Atenção para mensagem abaixo : \n";
/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  $('#divCarregando').show();
  let url = 'http://127.0.0.1:5000/devocionals';
  fetch(url, {
    method: 'get',
  })
    .then(function (response) {
      $('#divCarregando').hide();
      if (response.ok) {
        response.json().then(function (data) {
          data.devocionais.forEach(item => insertList(item.id, item.referencia, item.versiculo, item.pensamento, item.oracao))
        });
      }
      else {
        response.json().then(function (data) {
          trata_mensagem_erro(data);
        });
      }
    })
    .catch((error) => {
      $('#divCarregando').hide();
      alert("Ocorreu um erro inesperado ao recupera item \nMotivo : " + error.message + 
        "\n\nEsta pagina tem uma dependencia  com uma API."+
        "\nPor favor verifique se API está disponivel."+
        "\nPara maiores informações acesse:\n"+
        "https://github.com/mrbol/mvp-api");
      console.log('Error:', error.message);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter um item existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const get = async (id) => {
  debugger;
  let url = 'http://127.0.0.1:5000/devocional?devocional_id=' + id;
  fetch(url, {
    method: 'get',
  })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          document.getElementById("id").value = data.id;
          document.getElementById("referencia").value = data.referencia;
          document.getElementById("versiculo").value = data.versiculo;
          document.getElementById("pensamento").value = data.pensamento;
          document.getElementById("oracao").value = data.oracao;
        });
      }
      else {
        response.json().then(function (data) {
          trata_mensagem_erro(data);
        });
      }
    })
    .catch((error) => {
      alert("Ocorreu um erro inesperado ao recupera item \nMotivo : " + error.message + 
        "\n\nEsta pagina tem uma dependencia  com uma API."+
        "\nPor favor verifique se API está disponivel."+
        "\nPara maiores informações acesse:\n"+
        "https://github.com/mrbol/mvp-api");

      console.log('Error:', error.message);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  debugger;
  let span = document.createElement("span");
  let txt = document.createTextNode("Excluir");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

const insertButtonAlterar = (parent) => {
  debugger;
  let span = document.createElement("span");
  let txt = document.createTextNode("Alterar");
  span.className = "update";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    debugger;
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        deleteItem(nomeItem, div);
      }
    }
  }
}

const AtualizaElement = () => {
  debugger
  let update = document.getElementsByClassName("update");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < update.length; i++) {
    debugger;
    update[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      get(nomeItem);
      window.location = "#nova-mensagem"
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item, div) => {
  debugger
  console.log(item)
  let url = 'http://127.0.0.1:5000/devocional?devocional_id=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          $('tr[id=' + div.id + ']').remove();
        });
      }
      else {
        response.json().then(function (data) {
          trata_mensagem_erro(data);
        });
      }
    })
    .catch((error) => {
      alert("Ocorreu um erro inesperado ao recupera item \nMotivo : " + error.message + 
        "\n\nEsta pagina tem uma dependencia  com uma API."+
        "\nPor favor verifique se API está disponivel."+
        "\nPara maiores informações acesse:\n"+
        "https://github.com/mrbol/mvp-api");

      console.log('Error:', error.message);
    });
  limpar_campo();
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputProduct, inputQuantity, inputPrice)
    postItem(inputProduct, inputQuantity, inputPrice)
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (id, referencia, versiculo, pensamento, oracao) => {

  //emove <TR> existente
  $('tr[id=' + id + ']').remove();

  //recupera elemento tabela e cria uma nova linha
  var item = [id, referencia, versiculo, pensamento, oracao]
  var table = document.getElementById('tb-devocional');
  var row = table.insertRow();
  //atribui um id para linha nova
  row.setAttribute("id", id);

  //criando as colunas
  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }

  //criar os botões para excluir e alterar
  insertButton(row.insertCell(-1))
  insertButtonAlterar(row.insertCell(-1))

  //associa o evento de excluir e alterar
  removeElement();
  AtualizaElement();

  //limpar as caixas de textos
  limpar_campo();
}

$('#btn-registrar').on('click', function () {
  //recupera os valores do formulario
  let id = $('#id').val();
  //recupera os valores
  let referencia = $('#referencia').val();
  let versiculo = $('#versiculo').val();
  let pensamento = $('#pensamento').val();
  let oracao = $('#oracao').val();

  if (valida_campos()) {

    //ativa a tela de aguarde
    $('#divCarregando').show();

    //prepara os valores para serem enviados
    const formData = new FormData();
    if (id > 0) {
      formData.append('id', id);
    }
    formData.append('referencia', referencia);
    formData.append('versiculo', versiculo);
    formData.append('pensamento', pensamento);
    formData.append('oracao', oracao);

    //enviando
    let url = 'http://127.0.0.1:5000/devocional';
    fetch(url, {
      method: 'post',
      body: formData
    })
      .then(function (response) {
        $('#divCarregando').hide();
        if (response.ok) {
          response.json().then(function (data) {
            insertList(data.id, referencia, versiculo, pensamento, oracao);
            window.location = "#gerenciar";
            alert("Operação realizada");
          });
        }
        else {
          response.json().then(function (data) {
            trata_mensagem_erro(data);
          });
        }
      })
      .catch((error) => {
        $('#divCarregando').hide();
        alert("Ocorreu um erro inesperado ao recupera item \nMotivo : " + error.message + 
        "\n\nEsta pagina tem uma dependencia  com uma API."+
        "\nPor favor verifique se API está disponivel."+
        "\nPara maiores informações acesse:\n"+
        "https://github.com/mrbol/mvp-api");

        console.log('Error:', error.message);
      });
  }
});

// trata a mensagem de retorno da api
function trata_mensagem_erro(data) {
  debugger;
  try {
    if (data.mesage != undefined) {
      texto_mensagem_erro = data.mesage;
    }
    else {
      data.forEach(item => retorna_mensagem_erro(item.loc[0], item.msg, item.type));
    }
  } catch (error) {
    texto_mensagem_erro = "Ocorreu um erro inesperado";
  }
  alert(texto_mensagem_erro);
}

function retorna_mensagem_erro(campo, mensagem, tipo) {
  texto_mensagem_erro = texto_mensagem_erro + " \n " + campo + " - " + mensagem + " - " + tipo;
}

// verifica se os campos foram preenchidos
function valida_campos() {
  retorno = true;

  let referencia = $('#referencia').val();
  let versiculo = $('#versiculo').val();
  let pensamento = $('#pensamento').val();
  let oracao = $('#oracao').val();

  let cabecalhoMensagem = "Atenção para mensagem abaixo\n";
  let corpoMensagem = "";

  if (referencia == "") {
    corpoMensagem = corpoMensagem + "\n" + retorna_mensagem("Referencia");
    $('#referencia').focus();
    retorno = false;
  }

  if (versiculo == "") {
    corpoMensagem = corpoMensagem + "\n" + retorna_mensagem("Versiculo");
    $('#versiculo').focus();
    retorno = false;
  }

  if (pensamento == "") {
    corpoMensagem = corpoMensagem + "\n" + retorna_mensagem("Pensamento");
    $('#pensamento').focus();
    retorno = false;
  }

  if (oracao == "") {
    corpoMensagem = corpoMensagem + "\n" + retorna_mensagem("Oracao");
    $('#oracao').focus();
    retorno = false;
  }

  if (!retorno) {
    alert(cabecalhoMensagem + corpoMensagem);
  }

  return retorno;
}

function retorna_mensagem(campo) {
  $('#divCarregando').hide();
  return corpoMensagem = " - O campo " + campo + " não foi informado";
}

//ocultar elementos
$('.logo img').hide();
$('divCarregando').hide();

//limpa os campos para novo registro
$('a[href*=nova]').on('click', function () {
  limpar_campo();
})

function limpar_campo() {
  document.getElementById("id").value = "";
  document.getElementById("referencia").value = "";
  document.getElementById("versiculo").value = "";
  document.getElementById("pensamento").value = "";
  document.getElementById("oracao").value = "";
}

//mostra modal de aviso
function mostra_modal_aviso(mensagem){
  //$('#modal-aviso').find('modal-body p').html(mensagem);
//  $('#modal-aviso').modal('show');
}
