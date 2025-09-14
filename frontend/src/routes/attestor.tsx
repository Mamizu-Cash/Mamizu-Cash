import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle, FileUp, Key, Shield } from 'lucide-react'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useBusinessVerifier } from '../hooks/useBusinessVerifier'
import {
  type CredentialInfo,
  generateMockHash,
  simulateProcessingDelay,
} from '../lib/mockCredentials'
import { KAIGAN_EXPLORER_URL } from '../lib/web3/contracts'

export const Route = createFileRoute('/attestor')({
  component: AttestorScreen,
})

type Step = 'upload' | 'proof' | 'verify'

function AttestorScreen() {
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [credential, setCredential] = useState<CredentialInfo | null>(null)
  const [emlFile, setEmlFile] = useState<File | null>(null)
  const [zkProof, setZkProof] = useState<string | null>(null)

  // Wallet and BusinessVerifier integration
  const { address: userAddress, isConnected } = useAccount()
  const {
    isEligible,
    computedTokenId,
    stampWithData,
    isStampWithDataPending,
    stampWithDataTxHash,
    stampWithDataError,
    refetchIsEligible,
    refetchComputedTokenId,
  } = useBusinessVerifier()

  const handleEmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file?.name.endsWith('.eml')) {
      setEmlFile(file)
    }
  }

  const handleProofGeneration = async () => {
    setIsProcessing(true)
    setCurrentStep('proof')

    await simulateProcessingDelay(2000)

    // Mock ZK proof generation
    const mockProof = generateMockHash()
    setZkProof(mockProof)
    setIsProcessing(false)
    setCurrentStep('verify')
  }

  const handleVerification = async () => {
    if (!isConnected || !userAddress) {
      alert('ウォレットを接続してください')
      return
    }

    if (isEligible) {
      alert('既にUNTIトークンを保有しています。重複発行はできません。')
      return
    }

    if (!zkProof) {
      alert('ZK Proofが生成されていません')
      return
    }

    try {
      setIsProcessing(true)

      // Convert zkProof to hex bytes for contract call
      const zkProofHex = zkProof.startsWith('0x') ? zkProof : `0x${zkProof}`

      // Call BusinessVerifier.stamp(data) with ZK proof
      await stampWithData(zkProofHex as `0x${string}`)

      // Wait for transaction confirmation is handled by the hook
      // After successful transaction, refetch data and create credential
      await refetchIsEligible()
      await refetchComputedTokenId()

      const newCredential: CredentialInfo = {
        type: 'unti',
        issuedAt: Date.now(),
        transactionHash: stampWithDataTxHash ?? '0x...',
        tokenId: computedTokenId?.toString() ?? '0',
        userInfo: {
          companyName: 'Verified Company', // Could be extracted from DKIM data
          email: 'company@example.com', // Could be extracted from DKIM data
        },
      }

      setCredential(newCredential)
      setIsProcessing(false)
    } catch (error) {
      console.error('Verification failed:', error)
      alert('検証に失敗しました。詳細はコンソールをご確認ください。')
      setIsProcessing(false)
    }
  }

  const steps = [
    { key: 'upload', label: 'EMLアップロード', icon: FileUp },
    { key: 'proof', label: 'ZK Proof生成', icon: Key },
    { key: 'verify', label: '検証&発行', icon: CheckCircle },
  ]

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.key === currentStep)
  }

  return (
    <div
      className="main-container"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '1rem',
      }}
    >
      <div
        className="main-card"
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '0.5rem',
            }}
          >
            管理画面
          </h1>
          <p
            style={{
              color: '#64748b',
              fontSize: '1.1rem',
              lineHeight: '1.6',
            }}
          >
            オペレータまたはロボットは、EMLを検証してください。
          </p>
        </div>

        {/* Progress Steps */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '3rem',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {steps.map((step, index) => {
            const currentIndex = getCurrentStepIndex()
            const isActive = step.key === currentStep
            const isCompleted = index < currentIndex

            return (
              <div
                key={step.key}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      backgroundColor: isCompleted
                        ? '#0ea5e9'
                        : isActive
                          ? '#0ea5e9'
                          : '#e2e8f0',
                      borderRadius: '50%',
                      color: isCompleted || isActive ? 'white' : '#64748b',
                    }}
                  >
                    <step.icon size={24} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: isCompleted || isActive ? '#1e293b' : '#64748b',
                      fontWeight: isActive ? '600' : 'normal',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    style={{
                      width: '30px',
                      height: '2px',
                      backgroundColor: isCompleted ? '#0ea5e9' : '#e2e8f0',
                      marginTop: '-24px',
                      marginLeft: '0.5rem',
                      marginRight: '0.5rem',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* EML Upload Step */}
        {currentStep === 'upload' && (
          <div>
            <div
              style={{
                backgroundColor: '#f0f9ff',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '1px solid #0ea5e9',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  margin: '0 0 1.5rem 0',
                  color: '#0c4a6e',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                }}
              >
                送信したメールのEMLファイルをダウンロードして、こちらにアップロードしてください。
                <br />
                EMLファイルからDKIM署名を抽出してゼロ知識証明を生成します。
              </p>

              <div
                style={{
                  border: '2px dashed #0ea5e9',
                  borderRadius: '8px',
                  padding: '2rem',
                  marginBottom: '1rem',
                  backgroundColor: 'white',
                }}
              >
                <input
                  type="file"
                  accept=".eml"
                  onChange={handleEmlUpload}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    fontSize: '1rem',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                />
                {emlFile && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      backgroundColor: '#dcfce7',
                      borderRadius: '6px',
                      border: '1px solid #16a34a',
                    }}
                  >
                    <span style={{ color: '#166534', fontSize: '0.9rem' }}>
                      ✓ {emlFile.name} ({(emlFile.size / 1024).toFixed(1)}KB)
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleProofGeneration}
                disabled={!emlFile}
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  backgroundColor: !emlFile ? '#94a3b8' : '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: !emlFile ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Key size={20} />
                リレー稼働
              </button>
            </div>
          </div>
        )}

        {/* ZK Proof Generation Step */}
        {currentStep === 'proof' && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                border: '4px solid #e2e8f0',
                borderTop: '4px solid #f59e0b',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '2rem auto',
              }}
            />
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '1rem',
              }}
            >
              ZK Proof生成中...
            </h2>
            <p
              style={{
                color: '#64748b',
                fontSize: '1rem',
                marginBottom: '2rem',
              }}
            >
              EMLファイルからDKIM署名を抽出してゼロ知識証明を生成しています
            </p>

            <div
              style={{
                backgroundColor: '#fffbeb',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #fed7aa',
                textAlign: 'left',
              }}
            >
              <p
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.9rem',
                  color: '#92400e',
                  fontWeight: '500',
                }}
              >
                処理中...
              </p>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#a16207',
                  lineHeight: '1.4',
                }}
              >
                • EMLファイルを解析中
                <br />• DKIM署名を抽出中
                <br />• RSA署名を検証中
                <br />• ゼロ知識証明を生成中
              </div>
            </div>

            {zkProof && (
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 0.5rem 0',
                    color: '#14532d',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                >
                  ✓ ZK Proof生成完了
                </h3>
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #bbf7d0',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: '#059669',
                    wordBreak: 'break-all',
                  }}
                >
                  {zkProof.slice(0, 32)}...{zkProof.slice(-32)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verification & Issuance Step */}
        {currentStep === 'verify' && (
          <div>
            {!credential ? (
              // Pre-verification state
              <div
                style={{
                  backgroundColor: '#fefce8',
                  padding: '2rem',
                  borderRadius: '12px',
                  marginBottom: '2rem',
                  border: '1px solid #facc15',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#facc15',
                    borderRadius: '50%',
                    marginBottom: '1rem',
                  }}
                >
                  <Shield size={30} color="#1e293b" />
                </div>
                <h3
                  style={{
                    margin: '0 0 1rem 0',
                    color: '#1e293b',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                  }}
                >
                  {isProcessing ? '検証中...' : 'オンチェーン検証&UNTI発行'}
                </h3>

                {zkProof && (
                  <div
                    style={{
                      backgroundColor: 'white',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1.5rem',
                      border: '1px solid #facc15',
                    }}
                  >
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.9rem',
                          color: '#ca8a04',
                          fontWeight: '500',
                        }}
                      >
                        生成されたZK Proof:
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        color: '#059669',
                        wordBreak: 'break-all',
                        backgroundColor: '#f8fafc',
                        padding: '0.5rem',
                        borderRadius: '4px',
                      }}
                    >
                      {zkProof}
                    </div>
                  </div>
                )}

                <p
                  style={{
                    margin: '0 0 1.5rem 0',
                    color: '#ca8a04',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                  }}
                >
                  {isProcessing
                    ? 'スマートコントラクトで検証中です。検証成功後、UNTIトークンが自動発行されます。'
                    : 'スマートコントラクトにProofを送信して、DKIM署名の正当性を検証します。検証が成功すると、UNTIトークンが発行されます。'}
                </p>

                {(isProcessing || isStampWithDataPending) && (
                  <div
                    style={{
                      backgroundColor: '#fffbeb',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #fed7aa',
                      textAlign: 'left',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#a16207',
                        lineHeight: '1.4',
                      }}
                    >
                      • ZK Proofを送信中
                      <br />• スマートコントラクトで検証中
                      <br />• DKIM署名の正当性を確認中
                      <br />• UNTIトークンを発行中
                    </div>
                  </div>
                )}

                {stampWithDataError && (
                  <div
                    style={{
                      backgroundColor: '#fef2f2',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #fecaca',
                      textAlign: 'left',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#dc2626',
                        lineHeight: '1.4',
                      }}
                    >
                      <strong>エラー:</strong> トランザクションが失敗しました。
                      <br />
                      {stampWithDataError.message}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleVerification}
                  disabled={
                    isProcessing ||
                    isStampWithDataPending ||
                    !isConnected ||
                    !!isEligible
                  }
                  style={{
                    width: '100%',
                    padding: '1rem 2rem',
                    backgroundColor:
                      isProcessing || isStampWithDataPending
                        ? '#94a3b8'
                        : !isConnected || !!isEligible
                          ? '#e2e8f0'
                          : '#facc15',
                    color: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor:
                      isProcessing ||
                      isStampWithDataPending ||
                      !isConnected ||
                      !!isEligible
                        ? 'not-allowed'
                        : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {isProcessing || isStampWithDataPending ? (
                    <>
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #1e293b',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                      検証&発行中...
                    </>
                  ) : !isConnected ? (
                    <>
                      <Shield size={20} />
                      ウォレットを接続してください
                    </>
                  ) : isEligible ? (
                    <>
                      <CheckCircle size={20} />
                      既にUNTI発行済み
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      検証してUNTI発行
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Post-verification success state
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    marginBottom: '2rem',
                  }}
                >
                  <CheckCircle size={60} color="white" />
                </div>

                <h2
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    marginBottom: '1rem',
                  }}
                >
                  UNTI発行完了！
                </h2>

                <p
                  style={{
                    color: '#64748b',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    marginBottom: '2rem',
                  }}
                >
                  企業向けUNTI (ERC-6268) が正常に発行されました
                </p>

                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    border: '1px solid #bbf7d0',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span style={{ color: '#166534', fontWeight: '500' }}>
                      UNTIトークンID:
                    </span>
                    <span style={{ fontFamily: 'monospace', color: '#14532d' }}>
                      {credential.tokenId}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span style={{ color: '#166534', fontWeight: '500' }}>
                      企業名:
                    </span>
                    <span style={{ color: '#14532d' }}>
                      {credential.userInfo?.companyName}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span style={{ color: '#166534', fontWeight: '500' }}>
                      トランザクション:
                    </span>
                    <a
                      href={`${KAIGAN_EXPLORER_URL}/tx/${credential.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        color: '#059669',
                        textDecoration: 'underline',
                      }}
                    >
                      {credential.transactionHash?.slice(0, 10)}...
                      {credential.transactionHash?.slice(-8)}
                    </a>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ color: '#166534', fontWeight: '500' }}>
                      発行日時:
                    </span>
                    <span style={{ color: '#14532d' }}>
                      {new Date(credential.issuedAt).toLocaleString('ja-JP')}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#eff6ff',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    border: '1px solid #dbeafe',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      color: '#1e40af',
                      lineHeight: '1.5',
                    }}
                  >
                    <strong>おめでとうございます！</strong> 企業としてMamizu
                    Cashのプライベート送金機能を利用できます。
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <a
                    href="/withdraw"
                    style={{
                      padding: '1rem 2rem',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    送金を受け取る
                  </a>
                  <a
                    href="/"
                    style={{
                      padding: '1rem 2rem',
                      backgroundColor: 'white',
                      color: '#8b5cf6',
                      textDecoration: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      border: '2px solid #8b5cf6',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    ホームに戻る
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .main-container {
            padding: 0.5rem !important;
          }
          .main-card {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  )
}
