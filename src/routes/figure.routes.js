import express from 'express';
import figureControllers from '../controllers/figure.controllers.js';

const router = express.Router();

router.get('/', figureControllers.getFigures);

router.get('/details/:slug', figureControllers.getDetail);

// router.delete('', figureControllers.delete);

export default router;
