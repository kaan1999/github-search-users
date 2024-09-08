window.onload = () => 
    {
        const accessToken = null;
        //Header Navbar
        const navbar = document.querySelector('.header__navbar');
        const btnMenuOpen = document.querySelector('.header__btn-menu-open');
    
        
        navbar.classList.add('hide');
    
        btnMenuOpen.addEventListener('click', e => {
            navbar.classList.toggle('hide');
        })
    
        btnAbout.addEventListener('click', e => {
            userCards.forEach(userCard => userCard.classList.add('hide'));
            sectionAbout.classList.remove('hide');
            sectionSearchResultContainer.classList.add('search-result__container-auto-fit');
        })
    
        btnHome.addEventListener('click', e => {
            userCards.forEach(userCard => userCard.classList.remove('hide'));
            sectionAbout.classList.add('hide');
            sectionSearchResultContainer.classList.remove('search-result__container-auto-fit');
        })
    
        //Search Result
    
        function createUserCard({login, avatar_url, html_url, name, company, location, bio}) {
            //user card divider
            const userCard = document.createElement('div');
            userCard.classList.add('search-result__card');
    
            userCard.innerHTML = 
            `
                <h1 class='search-result__name'>${name}</h1>
                <img class='search-result__avatar' src='${avatar_url}' alt='user avatar'/>
                <span class='search-result__username'>${login}</span>
                <p class='search-result__bio'>${bio}</p>
                <ul class='search-result__info'>
                    <li class='search-result__company'>
                        <i class="fa-regular fa-building"></i>
                        <span>${company}</span>
                    </li>
                    <li class='search-result__location'>
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${location}</span>
                    </li>
                </ul>
                <a class='search-result__link' href='${html_url}' target='_blank'>See on Github</a>
            `
            userCards.push(userCard);
            sectionSearchResultContainer.appendChild(userCard);
        }
    
        async function fetchUser({login}) {
            const response = await fetch(`https://api.github.com/users/${login}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if(!response.ok)
                throw new Error(`Response Status: ${response.status}`);
            
            const user = await response.json();
            createUserCard(user);
        }
    
        async function fetchUsers(searchTerm) {
            const response = await fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if(!response.ok)
                throw new Error(`Response Status: ${response.status}`);
            const users = await response.json();
            users.items.forEach(user => fetchUser(user));
        }
        
        btnSearch.addEventListener('click', e => {
            const cards = Array.from(sectionSearchResultContainer.children);
            cards.forEach(card => {
                if(card.classList.contains('search-result__card') && !card.classList.contains('search-result__about'))
                    card.remove();
            })
            const searchTerm = inputSearch.value;
            if(!searchTerm){
                alert('Error');
                return false;
            }
    
            fetchUsers(searchTerm);
            inputSearch.value = '';
        })
    }
    