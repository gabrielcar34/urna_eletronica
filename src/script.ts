import { dados, CandidatoDado} from "./Classes/dados.js";

class Urna {

    private bts: NodeList = document.querySelectorAll('[class=botao]');
    private btConfirmar: HTMLButtonElement = document.querySelector(".botao-confirmar")!;
    private btCorrigir: HTMLButtonElement = document.querySelector(".botao-corrige")!;
    private btBranco: HTMLButtonElement = document.querySelector(".botao-branco")!;
    private static etapa: number = 0;
    private static etapa_digitos: number;
    private static digitos: string = '';
    private static campoAtual: number = 0;
    private static votoNulo: boolean = false;
    private static votoEncerrado: boolean = false;

    constructor(){
        Urna.etapa_digitos = Urna.obter_quantidade_digitos();
        Urna.exibe_campos_digito();
        this.bts.forEach((bt) => bt.addEventListener('click', this.clicou_botao));
        this.btBranco.addEventListener('click', this.clicou_branco);
        this.btCorrigir.addEventListener('click', this.clicou_corrigir);
        this.btConfirmar.addEventListener('click', this.clicou_confirmar);
    }

    private static exibe_campos_digito(): void {
        let campoNumero: HTMLElement = document.createElement("div");
        campoNumero.classList.add("numero", "numero-opacidade", "numero-padding-normal");
        const numeros = document.querySelector(".numeros") as HTMLElement;
        for(let i = 1 ; i <= Urna.etapa_digitos ; i++){
            numeros.appendChild(campoNumero);
            campoNumero = document.createElement("div");
            campoNumero.classList.add("numero", "numero-padding-normal");
        }
    }

    private clicou_botao(event: Event): void {
        if(Urna.votoEncerrado) return;
        const bt = event.target as HTMLElement;
        const numero: string = bt.textContent as string;

        if(Urna.digitos.length < Urna.etapa_digitos){
            Urna.exibe_numero_tela(numero);
            Urna.digitos += bt.textContent;
        }

        Urna.proxima_etapa();
    }

    private static exibe_numero_tela(numero: string): void {
        const campos = document.querySelectorAll(".numeros > div");
        for(let i = 0 ; i <= Urna.campoAtual  ; i++){
            campos[i].classList.remove("numero-opacidade", "numero-padding-normal");
        }
        campos[Urna.campoAtual].classList.add("numero-padding");
        campos[Urna.campoAtual++].textContent = numero;

        if(Urna.campoAtual >= campos.length) return;
        campos[Urna.campoAtual].classList.add("numero-opacidade", "numero-padding");
    }

    private static obter_quantidade_digitos(): number {
        return dados[Urna.etapa].numeros;
    }

    private clicou_branco(event: Event): void {
        if(Urna.votoEncerrado) return;
        document.querySelectorAll(".visualizar").forEach((elemento) => elemento.classList.remove("visualizar"));

        // Area título da etapa e nome
        document.querySelector(".informacao-1 .titulo")!.classList.add("visualizar");
        document.querySelector(".informacao-1 .nome")!.textContent = dados[Urna.etapa].titulo;

         // Area de exibição de voto nulo ou branco
         const areaNaoEncontrado = document.querySelector(".numero-nao-encontrado");
         areaNaoEncontrado?.classList.add("visualizar");
         const mensagem = areaNaoEncontrado!.querySelector("h1") as HTMLElement;
         mensagem.textContent = "VOTO EM BRANCO";
         mensagem.style.cssText = `
            font-size: 35px;
            text-align: center;
        `;

        // Area de exibição de números
        document.querySelector(".numeros")?.classList.add("oculto");

        // Area instruções
        document.querySelector(".instrucoes")!.classList.add("visualizar");
        Urna.votoNulo = true;
    }

    private clicou_corrigir(event: Event): void {
        if(Urna.votoEncerrado) return;
        document.querySelectorAll(".visualizar").forEach((elemento) => elemento.classList.remove("visualizar"));
        document.querySelector(".numeros")?.classList.remove("oculto");
        document.querySelectorAll(".numeros > div").forEach((elemento) => elemento.remove());
        Urna.digitos = '';
        Urna.campoAtual = 0;
        Urna.votoNulo = false;
        Urna.exibe_campos_digito();
    }

