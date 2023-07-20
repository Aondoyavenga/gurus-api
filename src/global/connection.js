import { GLOBAL } from "./index.js";

GLOBAL.mongoose.set('strictQuery', false)
export const databaseConnection = async () => {
    try {
       
        GLOBAL.mongoose.connect(`mongodb+srv://peteraondoyavenga:iWnJtsgL0kv9ufzb@gurudb.zlkt3vm.mongodb.net/?retryWrites=true&w=majority`);
    } catch (error) {
        console.log('Error ============');
    }
};
