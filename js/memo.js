"use strict";
window.addEventListener('DOMContentLoaded', function() {

    if (typeof localStorage === "undefined") {
        window.alert("このブラウザはLocal Storage機能が実装されていません");
        return;
    } else {
        viewStorage();
        saveLocalStorage();
        delLocalStorage();
        selectTable();
        allClearLocalStorage();
    }
}, false);

const saveLocalStorage = () => {
    const save = document.getElementById('save');
    save.addEventListener("click", (el) => {
        el.preventDefault();
        const key = document.querySelector("#textKey").value;
        const value = document.querySelector("#textMemo").value;

        //    check textarea is null 
        if (key == "" || value == "") {
            Swal.fire({
                title : "Memo app",
                html : "Key, Memoはいずれも必須です。",
                type : "error",
                allowOutsideClick : false
            });
            return;
        } else {
            let w_msg = `LocalStorageに\n「${key} ${value} 」\nを保存 (save) しますか？`;
            Swal.fire({
                title : "Memo app",
                html : w_msg,
                type : "question",
                showCancelButton : true
            }).then(result => {
                if(result.value === true){
                    console.log(2);
                    localStorage.setItem(key,value);
                    viewStorage();
                    let w_msg = `LocalStorageに ${key}  ${value} を保存(ほぞん)しました。`;
                    Swal.fire({
                        title : "Memo app",
                        html : w_msg,
                        type : "success",
                        allowOutsideClick : false,
                    });
                    document.querySelector("#textKey").value = "";
                    document.querySelector("#textMemo").value = "";
                }
            });

        }
    }, false)
};

// viewStorage function 
const viewStorage = () => {
    const list = document.querySelector('#list');
    while (list.rows[0]) list.deleteRow(0);
    for (let i = 0; i < localStorage.length; i++) {
        let w_key = localStorage.key(i);

        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');

        list.appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        td1.innerHTML = `<input type="checkbox" name="checkbox1">`
        td2.innerHTML = w_key;
        td3.innerHTML = localStorage.getItem(w_key);
        td4.innerHTML = `<i class="far fa-trash-alt delItem"></i>`;
    }
    // jquery function
    $("#table1").tablesorter({
        sortList: [
            [1, 0]
        ]
    });
    $("#table1").trigger("update");
}

//delLocalStorage function
const delLocalStorage = () => {
    // 選んだものを削除薄る
    const deleteItem = document.querySelector('#deleteItem');
    let w_cnt = 0;
    deleteItem.addEventListener('click',(e)=>{
        e.preventDefault();
        const chkbox1 = document.getElementsByName("checkbox1");
        const table1 = document.getElementById("table1");
        w_cnt = selectCheckBox_mode("del");
    
        if(w_cnt >= 1){
            let w_confirm = `LocalStorageから選択されている${w_cnt}件を削除(delete)しますか？`;
            Swal.fire({
                title : "Memo app",
                html : w_confirm,
                type : "question",
                showCancelButton : true
            }).then(result => {
                if(result.value === true){
                    for(let i = 0;i < chkbox1.length;i++){
                        if(chkbox1[i].checked){
                            localStorage.removeItem(table1.rows[i+1].cells[1].firstChild.data)
                        }
                    }
                    viewStorage();
                    let w_msg = `LocalStorageから選択されている ${w_cnt} 件を削除(delete)しました。`;
                    Swal.fire({
                        title : "Memo app",
                        html : w_msg,
                        type : "success",
                        allowOutsideClick : false
                    });
                    document.querySelector("#textKey").value = "";
                    document.querySelector("#textMemo").value = "";
                }
            })
        } 
    })

    // 一つを削除する
    $(document).on('click', '.delItem', function(e){
        parent = $(this).parent();
        let key = $(parent).prev().prev().text();
        let value = $(parent).prev().text();

        let w_delete = `LocalStorageに[${key} ${value}]を削除しますか？`;
            Swal.fire({
                title : "Memo app",
                html : w_delete,
                type : "question",
                showCancelButton : true
            }).then(result => {
                if(result.value === true){
                    localStorage.removeItem(key);
                    viewStorage();
                    let w_msg = `LocalStorageから「 ${key} ${value} 」を削除(delete)しました！`;
                    Swal.fire({
                        title : "Memo app",
                        html : w_msg,
                        type : "success",
                        allowOutsideClick : false
                    });
                    document.querySelector("#textKey").value = "";
                    document.querySelector("#textMemo").value = "";
                }
            })

    })

    const del = document.querySelectorAll('.delItem');
    del.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const key = table1.rows[index+1].cells[1].firstChild.data;
            const value = table1.rows[index+1].cells[2].firstChild.data;

            let w_delete = `LocalStorageに「 ${key} ${value} 」を削除しますか？`;
            Swal.fire({
                title : "Memo app",
                html : w_delete,
                type : "question",
                showCancelButton : true
            }).then(result => {
                if(result.value === true){
                    localStorage.removeItem(key);
                    viewStorage();
                    let w_msg = `LocalStorageから「 ${key} ${value} 」を削除(delete)しました！`;
                    Swal.fire({
                        title : "Memo app",
                        html : w_msg,
                        type : "success",
                        allowOutsideClick : false
                    });
                    document.querySelector("#textKey").value = "";
                    document.querySelector("#textMemo").value = "";
                }
            })
        })
    }), false
}

