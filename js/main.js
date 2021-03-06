const url = 'https://script.google.com/macros/s/AKfycbxGa0RDg2RrgYeMk9OPumKrJY6oPcAhuAZBzwdHBYSqAlNcwEeH426SB9J7Dh9XCUcqzQ/exec';
const pageNum = 7;
let articleNum = 1;
let articleNumDirty = false;
let lastPageNum = 1;

$(document).ready(function() {    
    setProgress();
    setBtnActive();
    setPageImage(1);
    BtnFunc();
    activeLoadingAnimation(false);
    setTextCheck(['input[type=text]']);

    $('input[type=radio]').change(function(e) {
        removeTip($(this));
    });
    $('select').change(function(e) {
        removeTip($(this));
    });
    $('input[type=checkbox]').change(function(e) {
        removeTip($(this));
    });

});


function BtnFunc(){

    $('.btn-prev').click(function(event) {
        switchArticle(-1);
    });

    $('.btn-send').click(function(event) {
        switchToLastPage();
        postData();
    });

    $('.btn-next').click(function(event) {
        switchArticle(1);
    });
}


function switchArticle(action){

    // prev: action = -1 , next: action = 1
    if(checkField(articleNum)) updateArticleNumDirty(action);
    
    if(articleNumDirty){
        gsap.to('#article'+ lastPageNum, {
            duration: 0.5,
            x: $('.container').width() * -action,
            onComplete: backToCenter,
            onCompleteParams: [lastPageNum]
        })

        $('#article'+articleNum).show();
        gsap.to('#article'+ articleNum ,{
            duration: 0,
            x: $('.container').width() * action
        });
        gsap.to('#article'+ articleNum ,{
            duration: 0.5,
            x: 0
        });
        articleNumDirty = false;
    }

    setProgress();
    setBtnActive();
}


function updateArticleNumDirty(action){
    lastPageNum = articleNum;
    let newPageNum =  Math.min(Math.max(articleNum + action, 1), pageNum);
    articleNumDirty = lastPageNum != newPageNum;
    if(articleNumDirty) {
        articleNum = newPageNum;
    }
}


function backToCenter(pn){
    gsap.to('#article' + pn, {duration: 0, x: 0} );
	$('#article'+ pn).hide();

    setPageImage(pn);
}


function setPageImage(pn){
    $('header .img').removeClass('show-img');
    $('header .img').addClass('hide-img');

	$('.img'+articleNum).show();
	setTimeout(function(){
        $('.img'+articleNum).removeClass('hide-img')
		$('.img'+articleNum).addClass('show-img');
	}, 100);
}


function setProgress() {
	let width = Math.ceil((articleNum / pageNum) * 100);
	$('.progress-bar').css('width', width+'%');
}


function setBtnActive(){    
    articleNum == 1 || articleNum == pageNum ? $('.btn-prev').hide() : $('.btn-prev').show();
    articleNum >= pageNum-1 ? $('.btn-next').hide() : $('.btn-next').show();

    articleNum == pageNum - 1 ? $('.btn-send').show() : $('.btn-send').hide();

    articleNum == pageNum ? $('.btn-home').show() : $('.btn-home').hide();
    articleNum == pageNum ?  $('.btn-data').show() :  $('.btn-data').hide();
}


function switchToLastPage(){
    gsap.to('#article'+ articleNum, {
        duration: 0.5,
        x: $('.container').width() * -1,
        onComplete: backToCenter,
        onCompleteParams: [articleNum]
    })

    articleNum = pageNum;

    $('#article'+pageNum).show();
    gsap.to('#article'+ pageNum ,{
        duration: 0,
        x: $('.container').width() * 1
    });
    gsap.to('#article'+ pageNum ,{
        duration: 0.5,
        x: 0
    });
    setProgress();
    setBtnActive();
}


function postData(){
    activeLoadingAnimation(true);

	let param = {};
	param.method = 'write';
    // ????????????
    param.userGender    = getSelectVal('user-gender');
    param.userAge       = getSelectVal('user-age');
    param.userEmail     = getInputVal('user-email');
    // ??????????????????
    param.gameGetInfo   = getCheckboxVal('game-getinfo', 'game-getinfo-other');
    param.gameAttract   = getCheckboxVal('game-attract', 'game-attract-other');
    // ????????????
    param.gameSystem    = getRadioVal('game-system');
    param.gameCharacter = getRadioVal('game-character');
    param.gameArt       = getRadioVal('game-art');
    param.gameWorld     = getRadioVal('game-world');
    param.gamePlay      = getRadioVal('game-play');
    param.gameMusic     = getRadioVal('game-music');
    param.gameStory     = getRadioVal('game-story');
    //?????????????????????
    param.userLikeType  = getCheckboxVal('user-liketype');
    param.userFocus     = getCheckboxVal('user-focus', 'user-focus-other');
    // ??????
    param.userOpinion = getTextAreaVal('user-opinion-textarea');
    param.userAdvice = getTextAreaVal('user-advice-textarea');
    console.log(param);
    // send data to google sheet
    $.post(url, param, function(data) {
        activeLoadingAnimation(false);

        if(data.result != 'sus')  alert('error', + data.msg);

    }).fail(function(data){
        activeLoadingAnimation(false);
        alert('fail!');
        
    });
}


