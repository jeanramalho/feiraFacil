window.addEventListener('load', ready)

var db = openDatabase('feiraFacil', '1.0', 'Feira Database', 2 * 1024 + 1024)

db.transaction(function(tx){
    tx.executeSql('CREATE TABLE feira ( ID INTEGER PRIMARY KEY, item TEXT, quantidade INTEGER, valor INTEGER)')
})

