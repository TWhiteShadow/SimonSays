//after the DOM has loaded
document.addEventListener('DOMContentLoaded', function() {

    function removeSelected(thisImage) {
        setTimeout(() => {
            thisImage.classList.remove('selected');
        }, 100);
    }
    images = document.querySelectorAll('img');
    //loop through each image
    images.forEach(function(image) {
        //add a click event to each image
        image.addEventListener('mousedown', function() {
            image.classList.add('selected');
            //make cursor special
            image.style.cursor = 'grabbing';
        });
        image.addEventListener('mouseup', function() {
            removeSelected(image);
            image.style.cursor = 'grab';
        });
    });

    score = document.getElementById('score');
    score.addEventListener('click', function() {
        startGame();
    }, { once: true });

    function startGame() {
        score.innerHTML = 0;
        order = [];
        clickedOrder = [];
        currentScore = 0;
    }
});