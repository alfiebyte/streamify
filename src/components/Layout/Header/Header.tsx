import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

interface NavItemProps {
    text: string;
    logo: string;
    href: string;
}

function NavItem({ text, logo, href }: NavItemProps) {
    const { pathname } = useLocation();
    const isActive = pathname === href;
    return (
        <div className={`item ${isActive ? "active" : ""}`}>
            {" "}
            <img src={logo} /> <span>{text}</span> <div className="backdrop" />
        </div>
    );
}

function useScrolled() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 0);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return scrolled;
}

interface LayoutProps {}

function LayoutHeader({}: LayoutProps) {
    const scrolled = useScrolled();

    return (
        <div className="header">
            <div className="fade" style={{ opacity: scrolled ? 1 : 0 }} />
            <div className="left">
                <img className="logo" src={ExampleLogo} />
                <div className="navigation">
                    <NavItem text="Home" logo={HomeLogo} href="/" />
                    <NavItem text="Movies" logo={MovieLogo} href="/movies" />
                    <NavItem text="Series" logo={TVLogo} href="/series" />
                </div>
            </div>
            <div className="right">
                <div className="profile">
                    <span className="name">OnlyTwentyCharacters</span>
                    <img className="pfp" src={ProfilePicturePlaceHolder} />
                </div>
            </div>
        </div>
    );
}

export default LayoutHeader;
