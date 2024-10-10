//after the DOM has loaded
document.addEventListener('DOMContentLoaded', function() {
    images = document.querySelectorAll('img');
    //loop through each image
    images.forEach(function(image) {
        //add a click event to each image
        image.addEventListener('click', function() {
            //if the image is already selected, deselect it
            if (image.classList.contains('selected')) {
                image.classList.remove('selected');
            } else {
                //if the image is not selected, deselect all other images and select it
                images.forEach(function(image) {
                    image.classList.remove('selected');
                });
                image.classList.add('selected');
                console.log("Image clicked");
            }
        });
    });
});