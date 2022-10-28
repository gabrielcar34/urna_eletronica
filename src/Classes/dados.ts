type FotoType = {
    url: string,
    legenda: string,
    small?: boolean
};


export type CandidatoDado = {
    numero: string,
    nome: string,
    partido: string,
    vice?: string,
    fotos: FotoType[]
};


export type Candidato = {
    titulo: string,
    numeros: number,
    candidatos: CandidatoDado[]
}


export const dados: Candidato[] = [
    {
        titulo: 'VEREADOR',
        numeros: 5,
        candidatos: [
            {
                numero: '38111',
                nome: 'Fulano de Tal',
                partido: 'ABC',
                fotos:[
                    {url:'38111.jpg', legenda: 'Vereador'}
                ]
            },
            {
                numero: '77222',
                nome: 'Beltrano da Silva',
                partido: 'DEFG',
                fotos:[
                    {url:'77222.jpg', legenda: 'Vereador'}
                ]
            },
        ]
    },
    {
        titulo: 'PREFEITO',
        numeros: 2,
        candidatos: [
            {
                numero: '99',
                nome: 'Ciclano',
                partido: 'ABC',
                vice: 'Cic',
                fotos:[
                    {url:'99.jpg', legenda: 'Prefeito'},
                    {url:'99_2.jpg', legenda: 'Vice-Prefeito', small: true}
                ]
            },
            {
                numero: '84',
                nome: 'Zulano',
                partido: 'QWERTY',
                vice: 'Zul',
                fotos:[
                    {url:'84.jpg', legenda: 'Prefeito'},
                    {url:'84_2.jpg', legenda: 'Vice-Prefeito', small: true}
                ]
            },
        ]
    }
];