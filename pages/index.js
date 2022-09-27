import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';

import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { tokenAddress, vendorAddress, tokenABI, vendorABI } from "../constants/contracts";
import { useState, useEffect } from "react";
import { ethers, utils } from "ethers";

export const injected = new InjectedConnector();

export default function Home() {
  const { active, activate, chainId, account, library: provider } = useWeb3React();

  const [hasMetamask, setHasMetamask] = useState(false);
  const [userAddress, setUserAddress] = useState('點擊錢包以啟動兌換所');
  const [ccoBuy, setCCOBuy] = useState('');
  const [ccoSell, setCCOSell] = useState('');
  const ccoLimit = 100;

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  useEffect(() => {
    if (account) {
      setUserAddress(account);
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

  async function buyTokens() {
    if (active) {
      if (!ccoBuy || ccoBuy == 0) {
        alert('格式錯誤，請重新輸入');
      } else if (ccoBuy > ccoLimit) {
        alert('單次最高交易數量為 ' + ccoLimit + ' 枚，請重新輸入');

      } else {
        const signer = provider.getSigner();
        const vendorContract = new ethers.Contract(vendorAddress, vendorABI, signer);

        try {
          await vendorContract.buyTokens({
            from: account,
            value: utils.parseEther((ccoBuy * 0.01).toString())
          });
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      alert('兌換所未啟動，請嘗試點擊錢包或下載 Metamask');
    }
  }

  async function sellTokens() {
    if (active) {
      if (!ccoSell || ccoSell == 0) {
        alert('格式錯誤，請重新輸入');
      } else if (ccoSell > ccoLimit) {
        alert('已超過最高交易數額 ' + ccoLimit + ' CCO，請重新輸入');

      } else {
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
        const vendorContract = new ethers.Contract(vendorAddress, vendorABI, signer);

        try {
          const tokenApprove = tokenContract.approve(vendorAddress, utils.parseEther(ccoSell.toString()),
            { from: account }
          );
          // Trigger the selling of tokens
          const vendorSellTokens = vendorContract.sellTokens(utils.parseEther(ccoSell.toString()),
            { from: account }
          );
          await Promise.all([tokenApprove, vendorSellTokens])

        } catch (error) {
          console.log(error);
        }
      }
    } else {
      alert('兌換所未啟動，請嘗試點擊錢包或下載 Metamask');
    }
  }


  return (
    <>
      <Head>
        <title>Café Chain</title>
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
        <link rel="stylesheet" type="text/css" href="css/styles.css" />
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
      {/* <section className="preloader"> */}
        {/* <div className="spinner"> */}
          {/* <span className="spinner-rotate" /> */}
        {/* </div> */}
      {/* </section> */}

      {/* MENU */}
      <section className="navbar custom-navbar navbar-fixed-top" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <button
              className="navbar-toggle"
              data-toggle="collapse"
              data-target=".navbar-collapse"
            >
              <span className="icon icon-bar" />
              <span className="icon icon-bar" />
              <span className="icon icon-bar" />
            </button>
            {/* lOGO TEXT HERE */}
            <a href="index.html" className="navbar-brand">
              CAFÉ CHAIN
            </a>
          </div>
          {/* MENU LINKS */}
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-nav-first">
              <li>
                <a href="#about" className="smoothScroll">
                  概念
                </a>
              </li>
              <li>
                <a href="#roadmap" className="smoothScroll">
                  未來規劃
                </a>
              </li>
              <li>
                <a href="#faqs" className="smoothScroll">
                  常見問題
                </a>
              </li>
              <li>
                <a
                  href="https://testnets.opensea.io/collection/cafechainmeet"
                  target="_blank" rel="noreferrer"
                  className="smoothScroll"
                >
                  形象NFT
                </a>
              </li>
              <li>
                <a
                  href="#"
                  data-toggle="modal"
                  data-target="#modal-form"
                  className="smoothScroll"
                >
                  兌幣所
                </a>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className="nav-r-li">
                <a href="https://discord.gg/AKc79B6Ze7" target="_blank" rel="noreferrer">
                  <i className="bi bi-discord" style={{ fontSize: "2rem" }} />
                </a>
              </li>
              <li className="nav-r-li">
                <a
                  href="https://08170129.gitbook.io/caf-chain-bai-pi-shu/cafe-chain/jian-jie"
                  target="_blank" rel="noreferrer"
                  style={{ padding: "15px 5px" }}
                >
                  <i
                    className="bi bi-layout-text-sidebar-reverse"
                    style={{ fontSize: "2rem" }}
                  />
                </a>
              </li>
              <Link href="/cafe"><li className="section-btn">
                <a>前往咖啡廳</a>
              </li></Link>
            </ul>
          </div>
        </div>
      </section>

      {/* HOME */}
      <section id="home" data-stellar-background-ratio="0.5" />

      {/* ABOUT */}
      <section id="about" data-stellar-background-ratio="0.5">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-sm-6">
              <div className="about-info">
                <div className="section-title">
                  <h2>概念</h2>
                </div>
                <p>
                  Café Chain
                  是一個建置在區塊鏈上的虛擬咖啡廳，以插畫式背景來呈現咖啡廳的環境，包含佈置、窗戶外景、食物等等，並播放咖啡廳風格的背景音樂，讓喜愛如此氛圍的使用者，可以在線上享有身歷其境般的體驗。
                </p>
                <p>
                  選擇虛擬形象進入咖啡廳，就能在 Café Chain
                  中進行對話與互動。如果想要更有趣的外型和體驗，可以上 Opensea
                  瞧瞧。代幣「Café Chain Coin(C.C.O)」
                  則能購買輕食與飲品，除了在兌幣所換取，似乎還有其他賺取和花費方式。
                </p>
                <p>Café Chain 正待前來的客人探索。</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="about-image">
                <img src="images/concept.png" className="img-responsive" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="roadmap" data-stellar-background-ratio="0.5">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="section-title">
                <h2>未來規劃</h2>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              {/* BLOG THUMB */}
              <div className="media blog-thumb">
                <div className="media-object media-left">
                  <img
                    src="https://images.unsplash.com/photo-1482350325005-eda5e677279b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGNvZmZlZSUyMHNob3B8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
                    className="img-responsive"
                    alt=""
                  />
                </div>
                <div className="media-body blog-info">
                  <h3>實體咖啡廳連動</h3>
                  <p>可以真吃的餐點與獨特氛圍環境⋯⋯想在 Café Chain 體驗哪項呢？</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              {/* BLOG THUMB */}
              <div className="media blog-thumb">
                <div className="media-object media-left">
                  <img
                    src="https://images.unsplash.com/photo-1520279406162-c955e67194ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjZ8fGNhZmUlMjBiYXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
                    className="img-responsive"
                    alt=""
                  />
                </div>
                <div className="media-body blog-info">
                  <h3>Café Chain 包廂擴建</h3>
                  <p>
                    覺得桌前的風景有些看夠了？全新的自助吧，給你 Café Chain 新視角
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              {/* BLOG THUMB */}
              <div className="media blog-thumb">
                <div className="media-object media-left">
                  <img
                    src="https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y29mZmVlJTIwY3VwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
                    className="img-responsive"
                    alt=""
                  />
                </div>
                <div className="media-body blog-info">
                  <h3>咖啡鏈・Café Chain</h3>
                  <p>整合特定主題的實體獨立咖啡廳，來 Café Chain 煮杯真咖啡！</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              {/* BLOG THUMB */}
              <div className="media blog-thumb">
                <div className="media-object media-left">
                  <img
                    src="https://images.unsplash.com/photo-1570437199255-a37f59a7d169?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTc0fHxjb2ZmZWUlMjBzaG9wfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
                    className="img-responsive"
                    alt=""
                  />
                </div>
                <div className="media-body blog-info">
                  <h3>咖啡廳變伸展台</h3>
                  <p>
                    誰說在 Café Chain 不能做自己？新蓋的更衣室讓你隨心改造角色形象
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="faqs" data-stellar-background-ratio="0.5">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="section-title">
                <h2>常見問題</h2>
              </div>
            </div>
            <div className="row work-s">
              <div className="col-md-2 col-sm-0" />
              <div className="blog-detail col-md-8 col-sm-12">
                <blockquote>如何購買形象NFT？</blockquote>
                <p>
                  可以點擊頂部選單列的「形象NFT」連結，或到 Opensea Testnet
                  搜尋「CafeChainMeet」。
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 col-sm-0" />
              <div className="blog-detail col-md-8 col-sm-12">
                <blockquote>形象NFT可以做什麼？</blockquote>
                <p>
                  成為咖啡廳的特別客人，而有些 Café Chain
                  的事只有特別的拜訪者能知道！形象NFT還有各自獨一無二的屬性。
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 col-sm-0" />
              <div className="blog-detail col-md-8 col-sm-12">
                <blockquote>我能用什麼兌換CCO？</blockquote>
                <p>
                  CCO 可以用 Ether
                  以太幣在「兌幣所」兌換，除外還有隱藏獲得方法等客人們探索！
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 col-sm-0" />
              <div className="blog-detail col-md-8 col-sm-12">
                <blockquote>Café Chain 部署在哪條鏈上？</blockquote>
                <p style={{ marginBottom: 0 }}>
                  在 Rinkeby Testnet 測試鏈上。我們還在努力成長中，歡迎支持！
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer data-stellar-background-ratio="0.5">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="copyright-text">
                <p>Copyright © 2022 Café Chain Project</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      <section
        className="modal fade"
        id="modal-form"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content modal-popup">
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <div className="modal-title row">
                      <button onClick={connect}>
                        <i
                          className="bi bi-wallet-fill"
                          style={{ fontSize: "1.5em" }}
                        />
                      </button>
                      <h2>CCO CHANGER</h2>
                      <p className="sign">
                        <span id="userData">{userAddress}</span>
                      </p>
                    </div>

                    {/* NAV TABS */}
                    <ul className="nav nav-tabs" role="tablist">
                      <li className="active"><a href="#buy" aria-controls="buy" role="tab" data-toggle="tab">
                        購買
                      </a>
                      </li>
                      <li><a href="#sell" aria-controls="sell" role="tab" data-toggle="tab">
                        賣出
                      </a>
                      </li>
                    </ul>

                    {/* TAB PANES */}
                    <div className="tab-content">
                      <div role="tabpanel" className="tab-pane fade in active" id="buy">
                        <div className="input-container">
                          <input
                            type="number"
                            className="form-control"
                            id="ccoBuy"
                            placeholder="請輸入枚數"
                            value={ccoBuy}
                            onChange={(e) => setCCOBuy(e.target.value)} />
                          <p className="icon">CCO</p>
                        </div>
                        <div className="input-container">
                          <span className="form-control ether" id="etherBuy">
                            價格
                          </span>
                          <p className="icon">ETH</p>
                        </div>
                        <button
                          type="submit"
                          className="form-control"
                          id="submitBuy"
                          onClick={buyTokens}>確認購買</button>
                      </div>

                      <div role="tabpanel" className="tab-pane fade in" id="sell">
                        <div className="input-container">
                          <input
                            type="number"
                            className="form-control"
                            id="ccoSell"
                            placeholder="請輸入枚數"
                            value={ccoSell}
                            onChange={(e) => setCCOSell(e.target.value)} />
                          <p className="icon">CCO</p>
                        </div>
                        <div className="input-container">
                          <span className="form-control ether" id="etherSell">
                            價格
                          </span>
                          <p className="icon">ETH</p>
                        </div>
                        <button
                          type="submit"
                          className="form-control"
                          id="submitSell"
                          onClick={sellTokens}>確認賣出</button>
                      </div>
                      <a href="#" data-dismiss="modal" aria-label="Close">
                        <i
                          className="bi bi-x-circle"
                          style={{ color: "#aaa", fontSize: "1.7em" }}
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <Script src="js/utils.js"></Script>
      <Script src="js/bootstrap.min.js"></Script>
      <Script src="js/smoothscroll.js"></Script>
      <Script src="js/custom.js"></Script>
    </>
  );
}
