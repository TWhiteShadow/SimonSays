//after the DOM has loaded
document.addEventListener('DOMContentLoaded', function() {

    function removeSelected(thisImage) {
        setTimeout(() => {
            thisImage.classList.remove('selected');
        }, 100);
    }
    images = document.querySelectorAll('img');

    images.forEach(function(image) {
        image.addEventListener('mousedown', function() {
            image.classList.add('selected');
            image.style.cursor = 'grabbing';
        });
        image.addEventListener('mouseup', function() {
            removeSelected(image);
            image.style.cursor = 'grab';
        });
    });

    let score = document.getElementById('score');

    score.addEventListener('click', function() {
        startGame();
    }, { once: true });

    function randomColor() {
        let colors = ['blue', 'red', 'green', 'yellow'];
        let random = Math.floor(Math.random() * 4);
        return colors[random];
    }
    function lightUpColor(color) {
        let element = document.getElementById(color);
        element.classList.add('selected');
        setTimeout(() => {
            element.classList.remove('selected');
        }, 200);
    }

    function lightUpColors(order) {
        for (let i = 0; i < order.length; i++) {
            setTimeout(() => {
                lightUpColor(order[i]);
            }, 1000 * i);
        }
    }

    function startGame() {
        let blue = document.getElementById('blue');
        let red = document.getElementById('red');
        let green = document.getElementById('green');
        let yellow = document.getElementById('yellow');
        score.innerHTML = 0;
        let order = [];
        let clickedOrder = [];
        let currentScore = 0;
        let winning = true;
        while (winning && currentScore < 10) {
            order.push(randomColor());
            lightUpColors(order);
            //add event listeners to the colors
            currentScore++;

        }
        console.log(order);
    }

});