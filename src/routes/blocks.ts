import {Router} from 'express';

import getBlocks from '../controllers/blocks/getBlocks';
import mineBlock from '../controllers/blocks/mineBlock';

const router = Router();

router.get('/', getBlocks);
router.post('/', mineBlock);

export default router;
