const checkIsNavigationSupported = () => {
	return Boolean(document.startViewTransition)
}

const fetchPage = async(url) => {
  // vamos a cargar la pagina de destino
	// utilizando fetch
  const response = await fetch(url)
  const text = await response.text()
  // quedarse solo con el contenido html dentro de la etiqueta body
  const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)
  return data
}

export const startViewTransition = () => {
  if (!checkIsNavigationSupported()) return

	window.navigation.addEventListener('navigate', (event) => {
		const toUrl = new URL(event.destination.url)
    // si es una pagina externa, la ignoramos
    if (location.origin !== toUrl.origin) return
    // si es una navegacion dentro del mismo dominio (origin)
    event.intercept({
      async handler() {
        const data = fetchPage(toUrl.pathname)
        // utilizar la api de ViewTransition API
        document.startViewTransition(() => {
          // como tiene que actualizar la vista
          document.body.innerHTML = data
          document.documentElement.scrollTop = 0
        })
      }
    })
  })

}
