window.addEventListener('load', ready)

var db = openDatabase('feiraFacil', '1.0', 'Feira Database', 2 * 1024 + 1024)

db.transaction(function(tx){
    tx.executeSql('CREATE TABLE feira ( id INTEGER PRIMARY KEY, item TEXT, quantidade INTEGER, valor INTEGER)')
})

function ready () {
    document.getElementById('save').addEventListener('click', save)
    show()
    clean()
    total()
}

function save () {

    var id = document.getElementById('hidden-id').value
    var qtd = document.getElementById('cad-qtd').value
    var item = document.getElementById('cad-item').value
    var preco = document.getElementById('cad-preco').value
    var precoTotal = 0

    db.transaction(function(tx){   

        precoTotal = qtd * preco   
        
        if(id) {
            tx.executeSql('UPDATE feira SET item=?, quantidade=?, valor=? WHERE id=?', [item, qtd, precoTotal, id], null)
        } else {
            tx.executeSql('INSERT INTO feira (item, quantidade, valor) VALUES (?,?,?)', [item, qtd, precoTotal])
        }

        show()
        clean()
        total()
            
    })

}

function show() {
    var divItem = document.getElementById('divItem')

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM feira', [], function(tx, res) {
            var rows = res.rows
            var output = ''
            valor = 0

            for(let i = 0; i < rows.length; i++) {
                valor = rows[i].valor.toLocaleString('pt-br', {minimumFractionDigits: 2})

                output += `
                <div class="card">
                <div class="item">
                <div class="infos">
                    <span class="qtd">${rows[i].quantidade}</span> - <span class="item">${rows[i].item}</span>
                    <p>R$<span class="valor">${valor}</span> </p>
                </div>
                <div class="btns">
                    <button class="editar btn" onClick="update(${rows[i].id})"><i class="fa-solid fa-pencil icon"></i></button>
                    <button class="delete btn" onClick="del(${rows[i].id})"><i class="fa-solid fa-trash-can icon"></i></button>
                </div>
                </div>
                </div>
                `
            }

            divItem.innerHTML = output
        })
    }, null)
}

function update (_id) {

    var id =  document.getElementById('hidden-id')
    var item =  document.getElementById('cad-item')
    var qtd = document.getElementById('cad-qtd')
    var preco = document.getElementById('cad-preco')

    id.value = _id

    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM feira WHERE id=?', [_id], function(tx, res){
            var rows = res.rows[0]

            item.value = rows.item
            qtd.value = rows.quantidade
            preco.value = rows.valor
        })
    })

    show()
    clean()
    total()
}

function del(_id) {

    db.transaction(function(tx){
        tx.executeSql('DELETE FROM feira WHERE id=?', [_id])
    })
    
    show()
    clean()
    total()
}

function clean () {
    var item =  document.getElementById('cad-item')
    var qtd = document.getElementById('cad-qtd')
    var preco = document.getElementById('cad-preco')

    item.value = ""
    qtd.value = ""
    preco.value = ""
}

function total () {

    var valorTotal = document.getElementById('total')

        db.transaction(function (tx) {
            tx.executeSql('SELECT SUM(valor) FROM feira', [], function(tx, res){
                
                var rows = res.rows
                var total = rows[0]["SUM(valor)"]
                var real = total.toLocaleString('pt-br', {minimumFractionDigits: 2})

                if(rows[0]["SUM(valor)"] == null) {
                    output = `0,00`
                } else {
                    output = `${real}`
                    
                }
                                
                valorTotal.innerHTML = output
            })
        }) 
    
}


