import l from "../../common/logger";
import { Deleted } from "../models/deleted";
import { New, INewsModel } from '../models/new';

export class NewsService {

    async getAll(): Promise<INewsModel[]> {
        l.info("fetch all news");
        const news: INewsModel[] = await New.find();
        return news; 
    }

    async delete(name: string, tag: string): Promise<Object> {
        l.info("Delete new");

            await New.updateMany({ [tag]: name },
                { "show" : false } );
            const newDelete = new Deleted({tag, title: name})
            await newDelete.save();
            return true
    }

}

export default new NewsService();