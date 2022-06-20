const url = 'https://script.google.com/macros/s/AKfycbxGa0RDg2RrgYeMk9OPumKrJY6oPcAhuAZBzwdHBYSqAlNcwEeH426SB9J7Dh9XCUcqzQ/exec'

$(document).ready(function(){
    loadData();
});

function loadData(){
    let param = {};
    param.method = 'read';

    $.post(url, param, function(data){
        if(data.result == 'sus'){
            let userData = data.data;
            for(let i = 0; i < userData.length; i++){
                let content = oneRow(i+1, userData[i]);
                $('tbody').append(content);
            }
        }
    }).fail(function(data){

    });
}


function oneRow(n, element){
    let html = `
    <tr>
        <th scope="row">${n}</th>
        <td>${element.userGender}</td>
        <td>${element.userAge}</td>
        <td>${element.userEmail}</td>
        <td>${element.gameGetInfo}</td>
        <td>${element.gameAttract}</td>
        <td>${element.gameSystem}</td>
        <td>${element.gameCharacter}</td>
        <td>${element.gameArt}</td>
        <td>${element.gameWorld}</td>
        <td>${element.gamePlay}</td>
        <td>${element.gameMusic}</td>
        <td>${element.gameStory}</td>
        <td>${element.userLikeType}</td>
        <td>${element.userFocus}</td>
        <td>${element.userOpinion}</td>
        <td>${element.userAdvice}</td>
    </tr>
    `
    return html;
}