(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText = "";
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        
        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.onload = addImage;
        unsplashRequest.onerror = function(err) {
            requestError(err, 'image');
        };
        unsplashRequest.open("GET", `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 36adae6c68ffb111f9d41711d28dc47f82cade57bd5091793d1276c8e766d963');
        unsplashRequest.send();

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=7c13dddfb24f48ffa644ef5fe8ae4f8e`);
        articleRequest.send();
    });

    function addImage() 
    {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data && data.results && data.results[0])
        {
            const firstImage = data.results[0];
            htmlContent= `<figure>
                <img src="${firstImage.urls.regular}" alt="${searchedForText}" />
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            
            </figure>`
        }
        else
        {
            htmlContent = `<div class="error-no-image">No images available</div>`;
        }
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles() 
    {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if(data.response && data.response.docs && data.response.docs.length > 1)
        {
            htmlContent = '<ul>' + data.response.docs.map (article => `<li class="article">
                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                <p>${article.snippet}</p>
                </li>
            `).join('') + '</ul>'
        }
        else {
            htmlContent = `<div class="error-no-articles">No articles available</div>`;
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }
})();
