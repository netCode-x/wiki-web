/* eslint-disable react-refresh/only-export-components */
import {type ComponentType, lazy, type LazyExoticComponent, Suspense} from 'react'
import PageLoading from "../../public/constantExport/PageLoading.tsx";
import {Navigate} from "react-router-dom";


const withSuspense = (Component: LazyExoticComponent<ComponentType>) => (
    <Suspense fallback={<PageLoading/>}>
        <Component/>
    </Suspense>
)

const MainLayout = lazy(() => import("@/page/homePages/MainPage/MainLayout.tsx"))
const HomePage = lazy(() => import("@/page/homePages/HomePage.tsx"))
const SimpleLayout = lazy(() => import("@/page/homePages/MainPage/SimpleLayout.tsx"))
const Articles = lazy(() => import("@/page/homePages/Articles/ArticlesList.tsx"))
const Notes = lazy(() => import("@/page/homePages/NotesDiary/Note/NotesList.tsx"))
const About = lazy(() => import("@/page/homePages/About/AboutPage.tsx"))


const MainPage = [
    {
        index: true,
        element: withSuspense(HomePage)
    }
];
const Article = [
    {
        index: true,
        element: withSuspense(Articles)
    }
]

const routes = [

    {
        path: "*",
        element: <Navigate to='/'/>
    }, {
        path: "/",
        element: withSuspense(MainLayout),
        children: MainPage
    }, {
        path: '/articles',
        element: withSuspense(SimpleLayout),
        children: Article
    },{
         path: '/notes',
        element: withSuspense(Notes)
    },{
         path: '/about',
        element: withSuspense(About)
    },
    {
        path: "*",
        element: <Navigate to='/' replace/>
    }

]
export default routes