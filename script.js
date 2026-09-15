//
// FASE 1: Modelagem dos dados (Classe Base)
//
class Produto {
    #preco;
    #quantidade;

    constructor(nome, preco, quantidade) {
        if (nome.trim() === "") {
            throw new Error("O nome do produto não pode ficar vazio.");
        }
        if (parseFloat(preco) <= 0) {
            throw new Error("O preço deve ser maior que zero.");
        }
        if (parseInt(quantidade) <= 0) {
            throw new Error("A quantidade deve ser maior que zero.");
        }

        this.nome = nome;
        this.#preco = parseFloat(preco);
        this.#quantidade = parseInt(quantidade);
    }

    get preco() {
        return this.#preco;
    }

    get quantidade() {
        return this.#quantidade;
    }

    calcularSubtotal() {
        return this.#preco * this.#quantidade;
    }
}

//
// FASE 2: Gerenciamento de Estado (memória)
//
const listaDeProdutos = [];

//
// FASE 3: Escuta de Eventos do DOM
//
const formProduto = document.getElementById("produto-form");

formProduto.addEventListener("submit", function(event) {
    event.preventDefault();

    const nomeInput = document.getElementById("nome").value;
    const precoInput = document.getElementById("preco").value;
    const quantidadeInput = document.getElementById("quantidade").value;

    try {
        const novoProduto = new Produto(nomeInput, precoInput, quantidadeInput);
        listaDeProdutos.push(novoProduto);
        
        renderizarTabela();
        atualizarTotalEstoque(); // ATUALIZA O TOTAL APÓS ADICIONAR
        formProduto.reset();
        } 
        catch (error) {
            alert(error.message);
            }
    });

//
// FASE 4: Renderização da Interface DOM
//
function renderizarTabela() {
    const tabelaBody = document.querySelector("#tabela-produtos tbody");
    tabelaBody.innerHTML = "";

    // Adicionamos o 'index' para saber qual a posição exata do produto no array
    listaDeProdutos.forEach((produto, index) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.calcularSubtotal().toFixed(2)}</td>
            <td>
                
            <!-- Chama a função passando a posição (index) do item -->

                <button class="btn-remover" onclick="removerProduto(${index})">Remover</button>
            </td>
        `;

        tabelaBody.appendChild(linha);
    });
}

//
// DESAFIO 2: Indicadores Financeiros do Estoque
//
function atualizarTotalEstoque() {
    // reduce percorre o array somando o subtotal de cada produto no 'acumulador'
    const total = listaDeProdutos.reduce((acumulador, produto) => {
        return acumulador + produto.calcularSubtotal();
    }, 0);

    // Seleciona o h3 e atualiza formatando como moeda (R$ XX,XX)
    const h3Total = document.getElementById("total-estoque");
    if (h3Total) {
        // toLocaleString formata o número automaticamente para o padrão de dinheiro do Brasil
        h3Total.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
}

//
// DESAFIO 3: Gestão Dinâmica (Remoção Individual e Limpeza Total)
//
function removerProduto(index) {
    // splice corta o array no índice passado, removendo 1 elemento
    listaDeProdutos.splice(index, 1);
    
    // Atualiza a tela após remover
    renderizarTabela();
    atualizarTotalEstoque();
}

// Configura o botão de limpar a tabela inteira
const btnLimparTabela = document.getElementById("limpar-tabela");

if (btnLimparTabela) { // Verifica se o botão existe no HTML para evitar erros
    btnLimparTabela.addEventListener("click", function() {
        // Zera o array de produtos de uma vez
        listaDeProdutos.length = 0;
        
        // Atualiza a tela após limpar
        renderizarTabela();
        atualizarTotalEstoque();
    });
}