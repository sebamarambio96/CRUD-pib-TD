const express = require('express')
const app = express()
const cors = require('cors')
const { Pool, Client } = require('pg')
const Cursor = require('pg-cursor')
let cursor = null

app.use(cors())
const host = 'localhost'

app.use(express.static('public'))
const pool = new Pool({
    user: 'postgres',
    host: host,
    database: 'evaluacion final 7',
    password: 'cerezasazules98',
    port: 5432
})

const client = new Client({
    user: 'postgres',
    host: host,
    database: 'evaluacion final 7',
    password: 'cerezasazules98'
})

app.get('/', (req, res) => {
    res.sendFile('/public/index.html')
})

const leerConCursor = async (req, res) => {
    const numero = req.params.cursor
    const cliente = await pool.connect()
    const sql = "SELECT paises.nombre, pib.pib_2019, pib.pib_2020, paises.continente, paises.poblacion FROM paises_pib as pib, paises as paises"
    if (cursor == null) {
        cursor = cliente.query(new Cursor(sql))
    }
    cursor.read(numero, (err, rows) => {
        console.log(rows)
        res.statusCode = 200
        res.send(JSON.stringify(rows))
    })
}

app.get('/:cursor', leerConCursor)

app.post('/add/:country/:continent/:population/:pib2019/:pib2020/', async (req, res) => {
    //http://localhost:3000/add/chilito/suramerica/19000000/50000/100000 ejemplo
    const newCountryPIB = {
        text: "INSERT INTO paises_pib (nombre,pib_2019,pib_2020) VALUES ($1::text, $2::integer, $3::integer)",
        values: [req.params.country, parseInt(req.params.pib2019), parseInt(req.params.pib2020)]
    }
    const newCountry = {
        text: "INSERT INTO paises (nombre,continente,poblacion) VALUES ($1::text, $2::text, $3::integer)",
        values: [req.params.country, req.params.continent, parseInt(req.params.population)]
    }
    const dataWeb = {
        text: "INSERT INTO paises_data_web (nombre_pais,accion) VALUES ($1::text, 1)",
        values: [req.params.country]
    }
    await client.connect()
    client.query('BEGIN')
    try {
        await client.query(newCountry)
        await client.query(newCountryPIB)
        await client.query(dataWeb)
        client.query('COMMIT')

        res.send('Datos agregados')
    } catch (error) {
        client.query('ROLLBACK')
        return res.status(500).json({ message: error.message })
    }
})

app.delete('/:nombre', async (req, res) => {
    //http://localhost:3000/chilito 
    const deleteCountryPIB = {
        text: "delete from paises_pib where nombre=$1",
        values: [req.params.nombre]
    }
    const deleteCountry = {
        text: "delete from paises where nombre=$1",
        values: [req.params.nombre]
    }
    const dataWeb = {
        text: "INSERT INTO paises_data_web (nombre_pais,accion) VALUES ($1::text, 0)",
        values: [req.params.nombre]
    }
    await client.connect()
    await client.query('BEGIN')
    try {
        await client.query(deleteCountryPIB)
        await client.query(deleteCountry)
        await client.query(dataWeb)
        await res.send('Datos eliminados')
        await client.query('COMMIT',)
    } catch (error) {
        await client.query('ROLLBACK')
        return res.status(500).json({ message: error.message })
    }
})


app.listen(3000)
console.log(`Server on port 3000`)