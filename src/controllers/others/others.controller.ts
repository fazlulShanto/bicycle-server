import { SubpartModel } from "../../models/subpart/subpart.model";
import ytSearch from "../../utilities/yt.search.service";
import { Request, Response, NextFunction } from "express";


export const YoutubeSearch = async (req: Request, res: Response) => {
    const { search } = req.body;

    const defaultResult =[ {
        "id": "O3mzPQnyyOU",
        "original_title": "ALL-IN-ONE Bike Maintenance Tutorial. How To Service A Bicycle.",
        "title": "ALL-IN-ONE Bike Maintenance Tutorial. How To Service A Bicycle.",
        "artist": "",
        "duration": 19,
        "publishedAt": "2023-01-29T06:08:26.902Z"
    }]
    let finalSearch = search;


    if (Array.isArray(search) && search.length) {
        finalSearch = search.join(' & ');
    }
    else {
        return res.json( defaultResult);
    }
    try {
        const result = await ytSearch(finalSearch);
        return res.json(result);
    } catch (error) {
        return res.json( defaultResult);
    }
};


export const getPartsCategories = async(req : Request,res : Response)=>{

    try {

        const catList = await SubpartModel.find({}).exec();
        const result = catList.map(v => v.category);
        const uniqueCatList = new Set(result);
        return res.json(Array.from(uniqueCatList));
                
    } catch (error) {
        return res.status(500).send("Failed to find anything");
    }

}
export const getSubPartsCategories = async (req : Request,res : Response)=>{

}