import Home from "@/page/homePages/Home/Home.tsx";
import StatsBanner from "@/page/homePages/StatsBanner/StatsBanner.tsx";
import NotesDiary from "@/page/homePages/NotesDiary/NotesDiary.tsx";

const HomePage: React.FC = () => {
    return (
        <>
            <Home />
            <StatsBanner />
            <NotesDiary />
        </>
    );
};

export default HomePage;