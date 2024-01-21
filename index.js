// some important declarations
let hamiltonPrice;
let sixPrice;
let theWizPrice;

//allow returning user to enter name and see curated info
const returningUserButton = document.querySelector(`#returning-user-button`)
const newUserButton = document.querySelector(`#new-user-button`)
const buttonDiv = document.querySelector(`#button-div`)
const div = document.querySelector(`#info`)
returningUserButton.addEventListener(`click`, (event) => {
    event.preventDefault()
    let form = document.createElement('form')
    let label = document.createElement(`label`)
    let inputName = document.createElement(`input`)
    let inputButton = document.createElement(`input`)
    form.id = `name-input`
    inputName.type = `text`
    inputName.placeholder = `Name`
    inputButton.type = `submit`
    inputButton.value = `Submit`
    buttonDiv.append(form)
    form.append(label)
    label.append(inputName)
    label.append(document.createElement(`br`))
    label.append(inputButton)

// after cicking submit, show personalized page with user info and prices
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        //remove submit button and change experience slightly
        form.remove()
        returningUserButton.textContent = `Change User`
        // add person's name
        const personName = inputName.value
        let h1 = document.createElement(`h1`)
        h1.textContent = `Welcome back, ${personName}!`
        div.append(h1)
        // get person's image and show preferences
        fetch(`http://localhost:3000/people`)
        .then(response => response.json())
        .then(people => {
            people.forEach(person => {
                if (personName === person.name) {
                    //add person's image
                    let image = document.createElement(`img`)
                    image.src = person.profilePic
                    image.id = `main-image`
                    div.append(image)
                    
                    //display person's show preferences
                    person.preferences.forEach(show => {
                        let showName = show.show
                        let maxPrice = show.maxPrice

                        fetch(`http://localhost:3000/prices`)
                        .then(response => response.json())
                        .then(prices => {
                            prices.forEach(price => {
                                if (showName === price.name) {
                                    if (price.price < maxPrice) {
                                    let p = document.createElement(`p`)
                                    p.textContent = `${showName}: $${price.price}`
                                    div.append(p)
                                    }
                                }
                            })
                        })
                    })
                }
            });
        })
   }) 
})