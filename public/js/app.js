//DOM 
const datos = document.getElementById('datos')
const fragmentDatos = document.createDocumentFragment()
const templateDatos = document.getElementById('templateDatos').content
/* const templateError = document.getElementById('templateError').content */

//Retorna TODAS las mascotas
const pintarDatos = async (data) => {
    try {
        while (datos.firstChild) {
            datos.removeChild(datos.firstChild);
        }

        data.map(item => {
            let t1 = templateDatos.getElementById('1')
            let t2 = templateDatos.getElementById('2')
            let t3 = templateDatos.getElementById('3')
            let t4 = templateDatos.getElementById('4')
            let t5 = templateDatos.getElementById('5')
            t1.textContent = item.nombre
            t2.textContent = item.continente
            t3.textContent = item.pib_2019
            t4.textContent = item.pib_2020
            t5.textContent = item.poblacion

            const clone = templateDatos.cloneNode(true)
            fragmentDatos.appendChild(clone)
        })
        datos.appendChild(fragmentDatos)
    } catch (error) {
        console.log(error)
    }
}

function pintar5() {
    const btn = document.getElementById('btnRender5')
    btn.addEventListener('click', async () => {
        const response = await axios.get('http://localhost:3000/5')
        const data = response.data
        pintarDatos(data)
    })

}
pintar5()

function pintar10() {
    const btn = document.getElementById('btnRender10')
    btn.addEventListener('click', async () => {
        const response = await axios.get('http://localhost:3000/10')
        const data = response.data
        pintarDatos(data)
    })
}
pintar10()

function pintar20() {
    const btn = document.getElementById('btnRender20')
    btn.addEventListener('click', async () => {
        const response = await axios.get('http://localhost:3000/20')
        const data = response.data
        pintarDatos(data)
    })
}
pintar20()


function agregarPais() {
    const btn = document.getElementById('btnAdd')
    btn.addEventListener('click', async () => {
        const nameAdd = document.querySelector('#nameAdd').value
        const continenteAdd = document.querySelector('#continenteAdd').value
        const poblacionAdd = document.querySelector('#poblacionAdd').value
        const Add2020 = document.querySelector('#Add2020').value
        const Add2019 = document.querySelector('#Add2019').value
        //http://localhost:3000/add/chilito/suramerica/19000000/50000/100000
        const response = await axios.post(`http://localhost:3000/add/${nameAdd}/${continenteAdd}/${poblacionAdd}/${Add2019}/${Add2020}`)
        console.log(response)
    })
}
agregarPais()

function eliminarPais() {
    const btn = document.getElementById('btnDelete')
    btn.addEventListener('click', async () => {
        const name = document.querySelector('#idDelete').value
        const response = await axios.delete(`http://localhost:3000/${name}`)
        console.log(response)
    })
}
eliminarPais()
