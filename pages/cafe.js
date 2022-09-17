import Head from 'next/head';
import Script from 'next/script';
import { motion } from 'framer-motion';

import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { nftAddress, nftABI } from "../constants/contracts";
import { useState, useEffect } from "react";
import { ethers, utils } from "ethers";

export const injected = new InjectedConnector();

export default function Cafe() {
    const { active, activate, chainId, account, library: provider } = useWeb3React();

    const [hasMetamask, setHasMetamask] = useState(false);

    const [getNft, setGetNft] = useState(false);
    const [myNft, setMyNft] = useState('');

    const [character, setCharacter] = useState(false);
    const [privateRoom, setPrivateRoom] = useState(false);
    const [start, setStart] = useState(false);

    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            setHasMetamask(true);
        }
    });

    useEffect(() => {
        if (active) {
            loadNft();
        }
    });

    async function connect() {
        if (typeof window.ethereum !== "undefined") {
            try {
                await activate(injected);
                setHasMetamask(true);
            } catch (e) {
                console.log(e);
            }
        } else {
            alert('請下載 Metamask');
        }
    }

    async function loadNft() {
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(nftAddress, nftABI, signer);

        const nftId = await nftContract.tokenOfOwnerByIndex(account, 0,
            { from: account }
        );

        setMyNft('/images/nft/' + nftId.toString() + '.jpg');
        setGetNft(true);
    }


    return (
        <>
            <Head>
                <title>Join Café</title>
                <meta charSet="UTF-8" />
                <meta name="keywords" content="cafe" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1"
                />
                <link
                    rel="icon"
                    href="https://cdn-icons-png.flaticon.com/512/6576/6576323.png"
                />
                <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="css/magnific-popup.css" />
                <link rel="stylesheet" type="text/css" href="css/cafe.css" />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css"
                />
            </Head>

            <Script src="js/jquery.js"></Script>
            <Script src="js/jquery.stellar.min.js"></Script>
            <Script src="js/jquery.magnific-popup.min.js"></Script>

            {/* PRE LOADER */}
            <section className="preloader">
                <div className="spinner">
                    <span className="spinner-rotate" />
                </div>
            </section>

            {/* BLOCK */}
            <section className="container block">
                <motion.div initial='hidden' animate='visible' variants={{
                    hidden: {
                        opacity: 0
                    },
                    visible: {
                        opacity: 1,
                        transition: {
                            delay: .4
                        }
                    }
                }}>
                    <h5>Welcome to CAFÉ CHAIN.</h5>
                    <div className='block-box'>
                        <button className="col-sm-6" onClick={connect}>
                            <i
                                className="bi bi-door-closed-fill"
                                style={{ fontSize: "7em", color: "#fff" }}
                            />
                        </button>
                    </div>
                </motion.div>


                {getNft ?
                    <motion.div initial='hidden' animate='visible' variants={{
                        hidden: {
                            opacity: 0
                        },
                        visible: {
                            opacity: 1,
                            transition: {
                                delay: .4
                            }
                        }
                    }}>
                        <div className="select">
                            <h5>Select your character.</h5>
                            <div className='col-sm-12'>
                                <button className="cha" onClick={() => setCharacter(true)}
                                    style={{ background: `url(${myNft}) no-repeat center center`, backgroundSize: "cover" }} >
                                    <h5> </h5>
                                </button>
                                <button className="cha" onClick={() => setCharacter(true)}>
                                    <h5>DEFAULT</h5>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                    : ""}


                {character ?
                    <motion.div initial='hidden' animate='visible' variants={{
                        hidden: {
                            opacity: 0
                        },
                        visible: {
                            opacity: 1,
                            transition: {
                                delay: .4
                            }
                        }
                    }}>
                        <div className="select">
                            <h5>Private Room</h5>
                            <div className='col-sm-12'>
                                <button className="cha" onClick={() => setPrivateRoom(true)}>
                                    <h5>CREATE</h5>
                                </button>
                                <button className="cha room" onClick={() => setPrivateRoom(true)}>
                                    <h5>INVITATION</h5>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                    : ""}

                {privateRoom ?
                    <motion.div initial='hidden' animate='visible' variants={{
                        hidden: {
                            opacity: 0
                        },
                        visible: {
                            opacity: 1,
                            transition: {
                                delay: .4
                            }
                        }
                    }}>
                        <div className="select">
                            <h5>Which Café?</h5>
                            <img src='images/home-bg-s.png' className='img'></img>
                            <div className='switchBox'>
                                <button className='switchImg'>
                                    <i className="bi bi-caret-left-fill"
                                        style={{ fontSize: "1.8em" }}></i>
                                </button>
                                <button className='switchImg-p' onClick={() => setStart(true)}>
                                    <i className="bi bi-check2-circle" style={{ fontSize: "1.8em" }}></i>
                                </button>
                                <button className='switchImg'>
                                    <i className="bi bi-caret-right-fill"
                                        style={{ fontSize: "1.8em" }}></i>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                    : ""}

                {start ?
                    <motion.div initial='hidden' animate='visible' variants={{
                        hidden: {
                            opacity: 0
                        },
                        visible: {
                            opacity: 1,
                            transition: {
                                delay: 1
                            }
                        }
                    }}>

                        <div className='select'></div>

                    </motion.div>
                    : ""}


            </section>

            <Script src="js/utils.js"></Script>
            <Script src="js/bootstrap.min.js"></Script>
            <Script src="js/smoothscroll.js"></Script>
            <Script src="js/custom.js"></Script>
        </>
    )
}