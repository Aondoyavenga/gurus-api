import { GLOBAL } from "./index.js";

GLOBAL.mongoose.set('strictQuery', false)
export const databaseConnection = async () => {
    try {
       
        GLOBAL.mongoose.connect(`mongodb+srv://admin:RaCYnpIDNDbnr2Q7@ikapos.5urmfnl.mongodb.net`);
    } catch (error) {
        console.log('Error ============');
    }
};