function activeLoadingAnimation(active){
    $('.cover').css('display', `${active ? 'grid' :'none'}`);
}


getSelectVal = (name) => $(`select[name = ${name}]`).val();

getInputVal = (name) => $(`input[name = ${name}]`).val();

getCheckboxVal = (name, otherName = null) => {
    let ary = [];
    $(`input[name = ${name}]:checked`).each(function(index, element){
        if($(this).val() == '??????' && otherName != null) ary.push($(this).val() + ":" + $(`input[name = ${otherName}]`).val());
        else ary.push($(this).val());
    })
    return JSON.stringify(ary);
}

getRadioVal = (name) => $(`input[name = ${name}]:checked`).val();

getTextAreaVal = (name) => $(`textarea[name = ${name}]`).val()


function setTextCheck(event_ary){
    for(let i=0;i<event_ary.length;i++){
        $(event_ary[i]).focusout(function(e){
            if($(this).val() == ''){
                setTip($(this));
            }
        });
     
        $(event_ary[i]).keyup(function(e){
            if($(this).val() != ''){
               removeTip($(this));
            }
        });
    }
}


function checkField(pn) {
    let check = true;
    switch(pn) {
        case 2:
            $('select').each(function(){
                if($(this).val() == ''){
                    setTip($('select'));
                    check = false;
                }
            });
            if($('input[name = user-email]').val() == ''){
                setTip($('input[name = user-email]'));
                check = false;
            }
            break;
        case 3:
            if($('input[name = game-getinfo]:checked').val() == undefined){
                setTip($('#game-getinfo-1'));
                check = false;
            }
            if($('input[name = game-getinfo]')[$('input[name = game-getinfo]').length - 1].checked && $('input[name = game-getinfo-other]').val() == ''){
                setTip($('input[name = game-getinfo-other]'));
                check = false;
            }
            if($('input[name = game-attract]:checked').val() == undefined){                
                setTip($('#game-attract-1'));
                check = false;
            }
            if($('input[name = game-attract]')[$('input[name = game-attract]').length - 1].checked && $('input[name = game-attract-other]').val() == ''){
                setTip($('input[name = game-attract-other]'));
                check = false;
            }
            break;
        case 4:            
            if($('input[name = game-system]:checked').val() == undefined){
                setTip($('input[name = game-system]'));
                check = false;
            }
            if($('input[name = game-character]:checked').val() == undefined){
                setTip($('input[name = game-character]'));
                check = false;
            }
            if($('input[name = game-art]:checked').val() == undefined){
                setTip($('input[name = game-art]'));
                check = false;
            }
            if($('input[name = game-world]:checked').val() == undefined){
                setTip($('input[name = game-world]'));
                check = false;
            }
            if($('input[name = game-play]:checked').val() == undefined){
                setTip($('input[name = game-play]'));
                check = false;
            }
            if($('input[name = game-music]:checked').val() == undefined){
                setTip($('input[name = game-music]'));
                check = false;
            }
            if($('input[name = game-story]:checked').val() == undefined){
                setTip($('input[name = game-story]'));
                check = false;
            }
            break;
            case 5:
            if($('input[name = user-liketype]:checked').val() == undefined){
                setTip($('input[name = user-liketype]'));
                check = false;
            }
            if($('input[name = user-focus]:checked').val() == undefined){
                setTip($('#user-focus-1'));
                check = false;
            }
            if($('input[name = user-focus]')[$('input[name = user-focus]').length - 1].checked && $('input[name = user-focus-other]').val() == ''){
                setTip($('input[name = user-focus-other]'));
                check = false;
            }
            break;
        default:
            check = true;
            break;
    }
    return check;
    
}


function setTip(dom) {
	let template = $('#tipTemplate').html();
	if(dom.closest('.tip-check').find('.tip').length == 0){
		dom.closest('.tip-check').append(template);
		dom.closest('.tip-check').addClass('bdr');
	}
    
}


function removeTip(dom){
	dom.closest('.tip-check').find('.tip').remove();
	dom.closest('.tip-check').removeClass('bdr');
}