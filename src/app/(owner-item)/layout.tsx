import Footer from "../components/Footer"
import OwnerNavbar from "./owner-components/OwnerNavbar"

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>
        <div className="flex min-h-screen  md:flex-row md:overflow-hidden">
            <div className="flex-grow p-0 md:overflow-y-auto md:p-0">
                <OwnerNavbar />
                {children}
                <Footer />
            </div>
        </div>

    </section>

}