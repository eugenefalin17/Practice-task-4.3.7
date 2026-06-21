const input = document.querySelector('.search')
const autocomplete = document.querySelector('.autocomplete')
const repositories = document.querySelector('.repositories')

/* ---------------- DEBOUNCE ---------------- */

const debounce = (fn, delay) => {
  let timerId

  return function (...args) {
    clearTimeout(timerId)

    timerId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/* ---------------- FETCH + RENDER ---------------- */

const searchRepositories = async () => {
  const query = input.value.trim()

  if (!query) {
    autocomplete.replaceChildren()
    return
  }

  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${query}&per_page=5`
    )

    const data = await response.json()

    if (!data.items) {
      autocomplete.replaceChildren()
      return
    }

    autocomplete.replaceChildren()

    data.items.forEach((repository) => {
      const li = document.createElement('li')

      li.classList.add('autocomplete__item')
      li.textContent = repository.name

      // клик по репозиторию → добавляем в список
      li.addEventListener('click', () => {
        addRepository(repository)
        input.value = ''
        autocomplete.replaceChildren()
      })

      autocomplete.append(li)
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

/* ---------------- ADD REPOSITORY ---------------- */

const addRepository = (repo) => {
  const li = document.createElement('li')
  li.classList.add('repository')

  const info = document.createElement('div')
  info.classList.add('repository__info')

  const name = document.createElement('div')
  name.textContent = `Name: ${repo.name}`

  const owner = document.createElement('div')
  owner.textContent = `Owner: ${repo.owner.login}`

  const stars = document.createElement('div')
  stars.textContent = `Stars: ${repo.stargazers_count}`

  const removeButton = document.createElement('button')
  removeButton.classList.add('repository__remove')

  const handleRemove = () => {
    removeButton.removeEventListener('click', handleRemove)
    li.remove()
  }

  removeButton.addEventListener('click', handleRemove)

  info.append(name, owner, stars)
  li.append(info, removeButton)
  repositories.append(li)
}

/* ---------------- EVENT ---------------- */

input.addEventListener('input', debounce(searchRepositories, 500))