    private clicou_confirmar(event: Event): void {
        if(!(Urna.digitos.length >= Urna.etapa_digitos || Urna.votoNulo)) return;
        if(Urna.votoEncerrado) return;
        if(Urna.etapa >= dados.length - 1){
            Urna.votoEncerrado = true;
            const audio = new Audio("./src/audios/som_urna.wav");
            audio.currentTime = 3.2;
            audio.play();
            Urna.exibe_mensagem_fechamento();
            return;
        }
        document.querySelectorAll(".visualizar").forEach((elemento) => elemento.classList.remove("visualizar"));
        document.querySelector(".numeros")?.classList.remove("oculto");
        document.querySelectorAll(".numeros > div").forEach((elemento) => elemento.remove());
        Urna.digitos = "";
        Urna.campoAtual = 0;
        Urna.etapa++;
        Urna.votoNulo = false;
        Urna.etapa_digitos =  Urna.obter_quantidade_digitos();
        Urna.atualiza_informacoes();
        Urna.exibe_campos_digito();
    }


    private static retorna_candidato(): CandidatoDado | undefined {
        return dados[this.etapa].candidatos.find((candidato) => candidato.numero === Urna.digitos);
    }

    private static proxima_etapa(): void {
        if(Urna.digitos.length <= Urna.etapa_digitos - 1) return;
        const candidato: CandidatoDado = this.retorna_candidato() as CandidatoDado;

        if(candidato){
            // Area título da etapa e nome
            document.querySelector(".informacao-1 .titulo")!.classList.add("visualizar");
            document.querySelector(".informacao-1 .nome")!.textContent = dados[Urna.etapa].titulo;

            // Area exibição do candidato
            const area = document.querySelector(".numero-encontrado") as HTMLElement;
            area.classList.add("visualizar");
            area.innerHTML = `
                <p class="encontrado-nome">Nome: ${candidato.nome}</p>
                <p class="encontrado-partido">Partido: ${candidato.partido}</p>
            `;

            const areaCandidato = document.querySelector(".principal")!;
            areaCandidato.classList.add("visualizar");
            areaCandidato.querySelector("img")!.src = `./src/images/${candidato.fotos[0].url}`;
            areaCandidato.querySelector("div")!.textContent = candidato.fotos[0].legenda;

            if(candidato.vice){
                const areaCandidatoVice = document.querySelector(".secundario")!;
                areaCandidatoVice.classList.add("visualizar");
                areaCandidatoVice.querySelector("img")!.src = `./src/images/${candidato.fotos[1].url}`;
                areaCandidatoVice.querySelector("div")!.textContent = candidato.fotos[1].legenda;
            }
            
            // Area instruções
            document.querySelector(".instrucoes")!.classList.add("visualizar");
        }
        else{
            Urna.exibe_voto_nulo();
            Urna.votoNulo = true;
        }
    }

    private static exibe_voto_nulo(): void {
        document.querySelectorAll(".visualizar").forEach((elemento) => elemento.classList.remove("visualizar"));

       // Area título da etapa e nome
       document.querySelector(".informacao-1 .titulo")!.classList.add("visualizar");
       document.querySelector(".informacao-1 .nome")!.textContent = dados[Urna.etapa].titulo;

        // Area de exibição de voto nulo
        const areaNaoEncontrado = document.querySelector(".numero-nao-encontrado");
        areaNaoEncontrado?.classList.add("visualizar");

        // Area instruções
        document.querySelector(".instrucoes")!.classList.add("visualizar");

    }

    private static atualiza_informacoes(): void {
        document.querySelector(".informacao-1 .nome")!.textContent = dados[Urna.etapa].titulo;
    }

    private static exibe_mensagem_fechamento(): void {
         // Area de exibição de voto nulo ou branco
         const areaNaoEncontrado = document.querySelector(".numero-nao-encontrado");
         areaNaoEncontrado?.classList.add("visualizar");
         const mensagem = areaNaoEncontrado!.querySelector("h1") as HTMLElement;
         mensagem.textContent = "FIM";
         mensagem.style.cssText = `
            font-size: 60px;
            text-align: center;
        `;

        // Desabilitando títulos
        document.querySelector(".informacao-1 .titulo")!.classList.add("desabilitado");
        document.querySelector(".informacao-1 .nome")!.classList.add("desabilitado");
        // Area instruções
        document.querySelector(".instrucoes")!.classList.add("desabilitado");
        document.querySelector(".numero-encontrado")!.classList.add("oculto");
        document.querySelector(".numeros")!.classList.add("oculto");
        // Area candidato
        document.querySelector(".informacao-2")!.classList.add("oculto");
    }   

}


const urna: Urna = new Urna();




