import {Request, Response, Router} from "express"
import {validateToken} from '../middleware/validateToken'

const router: Router = Router()

router.get("/private", validateToken, async (req: Request, res: Response) => {
    res.status(200).json({message: "This is protected secure route!"})
})

export default router