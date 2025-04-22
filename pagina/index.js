var tarefasTodas = [];
var listaTarefasAtual = [];
let draggedIndex = null;


function mostrarTarefas(listaDeTarefas) {
    const listaTarefas = document.getElementById("listaTarefas");
    listaTarefas.innerHTML = "";

    listaDeTarefas.forEach((tarefa, index) => {
        const tarefaId = `${index + 1}`;

        const conteudoTarefa = document.createElement("li");
        const subTarefa = document.createElement("ul");

        conteudoTarefa.setAttribute("draggable", "true");
        conteudoTarefa.dataset.index = index;
        conteudoTarefa.addEventListener("dragstart", handleDragStart);
        conteudoTarefa.addEventListener("dragover", handleDragOver);
        conteudoTarefa.addEventListener("drop", handleDrop);
        conteudoTarefa.addEventListener("dragend", handleDragEnd);


        const statusBtn = document.createElement("input");
        statusBtn.type = "button";
        statusBtn.id = "status-tarefa";
        statusBtn.value = tarefa.status === "concluido" ? "✅" : "❌";
        statusBtn.addEventListener("click", () => {
            tarefa.status = tarefa.status === "concluido" ? "pendente" : "concluido";
            statusBtn.value = tarefa.status === "concluido" ? "✅" : "❌";
            verificarTarefasMostrar()
        });

        const tituloSpan = document.createElement("span");
        const dataSpan = document.createElement("span");
        const descricaoSpan = document.createElement("span");
        const addSubBtn = document.createElement("img");
        const excluirTarefaBtn = document.createElement("img");
        const header = document.createElement("div");
        const descricaoContainer = document.createElement("div");
        const conteudo = document.createElement("div");

        tituloSpan.id = "titulo-tarefa";
        dataSpan.id = "data-tarefa";
        descricaoSpan.id = "descricao-tarefa";
        header.id = "header-tarefa";
        descricaoContainer.id = "descricao-tarefa-container";
        conteudo.id = "conteudo-container";
        
        tituloSpan.textContent = tarefa.titulo;
        dataSpan.textContent = formatarData(tarefa.dataDeEntrega);
        descricaoSpan.textContent = tarefa.descricao;
        
        addSubBtn.src = "../midia/mais.png";
        addSubBtn.id = "btnAbrirTabAddTarefa";
        addSubBtn.dataset.id = tarefaId;
        addSubBtn.addEventListener("click", () => abrirTabAddTarefa(tarefaId));
        
        excluirTarefaBtn.src = "../midia/lixo.png";
        excluirTarefaBtn.id = "btnExcluirTarefa";
        excluirTarefaBtn.dataset.id = tarefaId;
        excluirTarefaBtn.addEventListener("click", () => excluirTarefa(tarefaId));

        conteudoTarefa.className = verificarAtraso(tarefa.dataDeEntrega, tarefa.status === "concluido" ? true : false)
        
        header.appendChild(statusBtn);
        header.appendChild(tituloSpan);
        header.appendChild(dataSpan);

        descricaoContainer.appendChild(descricaoSpan);
        
        conteudo.appendChild(header);
        conteudo.appendChild(descricaoSpan);

        conteudoTarefa.appendChild(conteudo);
        conteudoTarefa.appendChild(addSubBtn);
        conteudoTarefa.appendChild(excluirTarefaBtn);

        listaTarefas.appendChild(conteudoTarefa);

        if (tarefa.subTarefas.length > 0) {
            tarefa.subTarefas.forEach((sub, subIndex) => {
                const subTarefaID = `${tarefaId}.${subIndex + 1}`;
                const conteudoSubTarefa = document.createElement("li");

                const subStatusBtn = document.createElement("input");
                subStatusBtn.type = "button";
                subStatusBtn.id = "status-tarefa";
                subStatusBtn.value = sub.status === "concluido" ? "✅" : "❌";
                subStatusBtn.addEventListener("click", () => {
                    sub.status = sub.status === "concluido" ? "pendente" : "concluido";
                    subStatusBtn.value = sub.status === "concluido" ? "✅" : "❌";
                    verificarTarefasMostrar()
                });


                const subTituloSpan = document.createElement("span");
                const subDataSpan = document.createElement("span");
                const subDescricaoSpan = document.createElement("span");
                const excluirSubBtn = document.createElement("img");
                const subHeader = document.createElement("div");
                const descricaoSubContainer = document.createElement("div");
                const conteudoSub = document.createElement("div");

                subTituloSpan.id = "titulo-tarefa";
                subDataSpan.id = "data-tarefa";
                subDescricaoSpan.id = "descricao-tarefa";
                descricaoSubContainer.id = "descricao-tarefa-container";
                conteudoSub.id = "conteudo-container";
                subHeader.id = "header-tarefa";
                
                subTituloSpan.textContent = sub.titulo;
                subDataSpan.textContent = formatarData(sub.dataDeEntrega);
                subDescricaoSpan.textContent = sub.descricao;

                excluirSubBtn.src = "../midia/lixo.png";
                excluirSubBtn.id = "btnExcluirTarefa";
                excluirSubBtn.dataset.id = subTarefaID;
                excluirSubBtn.addEventListener("click", () => excluirSubTarefa(subTarefaID));


                subHeader.appendChild(subStatusBtn);
                subHeader.appendChild(subTituloSpan);
                subHeader.appendChild(subDataSpan);

                descricaoSubContainer.appendChild(subDescricaoSpan);
        
                conteudoSub.appendChild(subHeader);
                conteudoSub.appendChild(descricaoSubContainer);
                
                conteudoSubTarefa.appendChild(conteudoSub);
                conteudoSubTarefa.appendChild(excluirSubBtn);

                subTarefa.appendChild(conteudoSubTarefa);
            });

            listaTarefas.appendChild(subTarefa);
        }

        console.log(listaTarefas)
    });
};

