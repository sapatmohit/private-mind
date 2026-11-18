import { useTranslation } from "react-i18next";
import React, { useRef, useState } from 'react';
import { Text, StyleSheet, Alert, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useModelStore } from '../../store/modelStore';
import GlassScreenHeader, {
  useGlassScreenHeaderHeight,
} from '../../components/GlassScreenHeader';
import TextFieldInput from '../../components/TextFieldInput';
import { fontSizes, fontFamily } from '../../styles/fontStyles';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import PrimaryButton from '../../components/PrimaryButton';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Theme } from '../../styles/colors';
import { CustomKeyboardAvoidingView } from '../../components/CustomKeyboardAvoidingView';
import { space } from '../../constants/design-system';

export interface RemoteModelFormState {
  remoteModelPath: string;
  remoteTokenizerPath: string;
  remoteTokenizerConfigPath: string;
}

export default function AddRemoteModelScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const headerHeight = useGlassScreenHeaderHeight(true);
  const { styles } = useThemedStyles(createStyles, headerHeight);
  const scrollViewRef = useRef<ScrollView>(null);
  const { addModelToDB } = useModelStore();

  const [
    { remoteModelPath, remoteTokenizerPath, remoteTokenizerConfigPath },
    setFormState,
  ] = useState<RemoteModelFormState>({
    remoteModelPath: '',
    remoteTokenizerPath: '',
    remoteTokenizerConfigPath: '',
  });

  const setFormField = <K extends keyof RemoteModelFormState>(
    field: K,
    value: RemoteModelFormState[K]
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (
      !remoteModelPath ||
      !remoteTokenizerPath ||
      !remoteTokenizerConfigPath
    ) {
      Alert.alert(t("add-remote-model.missingFields"), t("add-remote-model.pleaseProvideAllNecessaryUrls"));
      return;
    }

    const modelName =
      remoteModelPath.split('/').pop()?.split('.')[0] || `model-${Date.now()}`;

    await addModelToDB({
      modelName,
      isDownloaded: false,
      source: 'remote',
      modelPath: remoteModelPath,
      tokenizerPath: remoteTokenizerPath,
      tokenizerConfigPath: remoteTokenizerConfigPath,
    });

    Toast.show({
      type: 'defaultToast',
      text1: t("add-remote-model.modelnameHasBeenSuccessfullyAdded", { modelName }),
    });

    router.back();
  };

  const scrollToBottom = async () => {
    if (Platform.OS === 'ios') {
      await new Promise((resolve) => setTimeout(resolve, 25));
      scrollViewRef.current?.scrollTo({ y: 500, animated: true });
    }
  };

  return (
    <CustomKeyboardAvoidingView
      isModalScreen
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
        >
          <Text style={styles.description}>
            {t("add-remote-model.addAModelFromHuggingface")}
          </Text>

          <View style={styles.textFieldSection}>
            <Text style={styles.label}>{t("add-remote-model.modelUrl")}</Text>
            <TextFieldInput
              value={remoteModelPath}
              multiline={true}
              onChangeText={(text) => setFormField('remoteModelPath', text)}
              placeholder={t("add-remote-model.enterExternalModelUrl")}
            />
          </View>

          <View style={styles.textFieldSection}>
            <Text style={styles.label}>{t("add-remote-model.tokenizerUrl")}</Text>
            <TextFieldInput
              value={remoteTokenizerPath}
              multiline={true}
              onChangeText={(text) => setFormField('remoteTokenizerPath', text)}
              placeholder={t("add-remote-model.enterExternalTokenizerUrl")}
              onFocus={scrollToBottom}
            />
          </View>

          <View style={styles.textFieldSection}>
            <Text style={styles.label}>{t("add-remote-model.tokenizerConfigUrl")}</Text>
            <TextFieldInput
              value={remoteTokenizerConfigPath}
              multiline={true}
              onChangeText={(text) =>
                setFormField('remoteTokenizerConfigPath', text)
              }
              placeholder={t("add-remote-model.enterExternalConfigUrl")}
              onFocus={scrollToBottom}
            />
          </View>
        </ScrollView>
        <PrimaryButton text="Add model" onPress={handleSave} />
      </View>
      <GlassScreenHeader
        title={t("add-remote-model.addExternalModel")}
        onBack={() => router.back()}
        icon="close"
        sheet
      />
    </CustomKeyboardAvoidingView>
  );
}

const createStyles = (theme: Theme, headerHeight: number) =>
  StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
      backgroundColor: theme.bg.softPrimary,
    },
    container: {
      flex: 1,
      paddingHorizontal: space.four,
      paddingBottom: theme.insets.bottom + 16,
      justifyContent: 'space-between',
    },
    scrollViewContent: {
      gap: space.six,
      paddingTop: headerHeight + 24,
      paddingBottom: space.four,
    },
    description: {
      fontFamily: fontFamily.regular,
      fontSize: fontSizes.md,
      color: theme.text.primary,
    },
    textFieldSection: {
      gap: space.four,
    },
    label: {
      fontSize: fontSizes.md,
      fontFamily: fontFamily.medium,
      color: theme.text.primary,
    },
  });
