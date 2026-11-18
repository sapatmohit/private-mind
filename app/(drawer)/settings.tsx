import { useTranslation } from 'react-i18next';
import React, { useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { router, useRouter } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import Toast from 'react-native-toast-message';
import useDefaultHeader from '../../hooks/useDefaultHeader';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingsToggleRow } from '../../components/settings/SettingsToggleRow';
import { SettingsChoiceRow } from '../../components/settings/SettingsChoiceRow';
import { GlassScrollEdge } from '../../components/chat-screen/GlassScrollEdge';
import EditIcon from '../../assets/icons/edit.svg';
import InfoCircleIcon from '../../assets/icons/info-circle.svg';
import BenchmarkIcon from '../../assets/icons/benchmark.svg';
import DownloadIcon from '../../assets/icons/download.svg';
import TrashIcon from '../../assets/icons/trash.svg';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useConfirm } from '../../hooks/useConfirm';
import { useImportChat } from '../../hooks/useImportChat';
import { useVectorStore } from '../../context/VectorStoreContext';
import { useChatStore } from '../../store/chatStore';
import { useLLMStore } from '../../store/llmStore';
import {
  type ThemePreference,
  useSettingsStore,
} from '../../store/settingsStore';
import { Feedback } from '../../utils/Feedback';
import { Theme } from '../../styles/colors';
import { space } from '../../constants/design-system';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const SettingsScreen = () => {
  const { t } = useTranslation();
  useDefaultHeader({ glass: true });
  const navigation = useRouter();
  const headerHeight = useHeaderHeight();
  const { styles } = useThemedStyles(createStyles, headerHeight);
  const showPerformanceMetrics = useSettingsStore(
    (state) => state.showPerformanceMetrics
  );
  const setShowPerformanceMetrics = useSettingsStore(
    (state) => state.setShowPerformanceMetrics
  );
  const themePreference = useSettingsStore((state) => state.themePreference);
  const setThemePreference = useSettingsStore(
    (state) => state.setThemePreference
  );
  const deleteAllChats = useChatStore((state) => state.deleteAllChats);
  const { vectorStore } = useVectorStore();
  const { confirm, ConfirmElement } = useConfirm();
  const importChat = useImportChat();

  const handleDeleteAllChats = useCallback(async () => {
    const confirmed = await confirm({
      title: t('settings.deleteAllChats'),
      message: t('settings.thisPermanentlyRemovesEveryChat'),
      confirmLabel: t('settings.delete'),
    });
    if (!confirmed) return;

    try {
      const llm = useLLMStore.getState();
      llm.interrupt();
      await llm.setActiveChatId(null);
      await deleteAllChats(vectorStore ?? undefined);
      Feedback.destructive();
      Toast.show({
        type: 'defaultToast',
        text1: t('settings.allChatsDeleted'),
      });
      router.replace('/');
    } catch (error) {
      console.error('Error deleting all chats:', error);
      Alert.alert(t('settings.error'), t('settings.failedToDeleteChatsPlease'));
    }
  }, [confirm, deleteAllChats, vectorStore, t]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection title={t('settings.personalization')}>
          <SettingsRow
            label={t('settings.customInstructions')}
            icon={<EditIcon width={20} height={20} style={styles.rowIcon} />}
            onPress={() => navigation.push('/custom-system-prompt')}
          />
        </SettingsSection>
        <SettingsSection title={t('settings.appearance')}>
          <SettingsChoiceRow
            label={t('settings.theme')}
            options={THEME_OPTIONS}
            value={themePreference}
            onValueChange={setThemePreference}
          />
        </SettingsSection>
        <SettingsSection title={t('settings.chat')}>
          <SettingsToggleRow
            label={t('settings.responseSpeedStats')}
            description={t('settings.showWhatEachAnswerCost')}
            icon={
              <BenchmarkIcon width={20} height={20} style={styles.rowIcon} />
            }
            value={showPerformanceMetrics}
            onValueChange={setShowPerformanceMetrics}
          />
        </SettingsSection>
        <SettingsSection title={t('settings.dataControls')}>
          <SettingsRow
            label={t('settings.importChat')}
            icon={
              <DownloadIcon width={20} height={20} style={styles.rowIcon} />
            }
            onPress={importChat}
          />
          <SettingsRow
            label={t('settings.deleteAllChats_2')}
            icon={
              <TrashIcon
                width={20}
                height={20}
                style={styles.destructiveIcon}
              />
            }
            onPress={handleDeleteAllChats}
            destructive
          />
        </SettingsSection>
        <SettingsSection title={t('settings.about')}>
          <SettingsRow
            label={t('settings.appInfo')}
            icon={
              <InfoCircleIcon width={20} height={20} style={styles.rowIcon} />
            }
            onPress={() => navigation.push('/app-info')}
          />
        </SettingsSection>
      </ScrollView>
      <GlassScrollEdge anchor={headerHeight} />
      {ConfirmElement}
    </View>
  );
};

export default SettingsScreen;

const createStyles = (theme: Theme, headerHeight: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg.softPrimary,
    },
    scrollContent: {
      gap: space.six,
      paddingTop: headerHeight + 24,
      paddingHorizontal: space.four,
      paddingBottom: theme.insets.bottom + 16,
    },
    rowIcon: {
      color: theme.text.primary,
    },
    destructiveIcon: {
      color: theme.text.error,
    },
  });
