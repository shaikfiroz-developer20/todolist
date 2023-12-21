import '@/styles/globals.css'

 function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
App.head = () => (
  <>
   <link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Agbalumo&family=Bebas+Neue&family=Bungee+Spice&display=swap" rel="stylesheet" />
  </>
);

export default App;