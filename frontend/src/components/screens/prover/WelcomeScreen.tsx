import { useState } from "react";
import logoWide from "../../../assets/logo-wide.svg";
import { Avatar, Background, Badge, Button, Panel, Text } from "../../ui/index";
import commonStyles from "../CommonScreenStyles.module.css";
import styles from "./WelcomeScreen.module.css";

export type ProverRole = "BRIDE" | "GROOM";

export type WelcomeScreenProps = {
  role?: ProverRole;
  onRegister?: (role: ProverRole) => Promise<void>;
};

export function WelcomeScreen(props: WelcomeScreenProps) {
  const { role, onRegister } = props;

  const [selectedRole, setSelectedRole] = useState<ProverRole | null>(role || null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRoleSelect = (newRole: ProverRole) => {
    setSelectedRole(newRole);
  };

  const handleRegister = async () => {
    if (!selectedRole) {
      alert("役割を選択してください");
      return;
    }

    setIsRegistering(true);

    try {
      await onRegister?.(selectedRole);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("登録に失敗しました。もう一度お試しください。");
    } finally {
      setIsRegistering(false);
    }
  };

  const getRoleDisplayName = (role: ProverRole) => {
    return role === "BRIDE" ? "新婦" : "新郎";
  };

  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <Background />
      <div className={`${commonStyles.mainContainer} ${styles.mainContainer}`}>
        <Panel size="medium" className={`${commonStyles.panel} ${styles.panel}`}>
          {/* Header Section */}
          <header className={`${commonStyles.header} ${styles.header}`}>
            <div className={styles.brandGroup}>
              <img src={logoWide} alt="ビット婚姻" className={styles.brandLogo} />
            </div>
            <div className={styles.welcomeSection}>
              <Text
                variant="h2"
                color="primary"
                align="center"
                weight="semibold"
                className={styles.welcomeTitle}
              >
                永遠の誓いへようこそ
              </Text>
              <Text
                variant="bodyLarge"
                color="secondary"
                align="center"
                className={styles.welcomeMessage}
              >
                ブロックチェーン技術により、
                <br />
                あなたの愛の誓いを永遠に記録します
              </Text>
            </div>
          </header>

          {/* Main Content - Role Selection */}
          <main className={styles.mainContent}>
            <section className={styles.roleSelection}>
              <Text
                variant="label"
                color="primary"
                weight="semibold"
                align="center"
                className={styles.sectionTitle}
              >
                あなたの役割を選択してください
              </Text>

              <div className={styles.roleButtons}>
                <button
                  type="button"
                  onClick={() => handleRoleSelect("BRIDE")}
                  className={`${styles.roleButton} ${
                    selectedRole === "BRIDE" ? styles.selected : ""
                  }`}
                  disabled={role !== undefined}
                >
                  <Avatar size="huge" variant={selectedRole === "BRIDE" ? "accent" : "secondary"}>
                    👰
                  </Avatar>
                  <Text
                    variant="h4"
                    color={selectedRole === "BRIDE" ? "accent" : "secondary"}
                    weight="semibold"
                    align="center"
                  >
                    新婦
                  </Text>
                  {selectedRole === "BRIDE" && (
                    <Badge variant="accent" size="small">
                      選択中
                    </Badge>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect("GROOM")}
                  className={`${styles.roleButton} ${
                    selectedRole === "GROOM" ? styles.selected : ""
                  }`}
                  disabled={role !== undefined}
                >
                  <Avatar size="huge" variant={selectedRole === "GROOM" ? "primary" : "secondary"}>
                    🤵
                  </Avatar>
                  <Text
                    variant="h4"
                    color={selectedRole === "GROOM" ? "info" : "secondary"}
                    weight="semibold"
                    align="center"
                  >
                    新郎
                  </Text>
                  {selectedRole === "GROOM" && (
                    <Badge variant="primary" size="small">
                      選択中
                    </Badge>
                  )}
                </button>
              </div>
            </section>

            {/* Action Button */}
            <section className={styles.actionSection}>
              <Button
                type="button"
                variant="primary"
                size="large"
                loading={isRegistering}
                disabled={!selectedRole || isRegistering}
                onClick={handleRegister}
                className={styles.registerButton}
              >
                {isRegistering
                  ? "登録中..."
                  : selectedRole
                    ? `${getRoleDisplayName(selectedRole)}として参加する`
                    : "役割を選択してください"}
              </Button>
            </section>
          </main>

          {/* Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <Text variant="caption" color="tertiary" align="center">
                ブロックチェーン技術による永続的な記録
              </Text>
              <Text variant="caption" color="brand" align="center" weight="medium">
                Powered by AokiApp Inc.
              </Text>
            </div>
          </footer>
        </Panel>
      </div>
    </div>
  );
}
