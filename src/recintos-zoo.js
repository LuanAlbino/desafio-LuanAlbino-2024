export class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'macaco', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'gazela', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'leao', quantidade: 1 }] },
        ];

        this.animais = {
            leao: { tamanho: 3, biomas: ['savana'], carnívoro: true },
            leopardo: { tamanho: 2, biomas: ['savana'], carnívoro: true },
            crocodilo: { tamanho: 3, biomas: ['rio'], carnívoro: true },
            macaco: { tamanho: 1, biomas: ['savana', 'floresta'] },
            gazela: { tamanho: 2, biomas: ['savana'] },
            hipopotamo: { tamanho: 4, biomas: ['savana', 'rio'] },
        };
    }

    analisaRecintos(tipoAnimal, quantidade) {
        const tipoAnimalLower = tipoAnimal.toLowerCase();

        // Verifica se o animal é válido
        if (!this.animais[tipoAnimalLower]) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }

        // Verifica se a quantidade é válida
        if (quantidade <= 0 || isNaN(quantidade)) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        const animalInfo = this.animais[tipoAnimalLower];
        const recintosViaveis = [];

        this.recintos.forEach((recinto) => {
            const biomaCompativel = animalInfo.biomas.some((bioma) => recinto.bioma.includes(bioma));

            // Verifica se o recinto contém animais carnívoros
            const contemCarnivoro = recinto.animais.some((a) => this.animais[a.especie].carnívoro);

            // Exclui recintos que contém animais carnívoros se o tipo de animal é macaco
            if (animalInfo.biomas.includes('savana') && tipoAnimalLower === 'macaco' && contemCarnivoro) {
                return;
            }

            // Verifica a compatibilidade para carnívoros
            if (animalInfo.carnívoro) {
                if (tipoAnimalLower === 'crocodilo') {
                    // O crocodilo só pode estar com outros crocodilos ou em recintos vazios
                    if (recinto.animais.length > 0 && !recinto.animais.every((a) => a.especie === 'crocodilo')) {
                        return;
                    }
                } else if (tipoAnimalLower === 'leao') {
                    // O leão só pode estar com outros leões ou em recintos vazios
                    if (recinto.animais.length > 0 && !recinto.animais.every((a) => a.especie === 'leao')) {
                        return;
                    }
                } else if (tipoAnimalLower === 'leopardo') {
                    // O leopardo só pode estar com outros leopardos ou em recintos vazios
                    if (recinto.animais.length > 0 && !recinto.animais.every((a) => a.especie === 'leopardo')) {
                        return;
                    }
                } else if (recinto.animais.length > 0 && !recinto.animais.every((a) => this.animais[a.especie].carnívoro)) {
                    return;
                }
            } else if (animalInfo.biomas.includes('savana') && contemCarnivoro) {
                // Se o animal não for carnívoro e o recinto já contiver carnívoros, não é viável
                return;
            }

            const espacoOcupado = recinto.animais.reduce((total, a) => {
                const animal = this.animais[a.especie];
                if (animal) {
                    return total + animal.tamanho * a.quantidade;
                }
                return total;
            }, 0);

            const espacoExtra = recinto.animais.length > 0 && (recinto.animais[0].especie !== tipoAnimalLower || animalInfo.carnívoro) ? 1 : 0;
            const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado - espacoExtra;

            if (biomaCompativel && espacoDisponivel >= animalInfo.tamanho * quantidade) {
                recintosViaveis.push({
                    numero: recinto.numero,
                    espacoLivre: espacoDisponivel - animalInfo.tamanho * quantidade,
                    tamanhoTotal: recinto.tamanhoTotal,
                });
            }
        });

        // Verifica se há recintos viáveis
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        return {
            erro: null,
            recintosViaveis: recintosViaveis
                .sort((a, b) => a.numero - b.numero)
                .map((r) => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre}, total: ${r.tamanhoTotal})`),
        };
    }
}
