
import newsService from '../../services/news.service';
import { Request, Response, NextFunction } from "express";

export class Controller {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
          const docs = await newsService.getAll();
            return res.json({ok: true, docs});

        } catch (err) {
          return res.json({ok:false, msg: err});
        }
      }
    async delete(req: Request, res: Response, next: NextFunction){
      const name: string = req.body.name;
      const tag: string = req.body.tag;
      try{
        const ok = await newsService.delete(name, tag);
        return res.status(200).json({ok, msg: "Deleted"});
      }catch(err) {
        return res.json({ok:false, msg: err});
      }
    }
}

export default new Controller();