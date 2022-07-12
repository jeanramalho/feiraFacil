window.addEventListener('load', ready)

var db = openDatabase('feiraFacil', '1.0', 'Feira Database', 2 * 1024 + 1024)

db.transaction(function(tx){
    tx.executeSql('CREATE TABLE feira ( id INTEGER PRIMARY KEY, item TEXT, quantidade INTEGER, valor INTEGER)')
})

function ready () {
    document.getElementById('save').addEventListener('click', save)
}

function save () {
    var id = getElementById('hidden-id').value
    var qtd = getElementById('cad-qtd').value
    var item = getElementById('cad-item').value
    var preco = getElementById('cad-preco').value

    db.transaction(tx) {
        if(id) {
            tx.executeSql('UPDATE feira SET item=?, quantidade=?, valor=? WHERE id=?', [item, qtd, preco, id], null)
        } else {
            tx.executeSql('INSER INTO feira (item, quantidade, valor) VALUES (?,?,?)', [item, qtd, preco])
        }

        show()
        clean()
    }
}