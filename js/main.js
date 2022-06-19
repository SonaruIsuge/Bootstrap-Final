
const pageNum = 7;
let articleNum = 1;
let articleNumDirty = false;
let lastPageNum = 1;

$(document).ready(function() {    
    setProgress();
    setSendBtn();
    setPageImage(1);
    BtnFunc();
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
    
    articleNum == 1 ? $('.btn-prev').hide() : $('.btn-prev').show();
    articleNum >= pageNum-1 ? $('.btn-next').hide() : $('.btn-next').show();
}


function switchArticle(action){

    // prev: action = -1 , next: action = 1
    updateArticleNumDirty(action);
        
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
    }
    articleNum == 1 ? $('.btn-prev').hide() : $('.btn-prev').show();
    articleNum >= pageNum-1 ? $('.btn-next').hide() : $('.btn-next').show();

    setProgress();
    setSendBtn();
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


function setSendBtn(){
    if(articleNum == pageNum - 1) $('.btn-send').show();
    else $('.btn-send').hide();
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
    $('.btn-prev').hide();
    $('.btn-send').hide();
    $('.btn-next').hide();
}


function postData(){
    
}