function handleDragStart(e) {
    draggedIndex = parseInt(this.dataset.index);
    this.style.opacity = "0.5";
}

function handleDragOver(e) {
    e.preventDefault();
    this.style.border = "2px dashed #999";
}

function handleDrop(e) {
    e.preventDefault();
    const targetIndex = parseInt(this.dataset.index);

    if (draggedIndex === targetIndex) return;

    const tarefaArrastada = tarefasTodas.splice(draggedIndex, 1)[0];
    tarefasTodas.splice(targetIndex, 0, tarefaArrastada);

    listaTarefasAtual = tarefasTodas;
    verificarTarefasMostrar(tarefasTodas);
}

function handleDragEnd(e) {
    this.style.opacity = "1";
    this.style.border = "none";
}

function verificarAtraso(data, pular = false){
    const dataAtual = dataFormatISO(new Date(Date.now()));

    if (pular) {
        return "normal";
    }

    return data < dataAtual ? "pendente" : "normal";
}

function dataFormatISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    
    return `${ano}-${mes}-${dia}`;
  }

function formatarData(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
};

function verificarTarefasMostrar(listaFiltrar = tarefasTodas){
    var pendente = document.getElementById("ckbPendentes")
    var concluido = document.getElementById("ckbConcluidos")

    console.log(pendente.checked)
    console.log(concluido.checked)

    var listaDePendentes = listaFiltrar.filter(tarefa => tarefa.status == "pendente");
    var listaDeConluidos = listaFiltrar.filter(tarefa => tarefa.status == "concluido");

    console.log(listaDePendentes.length)
    console.log(listaDeConluidos.length)

    document.getElementById("numPendentes").textContent = listaDePendentes.length
    document.getElementById("numConcluidos").textContent = listaDeConluidos.length

    if (pendente.checked && !concluido.checked){
        console.log("entrei no if do pendente")
        mostrarTarefas(listaDePendentes)
    } else {
        if (!pendente.checked && concluido.checked){
            console.log("entrei no if do concluido")
            mostrarTarefas(listaDeConluidos)
        } else {
            console.log("entrei no else")
            mostrarTarefas(listaFiltrar)
        }
    }
};

function buscar(){
    var busca = document.getElementById("txtBusca").value;
    
    if (busca != ""){
        var listaBusca = tarefasTodas.filter(tarefa => tarefa.titulo == busca);
        listaTarefasAtual = listaBusca;
        verificarTarefasMostrar(listaBusca);
    } else {
        listaTarefasAtual = tarefasTodas;
        verificarTarefasMostrar(tarefasTodas);
    }
};

function excluirTarefa(tarefaId) {
    var index = parseInt(tarefaId) - 1;
  
    if (tarefasTodas[index]) {
        document.getElementById("aside").style.visibility = "hidden";
        tarefasTodas.splice(index, 1);
        verificarTarefasMostrar(listaTarefasAtual);
    }
};

function excluirSubTarefa(subTarefaId) {
    var [tarefaIndex, subIndex] = subTarefaId.split('.').map(Number);
  
    if (tarefasTodas[tarefaIndex - 1] && tarefasTodas[tarefaIndex - 1].subTarefas[subIndex - 1]) {
        document.getElementById("aside").style.visibility = "hidden";
        tarefasTodas[tarefaIndex - 1].subTarefas.splice(subIndex - 1, 1);
        verificarTarefasMostrar(listaTarefasAtual);
    }
};

var endereço = "";
function abrirTabAddTarefa() {
    document.getElementById("aside").style.visibility = "visible";

    endereço = "";
};

function abrirTabAddTarefa(tarefaID) {
    const titulo = document.getElementById("txtTitulo");
    const descricao = document.getElementById("txtDescricao");
    const dataDeEntrega = document.getElementById("txtData");
    
    titulo.value = "";
    descricao.value = "";
    dataDeEntrega.value = "";

    document.getElementById("aside").style.visibility = "visible";

    endereço = tarefaID;
};

function addTarefa() {
    const titulo = document.getElementById("txtTitulo");
    const descricao = document.getElementById("txtDescricao");
    const dataDeEntrega = document.getElementById("txtData");
    
    criarTarefa(titulo.value, descricao.value, dataDeEntrega.value, endereço);
    
    titulo.value = "";
    descricao.value = "";
    dataDeEntrega.value = "";

    document.getElementById("aside").style.visibility = "hidden";
    
    listaTarefasAtual = tarefasTodas
    verificarTarefasMostrar(tarefasTodas);
};

function cancelar(){
    const titulo = document.getElementById("txtTitulo");
    const descricao = document.getElementById("txtDescricao");
    const dataDeEntrega = document.getElementById("txtData");
    
    titulo.value = "";
    descricao.value = "";
    dataDeEntrega.value = "";

    document.getElementById("aside").style.visibility = "hidden";
}

function criarTarefa(titulo, descricao, dataDeEntrega, tarefaId = ""){
    var status = "pendente";
    var subtarefas = [];
    
    if (dataDeEntrega == ""){
        dataDeEntrega = dataFormatISO(new Date(Date.now()));
    }

    var tarefa = {
        "id": "",
        "titulo": titulo,
        "descricao": descricao,
        "status": status,
        "dataDeEntrega": dataDeEntrega,
        "subTarefas": subtarefas
    };

    if (tarefaId != ""){
        var id = parseInt(tarefaId) - 1;
    
        if (tarefasTodas[id]){
            tarefasTodas[id].subTarefas.push(tarefa);
        }

    } else {
        tarefasTodas.push(tarefa);
    }

    console.log(tarefasTodas);
};