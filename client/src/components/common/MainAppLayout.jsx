import Sidebar from './Sidebar'
import Navbar from './Navbar'

const MainAppLayout = ({ content }) => {

    return (
        <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">

            <div className="flex h-screen w-screen">

                <Sidebar />

                <div className="flex flex-col flex-1">

                    <Navbar />

                    <div className="flex-1 flex justify-center overflow-y-scroll">

                        {content}

                    </div>

                </div>

            </div>
            
        </div>
    )
};

export default MainAppLayout;
