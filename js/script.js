const addressForm = document.querySelector('#address-form')
const cepInput = document.querySelector('#cep')
const addressInput = document.querySelector('#address')
const cityInput = document.querySelector('#city')
const neighborhoodInput = document.querySelector('#neighborhood')
const regionInput = document.querySelector('#region')
const formInputs = document.querySelectorAll('[data-input]')

const closeButton = document.querySelector('#close-message')
const fadeElement = document.querySelector('#fade')

//Validade CEP input
cepInput.addEventListener('keypress', e => {
  const onlyNumbers = /[0-9]/
  const key = String.fromCharCode(e.keyCode)

  //allow only numbers
  if (!onlyNumbers.test(key)) {
    e.preventDefault()
    return
  }
})

//get address event
cepInput.addEventListener('keyup', e => {
  const inputValue = e.target.value
  //check if we have the correct length

  if (inputValue.length === 8) {
    getAddress(inputValue)
  }
})

//get customer address from api
const getAddress = async cep => {
  toggleLoader()
  cepInput.blur()
  const apiUrl = `https://viacep.com.br/ws/${cep}/json/`

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    //show error and reset form
    if (data.erro == true) {
      addressForm.reset()
      toggleLoader()

      toggleMessage('CEP inválido, tente novamente')
      toggleDisabled()
      return
    }

    if (!addressInput.value) {
      toggleDisabled()
    }
    addressInput.value = data.logradouro
    neighborhoodInput.value = data.bairro
    cityInput.value = data.localidade
    regionInput.value = data.uf

    toggleLoader()
  } catch (error) {
    addressForm.reset()
    toggleLoader()

    toggleMessage('Erro, verifique o CEP preenchido e tente novamente.')
    toggleDisabled()
    cepInput.focus()
    return
  }
}

//show or hide loader
const toggleLoader = () => {
  const loaderElement = document.querySelector('#loader')

  fadeElement.classList.toggle('hide')
  loaderElement.classList.toggle('hide')
}

//show or hide message
const toggleMessage = msg => {
  const messageElement = document.querySelector('#message')
  const messageElementText = document.querySelector('#message p')

  messageElementText.innerText = msg
  fadeElement.classList.toggle('hide')
  messageElement.classList.toggle('hide')
  cepInput.focus()
}

//close message modal
closeButton.addEventListener('click', () => toggleMessage())

//add or remove disabled attribute
const toggleDisabled = () => {
  if (regionInput.hasAttribute('disabled')) {
    formInputs.forEach(input => {
      input.removeAttribute('disabled')
    })
  } else {
    formInputs.forEach(input => {
      input.setAttribute('disabled', 'disabled')
    })
  }
}

//save address
addressForm.addEventListener('submit', e => {
  e.preventDefault()
  toggleLoader()
  setTimeout(() => {
    toggleLoader()
    toggleMessage('Endereço salvo com sucesso')
    addressForm.reset()
    toggleDisabled()
  }, 1500)
})
