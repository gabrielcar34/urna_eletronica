import { dados } from "./Classes/dados.js";
class Urna {
    constructor() {
        this.bts = document.querySelectorAll('[class=botao]');
        this.btConfirmar = document.querySelector(".botao-confirmar");
        this.btCorrigir = document.querySelector(".botao-corrige");
        this.btBranco = document.querySelector(".botao-branco");
        Urna.etapa_digitos = Urna.obter_quantidade_digitos();
        Urna.exibe_campos_digito();
        this.bts.forEach((bt) => bt.addEventListener('click', this.clicou_botao));
        this.btBranco.addEventListener('click', this.clicou_branco);
        this.btCorrigir.addEventListener('click', this.clicou_corrigir);
        this.btConfirmar.addEventListener('click', this.clicou_confirmar);
    }
    static exibe_campos_digito() {
        let campoNumero = document.createElement("div");
        campoNumero.classList.add("numero", "numero-opacidade", "numero-padding-normal");
        const numeros = document.querySelector(".numeros");
        for (let i = 1; i <= Urna.etapa_digitos; i++) {
            numeros.appendChild(campoNumero);
            campoNumero = document.createElement("div");
            campoNumero.classList.add("numero", "numero-padding-normal");
        }
    }
    clicou_botao(event) {
        if (Urna.votoEncerrado)
            return;
        const bt = event.target;
        const numero = bt.textContent;
        if (Urna.digitos.length < Urna.etapa_digitos) {
            Urna.exibe_numero_tela(numero);
            Urna.digitos += bt.textContent;
        }
        Urna.proxima_etapa();
    }
    static exibe_numero_tela(numero) {
        const campos = document.querySelectorAll(".numeros > div");
        for (let i = 0; i <= Urna.campoAtual; i++) {
            campos[i].classList.remove("numero-opacidade", "numero-padding-normal");
        }
        campos[Urna.campoAtual].classList.add("numero-padding");
        campos[Urna.campoAtual++].textContent = numero;
        if (Urna.campoAtual >= campos.length)
            return;
        campos[Urna.campoAtual].classList.add("numero-opacidade", "numero-padding");
    }
    static obter_quantidade_digitos() {
        return dados[Urna.etapa].numeros;
    }
    clicou_branco(event) {
        var _a;
        if (Urna.votoEncerrado)
            return;
        document.querySelectorAll(".visualizar").forEach((elemento) => elemento.classList.remove("visualizar"));
        // Area título da etapa e nome
        document.querySelector(".informacao-1 .titulo").classList.add("visualizar");
        document.querySelector(".informacao-1 .nome").textContent = dados[Urna.etapa].titulo;
        // Area de exibição de voto nulo ou branco
        const areaNaoEncontrado = document.querySelector(".numero-nao-encontrado");
        areaNaoEncontrado === null || areaNaoEncontrado === void 0 ? void 0 : areaNaoEncontrado.classList.add("visualizar");
        const mensagem = areaNaoEncontrado.querySelector("h1");
        mensagem.textContent = "VOTO EM BRANCO";
        mensagem.style.cssText = `
            font-size: 35px;
            text-align: center;
        `;
        // Area de exibição de números
        (_a = document.querySelector(".numeros")) === null || _a === void 0 ? void 0 : _a.classList.add("oculto");
        // Area instruções
        document.querySelector(".instrucoes").classList.add("visualizar");
        Urna.votoNulo = true;
    }
    clicou_corrigir(event) {
        var _a;
        if (Urna.votoEncerrado)
            return;
        document.querySelectorAll(".visualizar").forEach((elemento) => elemento.classList.remove("visualizar"));
        (_a = document.querySelector(".numeros")) === null || _a === void 0 ? void 0 : _a.classList.remove("oculto");
        document.querySelectorAll(".numeros > div").forEach((elemento) => elemento.remove());
        Urna.digitos = '';
        Urna.campoAtual = 0;
        Urna.votoNulo = false;
        Urna.exibe_campos_digito();
    }
    clicou_confirmar(event) {
        var _a;
        if (!(Urna.digitos.length >= Urna.etapa_digitos || Urna.votoNulo))
            return;
        if (Urna.votoEncerrado)
            return;
        if (Urna.etapa >= dados.length - 1) {
            Urna.votoEncerrado = true;
            const audio = new Audio("./src/audios/som_urna.wav");
            audio.currentTime = 3.2;
            audio.play();
            Urna.exibe_mensagem_fechamento();
            return;
        }
        document.querySelectorAll(".visualizar").forEach((elemento) => elemento.classList.remove("visualizar"));
        (_a = document.querySelector(".numeros")) === null || _a === void 0 ? void 0 : _a.classList.remove("oculto");
        document.querySelectorAll(".numeros > div").forEach((elemento) => elemento.remove());
        Urna.digitos = "";
        Urna.campoAtual = 0;
        Urna.etapa++;
        Urna.votoNulo = false;
        Urna.etapa_digitos = Urna.obter_quantidade_digitos();
        Urna.atualiza_informacoes();
        Urna.exibe_campos_digito();
    }
    static retorna_candidato() {
        return dados[this.etapa].candidatos.find((candidato) => candidato.numero === Urna.digitos);
    }
    static proxima_etapa() {
        if (Urna.digitos.length <= Urna.etapa_digitos - 1)
            return;
        const candidato = this.retorna_candidato();
        if (candidato) {
            // Area título da etapa e nome
            document.querySelector(".informacao-1 .titulo").classList.add("visualizar");
            document.querySelector(".informacao-1 .nome").textContent = dados[Urna.etapa].titulo;
            // Area exibição do candidato
            const area = document.querySelector(".numero-encontrado");
            area.classList.add("visualizar");
            area.innerHTML = `
                <p class="encontrado-nome">Nome: ${candidato.nome}</p>
                <p class="encontrado-partido">Partido: ${candidato.partido}</p>
            `;
            const areaCandidato = document.querySelector(".principal");
            areaCandidato.classList.add("visualizar");
            areaCandidato.querySelector("img").src = `./src/images/${candidato.fotos[0].url}`;
            areaCandidato.querySelector("div").textContent = candidato.fotos[0].legenda;
            if (candidato.vice) {
                const areaCandidatoVice = document.querySelector(".secundario");
                areaCandidatoVice.classList.add("visualizar");
                areaCandidatoVice.querySelector("img").src = `./src/images/${candidato.fotos[1].url}`;
                areaCandidatoVice.querySelector("div").textContent = candidato.fotos[1].legenda;
            }
            // Area instruções
            document.querySelector(".instrucoes").classList.add("visualizar");
        }
        else {
            Urna.exibe_voto_nulo();
            Urna.votoNulo = true;
        }
    }
    static exibe_voto_nulo() {
        document.querySelectorAll(".visualizar").forEach((elemento) => elemento.classList.remove("visualizar"));
        // Area título da etapa e nome
        document.querySelector(".informacao-1 .titulo").classList.add("visualizar");
        document.querySelector(".informacao-1 .nome").textContent = dados[Urna.etapa].titulo;
        // Area de exibição de voto nulo
        const areaNaoEncontrado = document.querySelector(".numero-nao-encontrado");
        areaNaoEncontrado === null || areaNaoEncontrado === void 0 ? void 0 : areaNaoEncontrado.classList.add("visualizar");
        // Area instruções
        document.querySelector(".instrucoes").classList.add("visualizar");
    }
    static atualiza_informacoes() {
        document.querySelector(".informacao-1 .nome").textContent = dados[Urna.etapa].titulo;
    }
    static exibe_mensagem_fechamento() {
        // Area de exibição de voto nulo ou branco
        const areaNaoEncontrado = document.querySelector(".numero-nao-encontrado");
        areaNaoEncontrado === null || areaNaoEncontrado === void 0 ? void 0 : areaNaoEncontrado.classList.add("visualizar");
        const mensagem = areaNaoEncontrado.querySelector("h1");
        mensagem.textContent = "FIM";
        mensagem.style.cssText = `
            font-size: 60px;
            text-align: center;
        `;
        // Desabilitando títulos
        document.querySelector(".informacao-1 .titulo").classList.add("desabilitado");
        document.querySelector(".informacao-1 .nome").classList.add("desabilitado");
        // Area instruções
        document.querySelector(".instrucoes").classList.add("desabilitado");
        document.querySelector(".numero-encontrado").classList.add("oculto");
        document.querySelector(".numeros").classList.add("oculto");
        // Area candidato
        document.querySelector(".informacao-2").classList.add("oculto");
    }
}
Urna.etapa = 0;
Urna.digitos = '';
Urna.campoAtual = 0;
Urna.votoNulo = false;
Urna.votoEncerrado = false;
const urna = new Urna();
