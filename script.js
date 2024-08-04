document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const breedSelector = document.getElementById('breed-selector');
    const breedSearch = document.getElementById('breed-search');
    const loader = document.getElementById('loader');
    const dogImage = document.getElementById('dog-image');
    const dogBreed = document.getElementById('dog-breed');
    const breedInfo = document.getElementById('breed-info');
    const errorMessage = document.getElementById('error-message');
    
    let currentDogImage = '';

    fetch('https://dog.ceo/api/breeds/list/all')
        .then(response => response.json())
        .then(data => {
            const breeds = Object.keys(data.message);
            breeds.forEach(breed => {
                const option = document.createElement('option');
                option.value = breed;
                option.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
                breedSelector.appendChild(option);
            });

            breedSearch.addEventListener('input', () => {
                const searchValue = breedSearch.value.toLowerCase();
                Array.from(breedSelector.options).forEach(option => {
                    option.style.display = option.value.includes(searchValue) ? 'block' : 'none';
                });
            });
        })
        .catch(error => {
            errorMessage.textContent = 'Error fetching breed list. Please try again.';
        });

    generateBtn.addEventListener('click', generateDog);

    function generateDog() {
        const selectedBreed = breedSelector.value;
        const url = selectedBreed === 'random'
            ? 'https://dog.ceo/api/breeds/image/random'
            : `https://dog.ceo/api/breed/${selectedBreed}/images/random`;

        loader.style.display = 'block';
        dogImage.style.display = 'none';
        dogBreed.textContent = '';
        breedInfo.textContent = '';
        errorMessage.textContent = '';

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const imageUrl = data.message;
                const breed = imageUrl.split('/')[4];
                currentDogImage = imageUrl;

                dogImage.src = imageUrl;
                dogImage.alt = `Image of a ${breed}`;
                dogBreed.textContent = `Breed: ${breed.charAt(0).toUpperCase() + breed.slice(1)}`;

                dogImage.style.display = 'block';
                loader.style.display = 'none';

                fetch(`https://api.thedogapi.com/v1/breeds/search?q=${breed}`)
                    .then(response => response.json())
                    .then(data => {
                        breedInfo.textContent = data.length > 0
                            ? `Info: ${data[0].temperament}`
                            : 'Info: No additional info available.';
                    })
                    .catch(() => {
                        breedInfo.textContent = 'Info: Error fetching breed info.';
                    });
            })
            .catch(() => {
                loader.style.display = 'none';
                errorMessage.textContent = 'Error fetching dog image. Please try again.';
            });
    }
});
