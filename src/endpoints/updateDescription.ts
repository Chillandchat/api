import { NextFunction, Request, Response } from "express";

const updateDescription = async (req:Request, res: Response, _next:NextFunction):Promise<void> =>{
      if (req.query.key !== String(process.env.KEY)) {
        res.status(401).send("Invalid api key.");
        return;
      }
      
}

export default updateDescription;