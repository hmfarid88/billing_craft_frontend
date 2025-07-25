"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { FcDataSheet } from "react-icons/fc";
import { useAppSelector } from "../store";

const Logo = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [imgError, setImgError] = useState(false);
    const [logoLink, setLogoLink] = useState("")
    useEffect(() => {
        fetch(`${apiBaseUrl}/smsapi/sms/getLogo?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setLogoLink(data.link);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, [apiBaseUrl, username]);
    return (
        <figure style={{ width: "96px", height: "72px" }}>
            {!imgError && logoLink ? (
                <Image
                    src={logoLink}
                    alt="Logo"
                    width={96}
                    height={72}
                    style={{ width: "96px", height: "72px", objectFit: "contain" }}
                    onError={() => setImgError(true)}
                />
            ) : (
                <FcDataSheet size={50} />
            )}
        </figure>
    );
};

export default Logo;
