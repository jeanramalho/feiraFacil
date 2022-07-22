//quando a janela e carregada é chamada a função ready
window.addEventListener('load', ready)

//recebe configurações do banco de dados
var db = openDatabase('feiraFacil', '1.0', 'Feira Database', 2 * 1024 + 1024)

//chama a as configurações e executa comando para criar tabela no banco
db.transaction(function(tx){
    tx.executeSql('CREATE TABLE feira ( id INTEGER PRIMARY KEY, item TEXT, quantidade INTEGER, valor INTEGER)')
})

//função que é executada quando a página é carrega
function ready () {
    document.getElementById('save').addEventListener('click', save)
    show()
    clean()
    total()
}

//salva dados que estão nos inputs, serve para criar um novo cadastro 
//ou atulizar um cadastro caso o id hidden esteja preenchido por um id válido
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


//exibe dados da tabela na tela
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
                    <div class="divQtd">
                        <h3 class="desc"> QTD </h3>
                        <span class="qtd">${rows[i].quantidade}</span> 
                    </div>
                    <div class="divItemm">
                        <h3 class="desc"> ITEM </h3>
                        <span class="item">${rows[i].item}</span>
                    </div>
                    <div class="divPreco">
                        <h3 class="desc"> VALOR </h3>
                        <p>R$<span class="valor">${valor}</span> </p>
                    </div>
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

//pega o id exibe os dados nos inputs
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


//deleta um item da tabela
function del(_id) {

    db.transaction(function(tx){
        tx.executeSql('DELETE FROM feira WHERE id=?', [_id])
    })
    
    show()
    clean()
    total()
}


//limpa os campos dos inputs
function clean () {
    var id =  document.getElementById('hidden-id')
    var item =  document.getElementById('cad-item')
    var qtd = document.getElementById('cad-qtd')
    var preco = document.getElementById('cad-preco')

    item.value = ""
    qtd.value = ""
    preco.value = ""
    id.value = ""
}


//soma todos os valores dos itens e exibe o valor total 
function total () {

    var valorTotal = document.getElementById('total')

        db.transaction(function (tx) {
            tx.executeSql('SELECT SUM(valor) FROM feira', [], function(tx, res){
                
                var rows = res.rows
                var total = rows[0]["SUM(valor)"]
                var real = 0

                if(rows[0]["SUM(valor)"] == null) {
                    output = `0,00`
                } else {
                    real = total.toLocaleString('pt-br', {minimumFractionDigits: 2})
                    output = `${real}`
                    
                }
                                
                valorTotal.innerHTML = output
            })
        }) 
    
}


