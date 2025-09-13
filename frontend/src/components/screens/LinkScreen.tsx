import { Panel, Button, Text, QrCode, Input, CopyButton } from '../ui/index'
import styles from './LinkScreen.module.css'
import { Bitcoin, Coins, Wallet, JapaneseYen, X } from 'lucide-react'
import React, { useRef } from 'react'

const links = [
  {
    label: 'Ethereum (EVM)',
    url: '0x69E105C10E3fA13bF4605EF188d9F99B3C974e37',
    icon: <Wallet size={40} strokeWidth={2.5} />,
    colorClass: styles.evmButton,
    large: true,
    canGetNft: true,
    tokens: ['ETH', 'USDC', "JPYC Prepaid", "POL", "BNB" ],
  },
  {
    label: 'Solana',
    url: '8Ux2WBnkvSyrfWVTQDifxUMFQESkNacm7jTfDYKZ5AYc',
    icon: <Coins size={28} strokeWidth={2.2} />,
    colorClass: styles.solanaButton,
    canGetNft: false,
    tokens: ['SOL', 'USDC', "BONK", "JUP"],
  },
  {
    label: 'Bitcoin',
    url: 'bc1q6md7l0z3rk3fyq5ppkvuk8zgenp0eysma0mtd0',
    icon: <Bitcoin size={28} strokeWidth={2.2} />,
    colorClass: styles.bitcoinButton,
    canGetNft: false,
    tokens: ['BTC'],
  },
  {
    label: 'Litecoin',
    url: 'ltc1ql3h8valnnkeulf3jx5r0yt06f9el8l5cldmkcc',
    icon: <Coins size={28} strokeWidth={2.2} />,
    colorClass: styles.litecoinButton,
    canGetNft: false,
    tokens: ['LTC'],
  },
  {
    label: 'XRP Ledger',
    url: 'rGhKyeLo887d5EZ7fZHbZVXGaz7UpTUcT5',
    icon: <X size={28} strokeWidth={2.2} />,
    colorClass: styles.xrpButton,
    canGetNft: false,
    tokens: ['XRP'],
  },
  {
    label: 'PayPay',
    url: 'https://qr.paypay.ne.jp/p2p01_sj6mXjUK4HgpvH74',
    icon: <JapaneseYen size={28} strokeWidth={2.2} />,
    colorClass: styles.paypayButton,
    canGetNft: false,
    tokens: ['日本円'],
  }
]

export function LinkScreen() {
  const nftLinks = links.filter((link) => link.canGetNft)
  const otherLinks = links.filter((link) => !link.canGetNft)
  const dialogRefs = useRef<{ [key: string]: HTMLDialogElement | null }>({})

  const openModal = (linkKey: string) => {
    dialogRefs.current[linkKey]?.showModal()
  }

  const closeModal = (linkKey: string) => {
    dialogRefs.current[linkKey]?.close()
  }

  const ModalContent = ({ link }: { link: (typeof links)[0] }) => {
    const linkKey = link.url + link.label

    return (
      <dialog
        ref={(el) => {
          dialogRefs.current[linkKey] = el
        }}
        className={styles.modal}
        onClick={(e) => {
          if (e.target === dialogRefs.current[linkKey]) {
            closeModal(linkKey)
          }
        }}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <Text variant="h2" color="primary" weight="bold">
              {link.label}
            </Text>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.qrCodeSection}>
              <div className={styles.qrCodeContainer}>
                <QrCode text={link.url} />
              </div>
            </div>

            <div className={styles.urlSection}>
              <div className={styles.urlContainer}>
                <Input value={link.url} readOnly className={styles.urlInput} />
                <CopyButton
                  textToCopy={link.url}
                  className={styles.copyButton}
                />
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => closeModal(linkKey)}
              className={styles.closeButton}
            >
              閉じる
            </Button>
          </div>
        </div>
      </dialog>
    )
  }

  return (
    <div className={styles.linkScreenContainer}>
      <Panel size="medium">
        <header className={styles.linkScreenTitle}>
          <Text variant="h1" color="primary" align="center" weight="bold">
            ご祝儀送金リンク集
          </Text>
        </header>
        <main className={styles.linkScreenMain}>
          {/* NFT-eligible payment options */}
          {nftLinks.map((link) => (
            <React.Fragment key={link.url + link.label}>
              <Button
                variant="primary"
                size={link.large ? 'large' : 'large'}
                className={`${styles.linkScreenButton} ${link.colorClass} ${link.large ? styles.evmLargeButton : ''}`}
                onClick={() => openModal(link.url + link.label)}
              >
                <span className={styles.linkScreenIcon}>{link.icon}</span>
                <span>
                  {link.label}
                  {link.tokens && link.tokens.length > 0 && (
                    <span className={styles.tokenList}>
                      <br />
                      <span>{link.tokens.join(', ')}</span>
                    </span>
                  )}
                </span>
              </Button>
              <ModalContent link={link} />
            </React.Fragment>
          ))}
          {/* NFT note directly below EVM */}
          <div className={styles.evmNote}>
            EVM（Ethereum等）で送金すると後日NFTを獲得できます。
            <br />
            EVM以外の送金ではNFTは獲得できません。
          </div>
          {/* Other payment options */}
          {otherLinks.map((link) => (
            <React.Fragment key={link.url + link.label}>
              <Button
                variant="primary"
                size="large"
                className={`${styles.linkScreenButton} ${link.colorClass}`}
                onClick={() => openModal(link.url + link.label)}
              >
                <span className={styles.linkScreenIcon}>{link.icon}</span>
                <span>
                  {link.label}
                  {link.tokens && link.tokens.length > 0 && (
                    <span className={styles.tokenList}>
                      <br />
                      <span>{link.tokens.join(', ')}</span>
                    </span>
                  )}
                </span>
              </Button>
              <ModalContent link={link} />
            </React.Fragment>
          ))}
        </main>
        <footer className={styles.linkScreenFooter}>ビット婚姻</footer>
      </Panel>
    </div>
  )
}
