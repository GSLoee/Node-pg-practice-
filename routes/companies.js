const express = require('express');
const router = express.Router();
const db = require('../db'); 
const ExpressError = require('../expressError')

router.get('/', async (req, res, next) => {
    try{
    const results = await db.query(`SELECT code, name FROM companies`)
    return res.json({companies: results.rows})
    } catch (e){
        return next(e)
    }
})

router.get('/:code', async (req, res, next) => {
    try{
    const { code } = req.params
    const results = await db.query('SELECT * FROM companies WHERE code=$1', [code])
    if (results.rows.length === 0){
        throw new ExpressError(`code: ${code} does not exits`, 404)
    }
    return res.json({companies: results.rows})
    } catch (e){
        return next(e)
    }
})

router.post('/', async (req, res, next) => {
    try{
        const { name, description} = req.body
        const {code} = req.params
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description])
        return res.status(201).json({companies: results.rows[0]})
    } catch (e){
        return next(e)
    }
})

router.put('/:code', async (req, res, next) =>{
    try{
        const { name, description } = req.body
        const {code} = req.params
        const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`, [name, description, code])
        if (res.json.length === 0){
            throw new ExpressError(`Company ${code} does not exist`, 404)
        } else {
            return res.json({"companies": results.row[0]})
        }
    } catch (e){
        return next(e)
    }
})

router.delete('/:code', async (req, res, next) =>{
    try{
        const {code} = req.params
        const result = await db.query(`DELETE FROM companies WHERE code=$1 RETURNING code`, [code])

        if (result.rows.length === 0){
            throw new ExpressError(`No compies ${code} exist`)
        } else {
            return res.json({"status": "Deleted"})
        }
    } catch (e){
        return next(e)
    }
})

module.exports = router