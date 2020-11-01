window.onload = function() {
let userdropDown = document.getElementById('user-select');
let loader = document.getElementById('loader-view');
let newBalance = document.getElementById('user-balance');
let userName = document.getElementById('user-name');
let statements = document.getElementById('monthly-statements');

let list='';
loader.style.display = 'none';


userdropDown.addEventListener('change',(event)=>{
    list='';
    let userId = event.target.value;
    loader.style.display = 'block';
    getUserTransactionResponse(userId);
})

const format = function date2str(x, y) {
    var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
    });

    return y.replace(/(y+)/g, function(v) {
        return x.getFullYear().toString().slice(-v.length)
    });
}

const getData = (api) => {
    return fetch(api)
    .then((response) => response.json())
    .then((responseJson) => {
       return responseJson
    })
    .catch((error) => {
        return error
    });
  };
  
 const getUserTransactionResponse = (userId)=>{
    let apiUrl = `https://jsonmock.hackerrank.com/api/transactions?userId=${userId}`
    getData(apiUrl).then((res)=>{
       showTransaction(res);
    })
  }

  const showTransaction = (resData)=>{
     loader.style.display = 'none';
     let allTransactions = resData && resData.data;
     let creditAmount = 0;
     let debitAmount = 0;
     let transactions = allTransactions.sort((a,b) => a.timestamp - b.timestamp);
     if(transactions.length){
        transactions.forEach((item)=>{
            if(item.txnType === 'credit'){
            let amount = item.amount.replace('$','');
            amount = amount.replace(',','');
            creditAmount = creditAmount + Number(amount);
            }
            if(item.txnType === 'debit'){
                let amount = item.amount.replace('$','');
                amount = amount.replace(',','');
                debitAmount = creditAmount + Number(amount);
            }
            let trasanctionList = showTransactionLists(item);
            list = list + trasanctionList
        })
        let balance = creditAmount - debitAmount;
        if(balance<=0){
            balance = 0
        }
        newBalance.innerHTML = '$'+ balance;
        userName.innerHTML = transactions[0].userName;
        statements.innerHTML = list;
    }
  }

  function showTransactionLists(transaction){
    let date = format(new Date(transaction.timestamp), 'yyyy-MM-dd')
    return `<div class="transaction">
        <p>Amount : ${transaction.amount}</p>
        <p>TxnType : ${transaction.txnType}</p>
        <p>Date : ${date}</p>
    </div>`
  }
}


  

  