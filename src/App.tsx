import {useRoutes} from "react-router";
import routes from "@/routers";
import '../public/styles/_variables.scss'


function App() {
    const outlet = useRoutes(routes)
    return (
        <div className="App">
            {outlet}
        </div>
    )
}

export default App
