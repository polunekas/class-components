var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const fetchPokemonData = (searchItem) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://pokeapi.co/api/v2/pokemon/${searchItem.toLowerCase()}`);
    if (!response.ok) {
        throw new Error('No pokemon found');
    }
    const data = yield response.json();
    return data;
});
export const fetchPokemonsList = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (offset = 0, limit = 20) {
    const response = yield fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    if (!response.ok) {
        throw new Error('No pokemon found');
    }
    const data = yield response.json();
    return { results: data.results, count: data.count };
});
