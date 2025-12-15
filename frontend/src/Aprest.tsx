import Button from "./button"
import Card from "./card"
import Header from "./header"
import Footer from "./footer"
function App() {
  

  return (
    <>
    <main>
    <Header />
    <div className="app-container">
    <Button value="Hi"/>
    <Card name="hello" />
  </div>
    <Footer />
</main>
    </>
  )
}

export default App
