window.addEventListener('load', ready)

var db = openDatabase('feiraFacil', '1.0', 'Feira Database', 2 * 1024 + 1024)

db.transaction(function(tx){
    tx.executeSql('CREATE TABLE feira ( id INTEGER PRIMARY KEY, item TEXT, quantidade INTEGER, valor INTEGER)')
})

function ready () {
    document.getElementById('save').addEventListener('click', save)
    show()
    clean()
}

function save () {

    var id = document.getElementById('hidden-id').value
    var qtd = document.getElementById('cad-qtd').value
    var item = document.getElementById('cad-item').value
    var preco = document.getElementById('cad-preco').value

    db.transaction(function(tx){        
        if(id) {
            tx.executeSql('UPDATE feira SET item=?, quantidade=?, valor=? WHERE id=?', [item, qtd, preco, id], null)
        } else {
            tx.executeSql('INSERT INTO feira (item, quantidade, valor) VALUES (?,?,?)', [item, qtd, preco])
        }

        show()
        clean()
            
    })

}

function show() {
    var divItem = document.getElementById('divItem')

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM feira', [], function(tx, res) {
            var rows = res.rows
            var output = ''

            for(let i = 0; i < rows.length; i++) {
                output += `
                <div class="card">
                <div class="item">
                <div class="infos">
                    <span class="qtd">${rows[i].quantidade}</span> - <span class="item">${rows[i].item}</span>
                    <p>R$<span class="valor">${rows[i].valor}</span> </p>
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
}

function del(_id) {

    db.transaction(function(tx){
        tx.executeSql('DELETE FROM feira WHERE id=?', [_id])
    })
    
    show()
    clean()
}

function clean () {
    var item =  document.getElementById('cad-item')
    var qtd = document.getElementById('cad-qtd')
    var preco = document.getElementById('cad-preco')

    item.value = ""
    qtd.value = ""
    preco.value = ""
}


