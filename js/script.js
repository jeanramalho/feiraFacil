window.addEventListener('load', ready)

var db = openDatabase('feiraFacil', '1.0', 'Feira Database', 2 * 1024 + 1024)

db.transaction(function(tx){
    tx.executeSql('CREATE TABLE feira ( id INTEGER PRIMARY KEY, item TEXT, quantidade INTEGER, valor INTEGER)')
})

function ready () {
    document.getElementById('save').addEventListener('click', save)
    show()
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
                    <button class="editar btn"><i class="fa-solid fa-pencil icon"></i></button>
                    <button class="delete btn"><i class="fa-solid fa-trash-can icon"></i></button>
                </div>
                </div>
                </div>
                `
            }

            divItem.innerHTML = output
        })
    }, null)
}

