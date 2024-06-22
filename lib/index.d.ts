interface Message {
    id: number;
    author: string | null;
    content: string;
    parent: number | null;
    order: number;
}
declare function parseCosense(text: string): Message[];
declare function convertCosenseToJson(input: string): string;
export { parseCosense, convertCosenseToJson };
