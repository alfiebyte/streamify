import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

import {
    nav
} from "src/assets";
import CircleButton from "src/components/CircleButton/CircleButton";

import { useAuth } from "src/context/AuthContext";

import "src/layout/Header/Header.css";

interface NavItemProps {
    text: string;
    logo: string;
    href: string;
}

function NavItem({ text, logo, href }: NavItemProps) {
    const { pathname } = useLocation();
    const isActive = pathname === href;
    return (
        <Link to={href}>
            <div className={`item ${isActive ? "active" : ""}`}>
                {" "}
                <img src={logo} /> <span>{text}</span>{" "}
                <div className="backdrop" />
            </div>
        </Link>
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

function Profile() {
    const { session, loading, signInWithGoogle, signOut } = useAuth();

    const user = session?.user

    if (loading) return <div className="profile" />;

    if (!user) {
        return (
            <div className="profile">
                <CircleButton
                    Action="Sign in with Google"
                    OnClick={signInWithGoogle}
                    Style={{ height: 42 }}
                />
            </div>
        );
    }

    const name = user.user_metadata.full_name ?? user.email ?? "";
    const avatar = user.user_metadata.avatar_url ?? nav.defaultPfp;

    return (
        <div className="profile">
            <span className="name">{name.slice(0, 20)}</span>
            <img
                className="pfp"
                src={avatar}
                onError={(element) => {
                    element.currentTarget.src = nav.defaultPfp
                }}
            />
            <CircleButton
                Action="Log out"
                OnClick={signOut}
                Style={{ height: 42, marginLeft: 10 }}
            />
        </div>
    );
}

interface LayoutProps {}

function LayoutHeader({}: LayoutProps) {
    const scrolled = useScrolled();

    return (
        <div className="header">
            <div className="fade" style={{ opacity: scrolled ? 1 : 0 }} />
            <div className="left">
                <Link to="/" className="logo">
                    Streamify
                </Link>
                <div className="navigation">
                    <NavItem text="Home" logo={nav.home} href="/" />
                    <NavItem text="Movies" logo={nav.movie} href="/movies" />
                    <NavItem
                        text="Series"
                        logo={nav.tvSeries}
                        href="/series"
                    />
                </div>
            </div>
            <div className="right">
                <Profile />
            </div>
        </div>
    );
}

export default LayoutHeader;
