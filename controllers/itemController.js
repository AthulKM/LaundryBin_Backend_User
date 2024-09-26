
// ./controllers/itemController.js

import Item from '../models/item.js';

export const addItem = async (req,res) => {
    const { itemName, charge, count } = req.body;
}