// select table function
const selectTable = () => {
    const table = document.querySelector("#select");
    table.addEventListener('click', (e) => {
        e.preventDefault();
        selectCheckBox();
        selectCheckBox_mode("select");
    }, false)
}
////////////////////////////////
const selectCheckBox_mode = (mode) =>{
    let w_cnt = 0;
    const checkbox1 = document.getElementsByName('checkbox1');
    const table1 = document.getElementById('table1');
    let w_textKey = "";
    let w_textMemo = "";

    for (let i = 0; i < checkbox1.length; i++) {
        if (checkbox1[i].checked) {
            if(w_cnt === 0){
                w_textKey = table1.rows[i+1].cells[1].firstChild.data;
                w_textMemo = table1.rows[i+1].cells[2].firstChild.data;
            }
            w_cnt++;
        }
    }
    document.querySelector('#textKey').value = w_textKey;
    document.querySelector('#textMemo').value = w_textMemo;

    if(mode === "select"){
        if(w_cnt === 1) return w_cnt;
        else  {
            let msg = "1つを選択(select)してください";
            Swal.fire({
                title : "Memo app",
                html : msg,
                type : "error",
                allowOutsideClick : false
            })
        }
    }
    if(mode === "del"){
        if(w_cnt >= 1) return w_cnt;
        else {
            let msg = "１つ以上、選択してください";
            Swal.fire({
                title : "Memo app",
                html : msg,
                type : "error",
                allowOutsideClick : false
            })
        }
    }
}
/////////////////////////////////
const selectCheckBox = () => {
    let w_sel = "0";
    let w_cnt = 0;
    const checkB = document.getElementsByName('checkbox1');
    const table1 = document.getElementById('table1');
    let w_textKey = "";
    let w_textMemo = "";

    for (let i = 0; i < checkB.length; i++) {
        if (checkB[i].checked) {
            if(w_cnt === 0){
                w_textKey = table1.rows[i+1].cells[1].firstChild.data;
                w_textMemo = table1.rows[i+1].cells[2].firstChild.data;
            }
            w_cnt++;
        }
    }
    document.querySelector('#textKey').value = w_textKey;
    document.querySelector('#textMemo').value = w_textMemo;

    if(w_cnt === 1) return w_sel = "1";
    else  {
        let msg = "1つを選択(select)してください";
        Swal.fire({
            title : "Memo app",
            html : msg,
            type : "error",
            allowOutsideClick : false
        })
    }
}
    // clear all localstorage function
const allClearLocalStorage = () => {
    const allClear = document.querySelector('#allClear');
    allClear.addEventListener('click', (e) => {
        e.preventDefault();
        let w_confirm = "LocalStorageのデータをすべて削除(all clear)します。\nよろしいですか？";
        Swal.fire({
            titel : "Memo app",
            html : w_confirm,
            type : "question",
            showCancelButton : true
        }).then(result => {
            if(result.value === true){
                localStorage.clear();
                viewStorage();
                let w_msg = "LocalStorageのデータをすべて削除(all clear)しました！";
                Swal.fire({
                    title : "Memo app",
                    html : w_msg,
                    type : "success",
                    allowOutsideClick : false
                })
                document.querySelector("#textKey").value = "";
                document.querySelector("#textMemo").value = "";

            }
        })
    });
}
